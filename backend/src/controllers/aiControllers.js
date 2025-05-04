const ApiError = require("../utils/ApiError.js");
const { OpenAI } = require('openai');
const {
  queryGetJobseekerDetail ,
  queryGetJobDetailByUser,
} = require("../models/aiModels.js");

async function getEmbedding(text) {
  const res = await openai.embeddings.create({
    input: text,
    model: "text-embedding-3-small"
  });
  return res.data[0].embedding;
}

function cosineSimilarity(vecA, vecB) {
  const dot = vecA.reduce((sum, a, idx) => sum + a * vecB[idx], 0);
  const normA = Math.sqrt(vecA.reduce((sum, a) => sum + a * a, 0));
  const normB = Math.sqrt(vecB.reduce((sum, b) => sum + b * b, 0));
  return dot / (normA * normB);
}

const compare = async (req, res, next) => {
  try {
    // const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    const {job_id,profile_id} = req.body;

    const profile_data = await queryGetJobseekerDetail(profile_id);
    const job_data = await queryGetJobDetailByUser(job_id);

    // const candidateText = formatCandidateText(profile_data);
    // const jobText = formatJobText(job_data[0]);
  
    // const [embedCandidate, embedJob] = await Promise.all([
    //   getEmbedding(candidateText),
    //   getEmbedding(jobText)
    // ]);
  
    // const score = cosineSimilarity(embedCandidate, embedJob);
    // res.json({ match_score: score });


    if (!profile_data) {
      return next(new ApiError("Không tìm thấy bài đăng", 404));
    }
      // console.log("data", data);
    return res.success(profile_data, "Lấy chi tiết bài đăng thành công");
  } catch (err) {
    return next(new ApiError("Lỗi khi lấy chi tiết bài đăng", 500));
  }
};

function cleanText(text) {
  return (text || '')
    .replace(/%00endl/g, '\n')
    .replace(/<[^>]*>/g, '')         // remove HTML tags
    .replace(/\s+/g, ' ')            // collapse whitespace
    .trim();
}

function formatCandidateText(candidate) {
  const experience = candidate.experience_info?.map(e =>
    `${cleanText(e.exp_title)} tại ${cleanText(e.exp_company)}: ${cleanText(e.exp_description)}`
  ).join('. ') || '';

  const projects = candidate.project_info?.map(p =>
    `${cleanText(p.project_name)}: ${cleanText(p.project_description)}`
  ).join('. ') || '';

  const skills = candidate.skill_info?.map(s => cleanText(s.skill_name)).join(', ') || '';

  const education = candidate.education_info?.map(ed =>
    `${cleanText(ed.major)} tại ${cleanText(ed.school)}`
  ).join('. ') || '';

  const certifications = candidate.certification_info?.map(c =>
    cleanText(c.certification)
  ).join(', ') || '';

  const languages = candidate.language_info?.map(l =>
    `${cleanText(l.language_name)} (${cleanText(l.metric_display)})`
  ).join(', ') || '';

  return `
    Tiêu đề hồ sơ: ${cleanText(candidate.title)}
    Mục tiêu nghề nghiệp: ${cleanText(candidate.career_target)}
    Kinh nghiệm: ${experience}
    Dự án: ${projects}
    Kỹ năng: ${skills}
    Học vấn: ${education}
    Chứng chỉ: ${certifications}
    Ngôn ngữ: ${languages}
  `;
}

function formatJobText(job) {
  const description = cleanText(job.describle);
  const requirements = cleanText(job.more_requirements);
  const skills = job.job_skills?.map(s => cleanText(s.skill_name)).join(', ') || '';

  return `
    Tiêu đề công việc: ${cleanText(job.title)}
    Mô tả công việc: ${description}
    Yêu cầu bổ sung: ${requirements}
    Kỹ năng cần có: ${skills}
  `;
}


module.exports = {
  compare
};
