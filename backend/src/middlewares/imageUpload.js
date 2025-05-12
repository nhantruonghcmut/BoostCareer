const multer = require("multer");
const { PutObjectCommand } = require("@aws-sdk/client-s3");
const path = require("path");
const s3 = require("../config/s3Config"); // Import cấu hình S3
const dotenv = require("dotenv");
const { v4: uuidv4 } = require("uuid"); // Thư viện tạo tên file duy nhất
const { DeleteObjectCommand } = require("@aws-sdk/client-s3");
dotenv.config();

// Cấu hình multer để xử lý file trước khi upload lên S3
const storage = multer.memoryStorage(); // Lưu file vào RAM trước khi upload

const upload = multer({
  storage: storage,
  limits: { fileSize: 50 * 1024 * 1024 }, // Giới hạn 5MB
});

const uploadToS3 = async (file) => {
  const fileExtension = path.extname(file.originalname);
  const fileName = `uploads/${uuidv4()}${fileExtension}`;

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
  const uniqueId = uuidv4();
  
  // Create path with userId folder and unique filename
  const fileName = `uploads/cv/${userId}/${uniqueId}_${safeOriginalName}`;

  const params = {
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: fileName,
    Body: file.buffer,
    ContentType: file.mimetype,
    ContentDisposition: 'inline; filename=' + file.originalname,
    ACL: "public-read"
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
    if (fileKey.startsWith('http')) {
      const urlParts = fileKey.split('/');
      // Skip protocol and bucket name
      key = urlParts.slice(3).join('/');
    }
    
    const params = {
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: key
    };
    
    await s3.send(new DeleteObjectCommand(params));
    return true;
  } catch (error) {
    console.error("Error deleting file from S3:", error);
    throw error;
  }
};
module.exports = { upload, uploadToS3, uploadToS3CV,deleteFileFromS3 };
