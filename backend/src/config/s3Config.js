import { S3Client } from "@aws-sdk/client-s3";
import dotenv from "dotenv";
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

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
export const bucketName = process.env.AWS_BUCKET_NAME;
export default s3;
