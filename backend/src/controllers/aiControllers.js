const ApiError = require("../utils/ApiError.js");
const { OpenAI } = require("openai");
const {
  queryGetJobseekerDetail,
  queryGetJobDetailByUser,
} = require("../models/aiModels.js");


async function getEmbedding(text) {
  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  const res = await openai.embeddings.create({
    input: text,
    model: "text-embedding-3-small",
  });
  return res.data[0].embedding;
}

async function getAnalysProfile(jobText,candidateText) {
  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    // const prompt = `
    // You are a professional HR assistant. Analyze the following candidate profile compared to a job description.

    // Your response should be in strict JSON format with three fields:
    // - strengths: list of matched qualifications or skills.
    // - weaknesses: list of missing or insufficient qualifications or skills.
    // - suggestions: how the candidate can improve to be a better fit.

    // Job Description:
    // """
    // ${jobText}
    // """

    // Candidate Profile:
    // """
    // ${candidateText}
    // """
    // `;
  const prompt = `
  Bạn là chuyên gia tuyển dụng nhân sự. Hãy phân tích hồ sơ ứng viên sau đây so với mô tả công việc.

  Phản hồi của bạn phải ở định dạng JSON nghiêm ngặt với ba trường:
    - strengths: danh sách các bằng cấp hoặc kỹ năng phù hợp, số năm kinh nghiệm (nếu đủ so với yêu cầu), học vấn (nếu cao hơn hoặc bằng yêu cầu).
    - weaknesses: danh sách các bằng cấp hoặc kỹ năng còn thiếu hoặc không đủ, số năm kinh nghiệm (nếu không đủ so với yêu cầu), học vấn (nếu thấp hơn yêu cầu).
    - suggestions: ứng viên có thể cải thiện như thế nào để phù hợp hơn.

  Mô tả công việc:
  """
  ${jobText}
  """
  
  Hồ sơ ứng viên
  """
  ${candidateText}
  """
  `;
  const completion = await openai.chat.completions.create({
    model: "gpt-4",
    messages: [
      {
        role: "system",
        content: "Bạn là chuyên gia tư vấn nghề nghiệp và trợ lý nhân sự, trả lời ngắn gọn, chính xác, bằng tiêng việt ",
              // content: "Trả lời ngắn gọn, chính xác, luôn dùng JSON với 3 trường: strengths, weaknesses, suggestions"
      },
      {
        role: "user",
        content: prompt,
      },
    ],
    temperature: 0.2,
    max_tokens: 1024 // Giới hạn độ dài phản hồi
  });

  // Parse and return the JSON result
  const text = completion.choices[0].message.content;
  return text;
}


function cosineSimilarity(vecA, vecB) {
  const dot = vecA.reduce((sum, a, idx) => sum + a * vecB[idx], 0);
  const normA = Math.sqrt(vecA.reduce((sum, a) => sum + a * a, 0));
  const normB = Math.sqrt(vecB.reduce((sum, b) => sum + b * b, 0));
  return dot / (normA * normB);
}

function cleanText(text) {
  return (text || "")
    .replace(/%00endl/g, "\n")
    .replace(/<[^>]*>/g, "") // remove HTML tags
    .replace(/\s+/g, " ") // collapse whitespace
    .trim();
}

const scorematching = async (req, res, next) => {
  try {
    // const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    console.log(req.query)
    const { job_id } = req.query;
    const profile_id= req.user.id;
    if (!job_id || !profile_id) {
      return next(new ApiError("Thiếu thông tin job_id hoặc profile_id", 400));
    }
    const profile_data = await queryGetJobseekerDetail(profile_id);
    const job_data = await queryGetJobDetailByUser(job_id);
    if (!profile_data || !job_data) {
      return next(new ApiError("Không tìm thấy thông tin hồ sơ hoặc công việc", 404));
    }
    const candidateText = formatCandidateTextOptimized(profile_data);
    const jobText = formatJobPostingTextForOptimalEmbedding(job_data);

    const [embedCandidate, embedJob] = await Promise.all([
      getEmbedding(candidateText),
      getEmbedding(jobText),
    ]);

    const score = Math.round(cosineSimilarity(embedCandidate, embedJob)* 100,0) ;
       
    return res.success(score, "Phân tích thành công", 200);
  } catch (error) {
    console.error(error.message);
    return next(new ApiError("Error analyzing match", 500));
  }
};

