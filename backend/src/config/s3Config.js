const { S3Client } = require("@aws-sdk/client-s3");
const dotenv = require("dotenv");
const path = require('path');

// Đảm bảo load file .env từ đúng đường dẫn
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

// Decode secret access key if it contains URL encoded characters
const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY ? 
  decodeURIComponent(process.env.AWS_SECRET_ACCESS_KEY) : 
  process.env.AWS_SECRET_ACCESS_KEY;

const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: secretAccessKey,
  },
  forcePathStyle: false, // Thay đổi thành true nếu sử dụng minio hoặc s3 compatible service
});

module.exports = s3;
