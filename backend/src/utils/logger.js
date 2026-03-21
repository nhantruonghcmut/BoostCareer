import winston from 'winston';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Tạo thư mục logs nếu chưa tồn tại
const logDir = path.join(__dirname, '../../logs');
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir, { recursive: true });
}

// Tạo custom format để hiển thị timestamp ở đầu log
const customFormat = winston.format((info) => {
  info.timestamp = new Date().toLocaleString('vi-VN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  });
  return info;
})();

// Tạo format cho logger
const logFormat = winston.format.combine(
  customFormat,
  winston.format.timestamp(),
  winston.format.printf(info => {
    const { timestamp, level, message, ...rest } = info;
    const metadata = Object.keys(rest).length ? JSON.stringify(rest, null, 2) : '';
    return `[${timestamp}] ${level.toUpperCase()}: ${message} ${metadata}`;
  })
);

// Tạo logger
const logger = winston.createLogger({
  level: process.env.NODE_ENV === 'development' ? 'debug' : 'info',
  format: logFormat,
  transports: [
    // Ghi các lỗi vào file error.log
    new winston.transports.File({ 
      filename: path.join(logDir, 'error.log'),
      level: 'error',
      maxsize: 5242880, // 5MB
      maxFiles: 5
    }),
    // Ghi tất cả log vào file combined.log
    new winston.transports.File({ 
      filename: path.join(logDir, 'combined.log'),
      maxsize: 5242880, // 5MB
      maxFiles: 5
    }),
    // Thêm transport cho exceptions và rejections
    new winston.transports.File({ 
      filename: path.join(logDir, 'exceptions.log') 
    }),
    new winston.transports.File({ 
      filename: path.join(logDir, 'rejections.log') 
    })
  ],
  // Bắt exceptions và rejections
  exceptionHandlers: [
    new winston.transports.File({ 
      filename: path.join(logDir, 'exceptions.log') 
    })
  ],
  rejectionHandlers: [
    new winston.transports.File({ 
      filename: path.join(logDir, 'rejections.log') 
    })
  ],
  exitOnError: false
});

// Thêm console transport trong môi trường development
if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.combine(
      winston.format.colorize(),
      customFormat,
      winston.format.printf(info => {
        const { timestamp, level, message, ...rest } = info;
        const metadata = Object.keys(rest).length ? JSON.stringify(rest, null, 2) : '';
        return `[${timestamp}] ${level}: ${message} ${metadata}`;
      })
    )
  }));
}

// Helper function để log request thông thường
logger.logRequest = (req, message = 'Request received', additionalInfo = {}) => {
  const requestInfo = {
    timestamp: new Date().toLocaleString('vi-VN'),
    method: req.method,
    path: req.path,
    url: req.originalUrl,
    ip: req.ip,
    userAgent: req.headers['user-agent'],
    userId: req.session?.userLogin?.id || 'anonymous',
    ...additionalInfo
  };
  
  logger.info(`[REQUEST] [${req.method}] ${req.path} - ${message}`, requestInfo);
};

// Helper function để log response thông thường
logger.logResponse = (req, res, message = 'Response sent', additionalInfo = {}) => {
  const responseInfo = {
    timestamp: new Date().toLocaleString('vi-VN'),
    method: req.method,
    path: req.path,
    statusCode: res.statusCode,
    responseTime: res.responseTime || 'unknown',
    userId: req.session?.userLogin?.id || 'anonymous',
    ...additionalInfo
  };
  
  logger.info(`[RESPONSE] [${req.method}] ${req.path} - ${message}`, responseInfo);
};

// Helper function để log thông tin hệ thống
logger.logSystem = (message, metadata = {}) => {
  logger.info(`[SYSTEM] ${message}`, { 
    timestamp: new Date().toLocaleString('vi-VN'),
    ...metadata 
  });
};

export default logger;