const analyzeProfile = async (req, res, next) => {
  try {
    // const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    const { job_id } = req.query;
    const profile_id= req.user.id;
    if (!job_id || !profile_id) {
      return next(new ApiError("Thiếu thông tin job_id hoặc profile_id", 400));
    }
    const profile_data = await queryGetJobseekerDetail(profile_id);
    const job_data = await queryGetJobDetailByUser(job_id);
    if (!profile_data || !job_data) {
      return next(new ApiError("Không tìm thấy thông tin hồ sơ hoặc công việc", 404));
    }
    const candidateText = formatCandidateTextOptimized(profile_data);
    const jobText = formatJobPostingTextForOptimalEmbedding(job_data);
    console.log("Phân tích phản hồi từ AI:");
    let analysis;

    try {
      const text = await getAnalysProfile(jobText, candidateText);
      
      analysis = JSON.parse(text);
      
      // Kiểm tra cấu trúc JSON trả về
      if (!analysis.strengths || !analysis.weaknesses || !analysis.suggestions) {
        console.warn("API trả về thiếu trường JSON", analysis);
        // Có thể điền giá trị mặc định cho các trường bị thiếu
        analysis = {
          strengths: analysis.strengths || [],
          weaknesses: analysis.weaknesses || [],
          suggestions: analysis.suggestions || []
        };
      }
    } catch (jsonError) {
      console.error("Lỗi phân tích JSON:", jsonError.message);
      return next(new ApiError("Lỗi khi phân tích phản hồi từ AI", 500));
    }
    
    return res.success(analysis, "Phân tích thành công", 200);
  } catch (error) {
    console.error(error.message);
    return next(new ApiError("Error analyzing match", 500));
  }
};

function cleanText(text) {
  return (text || "")
    .replace(/%00endl/g, "\n") // Chú ý: bước này tạo ra \n
    .replace(/<[^>]*>/g, "") // Loại bỏ thẻ HTML
    .replace(/\s+/g, " ") // Bước này sẽ biến \n thành một khoảng trắng ' '
    .trim(); // Loại bỏ khoảng trắng thừa ở đầu/cuối
}

