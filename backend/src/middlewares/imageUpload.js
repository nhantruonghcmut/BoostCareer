const multer = require("multer");
const { PutObjectCommand } = require("@aws-sdk/client-s3");
const path = require("path");
const s3 = require("../config/s3Config"); // Import cấu hình S3
const dotenv = require("dotenv");
const { v7: uuidv7 } = require("uuid"); // Thư viện tạo tên file duy nhất
const { DeleteObjectCommand } = require("@aws-sdk/client-s3");
dotenv.config();

// Cấu hình multer để xử lý file trước khi upload lên S3
const storage = multer.memoryStorage(); // Lưu file vào RAM trước khi upload

const upload = multer({
  storage: storage,
  limits: { fileSize: 250 * 1024 * 1024 }, // Giới hạn 5MB
});

const uploadImgToS3_jobseeker = async (file,userId) => {
  const fileExtension = path.extname(file.originalname);
  const fileName = `jobseeker/profile_avatar/${userId}/${uuidv7()}${fileExtension}`;

  const params = {
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: fileName,
    Body: file.buffer,
    ContentType: file.mimetype,
    ACL: "public-read", // Cho phép truy cập công khai
  };

  await s3.send(new PutObjectCommand(params));

  return `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileName}`;
};
const uploadImgToS3_employer = async (file,userId) => {
  const fileExtension = path.extname(file.originalname);
  const fileName = `employer/${userId}/${uuidv7()}${fileExtension}`;

  const params = {
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: fileName,
    Body: file.buffer,
    ContentType: file.mimetype,
    ACL: "public-read", // Cho phép truy cập công khai
  };

  await s3.send(new PutObjectCommand(params));

  return `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileName}`;
};
// Add a new function for CV uploads
const uploadToS3CV = async (file, userId) => {
  const fileExtension = path.extname(file.originalname);
  const safeOriginalName = file.originalname.replace(/[^a-zA-Z0-9.-]/g, '_');
  const uniqueId = uuidv7();
  
  // Create path with userId folder and unique filename
  const fileName = `jobseeker/profile_cv/${userId}/${uniqueId}_${safeOriginalName}`;

  // Log để debug
  // console.log("Uploading file to S3:", {
  //   bucketName: process.env.AWS_BUCKET_NAME,
  //   fileName: fileName,
  //   contentType: file.mimetype
  // });

  const params = {
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: fileName,
    Body: file.buffer,
    ContentType: file.mimetype || 'application/octet-stream', // Default content type if missing
    ACL: "public-read"  // Removed ContentDisposition to simplify
  };

  await s3.send(new PutObjectCommand(params));

  return {
    url: `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileName}`,
    filename: file.originalname,
    key: fileName
  };
};


const deleteFileFromS3 = async (fileKey) => {
  try {
    let key = fileKey;
    
    // If fileKey is a URL, extract the key
    if (fileKey && fileKey.startsWith('http')) {
      const urlParts = fileKey.split('/');
      // Skip protocol and bucket name
      key = urlParts.slice(3).join('/');
    }

    console.log("Deleting file from S3:", { bucket: process.env.AWS_BUCKET_NAME, key });
    
    const params = {
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: key
    };
    
    await s3.send(new DeleteObjectCommand(params));
    console.log("File deleted successfully from S3");
    return true;
  } catch (error) {
    console.error("Error deleting file from S3:", error);
    return false; // Return false instead of throwing error for better error handling
  }
};
module.exports = { upload, uploadImgToS3_jobseeker, uploadImgToS3_employer, uploadToS3CV, deleteFileFromS3 };
