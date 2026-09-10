import axios from "axios";
import { OpenAI } from "openai";

const PROVIDERS = new Set(["openai", "gemini", "openrouter"]);

const DEFAULT_EMBEDDING_MODELS = {
  openai: "text-embedding-3-small",
  gemini: "gemini-embedding-001",
  openrouter: "openai/text-embedding-3-small",
};

const DEFAULT_CHAT_MODELS = {
  openai: "gpt-4",
  gemini: "gemini-1.5-flash",
  openrouter: "openai/gpt-4o-mini",
};

const OPENROUTER_BASE_URL = "https://openrouter.ai/api/v1";
const GEMINI_BASE_URL = "https://generativelanguage.googleapis.com/v1beta";

function normalizeProvider(provider, fallback = "openai") {
  const normalized = (provider || fallback).toLowerCase().trim();
  if (!PROVIDERS.has(normalized)) {
    throw new Error(
      `Unsupported AI provider "${provider}". Use one of: ${Array.from(PROVIDERS).join(", ")}`
    );
  }
  return normalized;
}

function getProviderApiKey(provider) {
  switch (provider) {
    case "openai":
      return process.env.OPENAI_API_KEY;
    case "gemini":
      return process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;
    case "openrouter":
      return process.env.OPENROUTER_API_KEY;
    default:
      return null;
  }
}

function requireApiKey(provider) {
  const apiKey = getProviderApiKey(provider);
  if (!apiKey) {
    throw new Error(`Missing API key for AI provider "${provider}"`);
  }
  return apiKey;
}

function getEmbeddingConfig() {
  const provider = normalizeProvider(
    process.env.AI_EMBEDDING_PROVIDER || process.env.AI_PROVIDER,
    "openai"
  );

  return {
    provider,
    apiKey: requireApiKey(provider),
    model: process.env.AI_EMBEDDING_MODEL || DEFAULT_EMBEDDING_MODELS[provider],
  };
}

function getChatConfig() {
  const provider = normalizeProvider(
    process.env.AI_CHAT_PROVIDER || process.env.AI_PROVIDER,
    "openai"
  );

  return {
    provider,
    apiKey: requireApiKey(provider),
    model: process.env.AI_CHAT_MODEL || DEFAULT_CHAT_MODELS[provider],
  };
}

function createOpenAICompatibleClient(provider, apiKey) {
  const timeout = Number(process.env.AI_PROVIDER_TIMEOUT_MS || 30000);

  if (provider === "openrouter") {
    return new OpenAI({
      apiKey,
      baseURL: process.env.OPENROUTER_BASE_URL || OPENROUTER_BASE_URL,
      timeout,
      defaultHeaders: {
        "HTTP-Referer": process.env.OPENROUTER_SITE_URL || "https://boostcareer.site",
        "X-Title": process.env.OPENROUTER_APP_NAME || "BoostCareer",
      },
    });
  }

  return new OpenAI({ apiKey, timeout });
}

function normalizeGeminiModel(model) {
  return model.startsWith("models/") ? model : `models/${model}`;
}

async function getOpenAICompatibleEmbedding(text, config) {
  const client = createOpenAICompatibleClient(config.provider, config.apiKey);
  const response = await client.embeddings.create({
    input: text,
    model: config.model,
  });

  return response.data?.[0]?.embedding;
}

async function getGeminiEmbedding(text, config) {
  const model = normalizeGeminiModel(config.model);
  const body = {
    content: {
      parts: [{ text }],
    },
    taskType: process.env.AI_EMBEDDING_TASK_TYPE || "SEMANTIC_SIMILARITY",
  };

  const outputDimensionality = Number(process.env.AI_EMBEDDING_DIMENSIONS);
  if (Number.isInteger(outputDimensionality) && outputDimensionality > 0) {
    body.outputDimensionality = outputDimensionality;
  }

  const response = await axios.post(
    `${GEMINI_BASE_URL}/${model}:embedContent`,
    body,
    {
      params: { key: config.apiKey },
      timeout: Number(process.env.AI_PROVIDER_TIMEOUT_MS || 30000),
    }
  );

  return response.data?.embedding?.values;
}