function formatCandidateTextOptimized(profile) {
  const descriptionParts = [];

  // --- Thông tin chung (Basic Info) - Ưu tiên lên đầu ---
  const basicInfo = [];
  // if (profile.full_name) basicInfo.push(`Ứng viên ${profile.full_name}.`); // Bỏ tên
  if (profile.title) basicInfo.push(`Vị trí ứng tuyển: ${profile.title}`);
  if (profile.level_name)
    basicInfo.push(`Cấp bậc hiện tại: ${profile.level_name}`);
  if (profile.year_exp !== null && profile.year_exp !== undefined) {
    basicInfo.push(`Số năm kinh nghiệm: ${profile.year_exp} năm`); // Thêm "năm"
  }
  if (profile.work_expected_place)
    basicInfo.push(`Nơi làm việc mong muốn: ${profile.work_expected_place}`);
  if (profile.salary_expect) {
    try {
      const formattedSalary = profile.salary_expect.toLocaleString("vi-VN");
      basicInfo.push(`Mức lương mong muốn khoảng: ${formattedSalary} VND`);
    } catch (e) {
      basicInfo.push(`Mức lương mong muốn: ${profile.salary_expect}`);
    }
  }
  if (basicInfo.length > 0) {
    // Nối các thông tin cơ bản bằng chấm phẩy
    descriptionParts.push("Thông tin chung: " + basicInfo.join(" ; ") + ".");
  }

  // --- Kỹ năng (Skills) - Ưu tiên cao ---
  if (
    profile.skill_info &&
    Array.isArray(profile.skill_info) &&
    profile.skill_info.length > 0
  ) {
    const skillNames = profile.skill_info
      .map((skill) => (skill ? skill.skill_name : null))
      .filter(Boolean);
    if (skillNames.length > 0) {
      // Nối kỹ năng bằng phẩy
      descriptionParts.push(`Kỹ năng: ${skillNames.join(", ")}.`);
    }
  }

  // --- Kinh nghiệm làm việc (Experience) - Rất quan trọng ---
  if (
    profile.experience_info &&
    Array.isArray(profile.experience_info) &&
    profile.experience_info.length > 0
  ) {
    const expTexts = profile.experience_info
      .map((exp) => {
        if (!exp) return null;
        const parts = [];
        // Định dạng lại nhãn và nội dung
        if (exp.exp_title) parts.push(`Chức danh: ${exp.exp_title}`);
        if (exp.exp_company) parts.push(`Công ty: ${exp.exp_company}`);
        // Thêm thời gian nếu cần (tùy cân nhắc)
        // if (exp.exp_from && exp.exp_to) parts.push(`Thời gian: ${exp.exp_from} - ${exp.exp_to}`);

        let mainInfo = parts.join(" ; "); // Nối chức danh, công ty bằng chấm phẩy
        if (exp.exp_description) {
          // Tách mô tả công việc bằng dấu chấm và khoảng trắng
          if (mainInfo) mainInfo += ". ";
          mainInfo += `Mô tả công việc: ${exp.exp_description}`;
        }
        return mainInfo ? mainInfo + "." : null; // Kết thúc mỗi kinh nghiệm bằng dấu chấm
      })
      .filter(Boolean);

    if (expTexts.length > 0) {
      // Nối các mục kinh nghiệm bằng xuống dòng \n
      descriptionParts.push("Kinh nghiệm làm việc:\n" + expTexts.join("\n"));
    }
  }

  // --- Dự án đã tham gia (Projects) - Hỗ trợ kinh nghiệm ---
  if (
    profile.project_info &&
    Array.isArray(profile.project_info) &&
    profile.project_info.length > 0
  ) {
    const projectTexts = profile.project_info
      .map((proj) => {
        if (!proj) return null;
        const parts = [];
        // Định dạng lại nhãn và nội dung
        if (proj.project_name) parts.push(`Tên dự án: ${proj.project_name}`);
        // Thêm thời gian nếu cần
        // if (proj.project_from && proj.project_to) parts.push(`Thời gian: ${proj.project_from} - ${proj.project_to}`);

        let mainInfo = parts.join(" ; "); // Nối tên dự án, thời gian bằng chấm phẩy
        if (proj.project_description) {
          // Tách mô tả dự án bằng dấu chấm và khoảng trắng
          if (mainInfo) mainInfo += ". ";
          mainInfo += `Mô tả: ${proj.project_description}`;
        }
        return mainInfo ? mainInfo + "." : null; // Kết thúc mỗi dự án bằng dấu chấm
      })
      .filter(Boolean);

    if (projectTexts.length > 0) {
      // Nối các mục dự án bằng xuống dòng \n
      descriptionParts.push("Dự án đã tham gia:\n" + projectTexts.join("\n"));
    }
  }

  // --- Học vấn (Education) ---
  if (
    profile.education_info &&
    Array.isArray(profile.education_info) &&
    profile.education_info.length > 0
  ) {
    const eduTexts = profile.education_info
      .map((edu) => {
        if (!edu) return null;
        const parts = [];
        if (edu.education_title) parts.push(`Bằng: ${edu.education_title}`);
        if (edu.major) parts.push(`Chuyên ngành: ${edu.major}`);
        if (edu.school) parts.push(`Trường: ${edu.school}`);
        // Thêm thời gian nếu cần
        // if (edu.from_ && edu.to_) parts.push(`Thời gian: ${edu.from_} - ${edu.to_})`);
        return parts.length > 0 ? parts.join(" ; ") + "." : null; // Nối bằng chấm phẩy, kết thúc bằng dấu chấm
      })
      .filter(Boolean);

    if (eduTexts.length > 0) {
      // Nối các mục học vấn bằng xuống dòng \n
      descriptionParts.push("Học vấn:\n" + eduTexts.join("\n"));
    }
  }

  // --- Chứng chỉ (Certifications) ---
  if (
    profile.certification_info &&
    Array.isArray(profile.certification_info) &&
    profile.certification_info.length > 0
  ) {
    const certTexts = profile.certification_info
      .map((cert) => {
        if (!cert || !cert.certification) return null;
        let certDesc = cert.certification;
        // Thêm thông tin khác nếu cần, ví dụ: ngày cấp, đơn vị cấp...
        // if (cert.month) certDesc += ` (Tháng ${cert.month})`;
        return `${certDesc}.`; // Chỉ cần tên chứng chỉ, kết thúc bằng dấu chấm
      })
      .filter(Boolean);

    if (certTexts.length > 0) {
      // Nối các mục chứng chỉ bằng xuống dòng \n
      descriptionParts.push("Chứng chỉ:\n" + certTexts.join("\n"));
    }
  }

  // --- Ngôn ngữ (Languages) ---
  if (
    profile.language_info &&
    Array.isArray(profile.language_info) &&
    profile.language_info.length > 0
  ) {
    const langTexts = profile.language_info
      .map((lang) => {
        if (!lang || !lang.language_name) return null;
        const parts = [lang.language_name];
        // Chuẩn hóa cách hiển thị trình độ
        if (lang.metric_display) {
          parts.push(`(${lang.metric_display})`);
        } else if (lang.language_metrict) {
          parts.push(`(${lang.language_metrict})`);
        }
        return parts.join(" ") + "."; // Nối tên và trình độ, kết thúc bằng dấu chấm
      })
      .filter(Boolean);

    if (langTexts.length > 0) {
      // Nối các mục ngôn ngữ bằng xuống dòng \n
      descriptionParts.push(`Ngôn ngữ:\n${langTexts.join("\n")}`);
    }
  }

  // Kết hợp các phần thành một chuỗi văn bản duy nhất, phân tách các section chính bằng \n\n
  return descriptionParts.join("\n\n").trim();
}

