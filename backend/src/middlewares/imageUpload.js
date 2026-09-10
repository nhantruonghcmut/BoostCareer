import multer from "multer";
import path from "path";
import { PutObjectCommand, DeleteObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { v7 as uuidv7 } from "uuid";
import s3 from "../config/s3Config.js";
import env from "../config/env.js";
import logger from "../utils/logger.js";
import ApiError from "../utils/ApiError.js";

const IMAGE_MIME = new Set(["image/jpeg", "image/png", "image/webp", "image/gif"]);
const IMAGE_EXT = new Set([".jpg", ".jpeg", ".png", ".webp", ".gif"]);

const CV_MIME = new Set([
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
]);
const CV_EXT = new Set([".pdf", ".doc", ".docx"]);

/**
 * Chặn ở CẢ mimetype lẫn extension. Chỉ kiểm tra một trong hai là bỏ lọt:
 * mimetype do client gửi (giả được), extension do tên file (giả được).
 */
const makeFilter = (mimeSet, extSet, label) => (req, file, cb) => {
  const ext = path.extname(file.originalname || "").toLowerCase();
  if (!mimeSet.has(file.mimetype) || !extSet.has(ext)) {
    return cb(new ApiError(`Chỉ chấp nhận file ${label}`, 400), false);
  }
  return cb(null, true);
};

const makeUploader = ({ maxBytes, mimeSet, extSet, label }) =>
  multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: maxBytes, files: 1, fields: 20 },
    fileFilter: makeFilter(mimeSet, extSet, label),
  });

export const uploadImage = makeUploader({
  maxBytes: env.upload.imageMaxBytes,
  mimeSet: IMAGE_MIME,
  extSet: IMAGE_EXT,
  label: "ảnh (jpg, png, webp, gif)",
});

export const uploadCv = makeUploader({
  maxBytes: env.upload.cvMaxBytes,
  mimeSet: CV_MIME,
  extSet: CV_EXT,
  label: "CV (pdf, doc, docx)",
});

/** @deprecated Dùng uploadImage / uploadCv. Giữ lại để route cũ không vỡ. */
export const upload = uploadImage;

const publicUrl = (key) => `https://${env.s3.bucket}.s3.${env.s3.region}.amazonaws.com/${key}`;

const normalizeKey = (fileKey) => {
  if (typeof fileKey === "string" && fileKey.startsWith("http")) {
    return fileKey.split("/").slice(3).join("/");
  }
  return fileKey;
};

const putObject = async ({ key, file, publicRead }) => {
  await s3.send(
    new PutObjectCommand({
      Bucket: env.s3.bucket,
      Key: key,
      Body: file.buffer,
      ContentType: file.mimetype || "application/octet-stream",
      ...(publicRead ? { ACL: "public-read" } : {}),
    })
  );
};

const safeExtension = (originalname) => {
  const ext = path.extname(originalname || "").toLowerCase();
  return /^\.[a-z0-9]{1,8}$/.test(ext) ? ext : "";
};

/** Trả URL có hạn cho object private. Trả null nếu không presign được. */
export const getSignedFileUrl = async (fileKey, ttlSeconds = env.upload.signedUrlTtlSeconds) => {
  if (!fileKey) return null;
  const key = normalizeKey(fileKey);
  try {
    return await getSignedUrl(s3, new GetObjectCommand({ Bucket: env.s3.bucket, Key: key }), {
      expiresIn: ttlSeconds,
    });
  } catch (error) {
    logger.error("Không tạo được presigned URL", { key, message: error.message });
    return null;
  }
};

export const uploadImgToS3_jobseeker = async (file, userId) => {
  const key = `jobseeker/profile_avatar/${userId}/${uuidv7()}${safeExtension(file.originalname)}`;
  await putObject({ key, file, publicRead: true });
  return publicUrl(key);
};

export const uploadImgToS3_employer = async (file, userId) => {
  const key = `employer/${userId}/${uuidv7()}${safeExtension(file.originalname)}`;
  await putObject({ key, file, publicRead: true });
  return publicUrl(key);
};

/**
 * CV chứa PII (họ tên, SĐT, địa chỉ, lịch sử làm việc).
 * Khi S3_CV_PRIVATE=true, object KHÔNG public-read và phải đọc qua presigned URL.
 * Mặc định false để không vỡ read-path cũ - bật sau khi hoàn tất Phase 1C.
 */
export const uploadToS3CV = async (file, userId) => {
  const safeName = (file.originalname || "cv").replace(/[^a-zA-Z0-9.\-]/g, "_").slice(-80);
  const key = `jobseeker/profile_cv/${userId}/${uuidv7()}_${safeName}`;

  await putObject({ key, file, publicRead: !env.upload.privateCv });

  return {
    url: env.upload.privateCv ? await getSignedFileUrl(key) : publicUrl(key),
    filename: file.originalname,
    key,
  };
};

export const deleteFileFromS3 = async (fileKey) => {
  try {
    const key = normalizeKey(fileKey);
    await s3.send(new DeleteObjectCommand({ Bucket: env.s3.bucket, Key: key }));
    logger.info("Đã xoá file trên S3", { key });
    return true;
  } catch (error) {
    logger.error("Lỗi khi xoá file trên S3", { fileKey, message: error.message });
    return false;
  }
};

export default {
  upload,
  uploadImage,
  uploadCv,
  uploadImgToS3_jobseeker,
  uploadImgToS3_employer,
  uploadToS3CV,
  getSignedFileUrl,
  deleteFileFromS3,
};