async function getEmbedding(text) {
  const config = getEmbeddingConfig();
  const embedding =
    config.provider === "gemini"
      ? await getGeminiEmbedding(text, config)
      : await getOpenAICompatibleEmbedding(text, config);

  if (!Array.isArray(embedding) || embedding.length === 0) {
    throw new Error(`AI provider "${config.provider}" returned an empty embedding`);
  }

  return embedding;
}

function buildAnalysisPrompt(jobText, candidateText) {
  return `
Bạn là chuyên gia tuyển dụng nhân sự. Hãy phân tích hồ sơ ứng viên sau đây so với mô tả công việc.

Phản hồi bắt buộc là JSON hợp lệ, không bọc markdown, gồm đúng 3 trường:
- strengths: mảng các điểm mạnh/phần khớp với job.
- weaknesses: mảng các điểm thiếu hoặc chưa đủ so với job.
- suggestions: mảng gợi ý cải thiện cụ thể cho ứng viên.

Mô tả công việc:
"""
${jobText}
"""

Hồ sơ ứng viên:
"""
${candidateText}
"""
`;
}

async function getOpenAICompatibleAnalysis(jobText, candidateText, config) {
  const client = createOpenAICompatibleClient(config.provider, config.apiKey);
  const response = await client.chat.completions.create({
    model: config.model,
    messages: [
      {
        role: "system",
        content:
          "Bạn là chuyên gia tư vấn nghề nghiệp và trợ lý nhân sự. Luôn trả lời bằng JSON hợp lệ.",
      },
      {
        role: "user",
        content: buildAnalysisPrompt(jobText, candidateText),
      },
    ],
    temperature: 0.2,
    max_tokens: Number(process.env.AI_CHAT_MAX_TOKENS || 1024),
  });

  return response.choices?.[0]?.message?.content;
}

async function getGeminiAnalysis(jobText, candidateText, config) {
  const model = normalizeGeminiModel(config.model);
  const response = await axios.post(
    `${GEMINI_BASE_URL}/${model}:generateContent`,
    {
      systemInstruction: {
        parts: [
          {
            text: "Bạn là chuyên gia tư vấn nghề nghiệp và trợ lý nhân sự. Luôn trả lời bằng JSON hợp lệ.",
          },
        ],
      },
      contents: [
        {
          role: "user",
          parts: [{ text: buildAnalysisPrompt(jobText, candidateText) }],
        },
      ],
      generationConfig: {
        temperature: 0.2,
        maxOutputTokens: Number(process.env.AI_CHAT_MAX_TOKENS || 1024),
        responseMimeType: "application/json",
      },
    },
    {
      params: { key: config.apiKey },
      timeout: Number(process.env.AI_PROVIDER_TIMEOUT_MS || 30000),
    }
  );

  return response.data?.candidates?.[0]?.content?.parts?.[0]?.text;
}

function parseJsonResponse(text) {
  if (!text || typeof text !== "string") {
    throw new Error("AI response is empty");
  }

  const trimmed = text.trim();
  const withoutFence = trimmed
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/```$/i, "")
    .trim();

  try {
    return JSON.parse(withoutFence);
  } catch (error) {
    const firstBrace = withoutFence.indexOf("{");
    const lastBrace = withoutFence.lastIndexOf("}");
    if (firstBrace >= 0 && lastBrace > firstBrace) {
      return JSON.parse(withoutFence.slice(firstBrace, lastBrace + 1));
    }
    throw error;
  }
}

function normalizeAnalysis(analysis) {
  return {
    strengths: Array.isArray(analysis?.strengths) ? analysis.strengths : [],
    weaknesses: Array.isArray(analysis?.weaknesses) ? analysis.weaknesses : [],
    suggestions: Array.isArray(analysis?.suggestions) ? analysis.suggestions : [],
  };
}

async function analyzeProfileFit(jobText, candidateText) {
  const config = getChatConfig();
  const rawText =
    config.provider === "gemini"
      ? await getGeminiAnalysis(jobText, candidateText, config)
      : await getOpenAICompatibleAnalysis(jobText, candidateText, config);

  return normalizeAnalysis(parseJsonResponse(rawText));
}

function getAIProviderRuntimeConfig() {
  const embedding = getEmbeddingConfig();
  const chat = getChatConfig();

  return {
    embedding: {
      provider: embedding.provider,
      model: embedding.model,
    },
    chat: {
      provider: chat.provider,
      model: chat.model,
    },
  };
}

export { getEmbedding, analyzeProfileFit, getAIProviderRuntimeConfig };