/**
 * Chuyển đổi thông tin tin tuyển dụng thành chuỗi văn bản cô đọng, tối ưu cho embedding.
 * Tập trung vào từ khóa và loại bỏ các từ đệm không cần thiết.
 *
 * @param {object} jobPosting - Đối tượng chứa thông tin tin tuyển dụng.
 * @returns {string} - Chuỗi văn bản cô đọng cho embedding.
 */
function formatJobPostingTextForOptimalEmbedding(jobPosting) {
  if (!jobPosting) {
    // console.warn("Dữ liệu tin tuyển dụng không hợp lệ hoặc bị thiếu."); // Có thể bỏ qua log này
    return "";
  }

  const parts = [];

  // 1. Chức danh, Công ty (Từ khóa cốt lõi)
  const coreIdentity = [];
  if (jobPosting.title) coreIdentity.push(jobPosting.title.trim());
  if (jobPosting.company_name)
    coreIdentity.push(jobPosting.company_name.trim());
  if (coreIdentity.length > 0) parts.push(coreIdentity.join(" "));

  // 2. Thuộc tính chính: Cấp bậc, Hình thức làm việc, Địa điểm
  const keyAttributes = [];
  if (jobPosting.job_level_name)
    keyAttributes.push(jobPosting.job_level_name.trim());
  if (jobPosting.working_type) {
    let type = jobPosting.working_type.toLowerCase().trim();
    // Giữ nguyên hoặc chuyển sang dạng ngắn gọn nếu cần, ví dụ: 'full-time' -> 'toàn thời gian'
    if (type === "full-time") type = "toàn thời gian";
    else if (type === "part-time") type = "bán thời gian";
    keyAttributes.push(type);
  }
  if (jobPosting.work_location_name)
    keyAttributes.push(jobPosting.work_location_name.trim());
  if (keyAttributes.length > 0) parts.push(keyAttributes.join(" "));

  // 3. Mức lương (Quan trọng, giữ lại nhãn tối thiểu "Lương")
  let salaryText = "";
  if (jobPosting.salary_min && jobPosting.salary_max) {
    salaryText = `Lương ${jobPosting.salary_min} - ${jobPosting.salary_max} USD`; // Giả sử USD
  } else if (jobPosting.salary_min) {
    salaryText = `Lương từ ${jobPosting.salary_min} USD`;
  } else if (jobPosting.salary_max) {
    salaryText = `Lương đến ${jobPosting.salary_max} USD`;
  }
  if (salaryText) parts.push(salaryText);

  // 4. Kinh nghiệm (Quan trọng, giữ lại nhãn tối thiểu "Kinh nghiệm")
  if (
    jobPosting.require_experience !== null &&
    jobPosting.require_experience !== undefined
  ) {
    if (jobPosting.require_experience > 0) {
      parts.push(`Kinh nghiệm ${jobPosting.require_experience} năm`);
    } else {
      // Có thể bỏ qua nếu "Không yêu cầu kinh nghiệm" không thêm nhiều giá trị cho embedding
      // Hoặc giữ lại nếu nó là một yếu tố phân biệt quan trọng
      parts.push("Kinh nghiệm không yêu cầu");
    }
  }

  // 5. Ngành nghề & Lĩnh vực chuyên môn (Giữ nhãn tối thiểu "Ngành", "Chuyên môn")
  const industryFunction = [];
  if (
    jobPosting.industry_name &&
    jobPosting.industry_name.toLowerCase() !== "không yêu cầu"
  ) {
    industryFunction.push(`Ngành ${jobPosting.industry_name.trim()}`);
  }
  if (
    jobPosting.job_function_name &&
    jobPosting.job_function_name.toLowerCase() !== "không yêu cầu"
  ) {
    industryFunction.push(`Chuyên môn ${jobPosting.job_function_name.trim()}`);
  }
  if (industryFunction.length > 0) parts.push(industryFunction.join(" "));

  // 6. Mô tả công việc (Trường "describle" - nội dung chính, giữ nhãn "Mô tả")
  // cleanText sẽ biến các %00endl thành khoảng trắng, tạo thành một khối văn bản dài.
  if (jobPosting.describle) {
    const cleanedDescription = cleanText(jobPosting.describle);
    if (cleanedDescription) parts.push(`Mô tả: ${cleanedDescription}`);
  }

  // 7. Yêu cầu thêm (Nội dung chính, giữ nhãn "Yêu cầu")
  if (jobPosting.more_requirements) {
    const cleanedRequirements = cleanText(jobPosting.more_requirements);
    if (cleanedRequirements) parts.push(`Yêu cầu: ${cleanedRequirements}`);
  }

  // 8. Kỹ năng (Danh sách từ khóa, giữ nhãn "Kỹ năng")
  if (
    jobPosting.job_skills &&
    Array.isArray(jobPosting.job_skills) &&
    jobPosting.job_skills.length > 0
  ) {
    const skillNames = jobPosting.job_skills
      .map((skill) =>
        skill && skill.skill_name ? skill.skill_name.trim() : null
      )
      .filter(Boolean);
    if (skillNames.length > 0) {
      // Nối các kỹ năng bằng khoảng trắng thay vì gạch đầu dòng
      parts.push(`Kỹ năng: ${skillNames.join(" ")}`);
    }
  }

  // 9. Ngôn ngữ (Danh sách, giữ nhãn "Ngôn ngữ")
  if (
    jobPosting.languages &&
    Array.isArray(jobPosting.languages) &&
    jobPosting.languages.length > 0
  ) {
    const langTexts = jobPosting.languages
      .map((lang) => {
        if (!lang || !lang.language_name) return null;
        let langDesc = lang.language_name.trim();
        if (lang.metric_display) {
          langDesc += ` (${lang.metric_display.trim()})`;
        }
        return langDesc;
      })
      .filter(Boolean);
    if (langTexts.length > 0) {
      // Nối bằng khoảng trắng
      parts.push(`Ngôn ngữ: ${langTexts.join(" ")}`);
    }
  }

  // 10. Chứng chỉ (Danh sách, giữ nhãn "Chứng chỉ")
  if (
    jobPosting.certification &&
    Array.isArray(jobPosting.certification) &&
    jobPosting.certification.length > 0
  ) {
    const certTexts = jobPosting.certification
      .map((cert) =>
        cert && cert.certification ? cert.certification.trim() : null
      )
      .filter(Boolean);
    if (certTexts.length > 0) {
      // Nối bằng khoảng trắng
      parts.push(`Chứng chỉ: ${certTexts.join(" ")}`);
    }
  }

  // Nối các phần chính bằng ký tự xuống dòng "\n" để có một chút phân tách ngữ nghĩa giữa các khối thông tin.
  // Loại bỏ các phần rỗng (nếu có) trước khi join.
  return parts.filter((part) => part && part.length > 0).join("\n");
}

module.exports = {
  scorematching,
  analyzeProfile
};
