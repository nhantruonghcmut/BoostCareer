import ApiError from '../utils/ApiError.js';
import logger from '../utils/logger.js';

const errorConverter = (err, req, res, next) => {
  let error = err;
  if (!(error instanceof ApiError)) {
    const statusCode = error.statusCode || error.status || 500;
    const message = error.message || 'Lỗi hệ thống';
    error = new ApiError(message, statusCode, false, err.stack);
  }
  next(error);
};

const errorHandler = (err, req, res, next) => {
  const { statusCode, message } = err;
  
  // Tạo object chứa thông tin chi tiết về lỗi
  const errorDetails = {
    timestamp: new Date().toLocaleString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    }),
    url: req.originalUrl,
    method: req.method,
    path: req.path,
    statusCode: statusCode,
    message: message,
    userId: req.session?.userLogin?.id || 'unauthenticated',
    userRole: req.session?.userLogin?.role_id || 'none',
    ip: req.ip,
    userAgent: req.headers['user-agent'],
    // Thêm các query parameters (loại bỏ thông tin nhạy cảm nếu cần)
    query: req.query,
    // Thêm body cho requests không phải GET (loại bỏ thông tin nhạy cảm)
    body: req.method !== 'GET' ? sanitizeRequestBody(req.body) : undefined,
    // Stack trace trong môi trường development hoặc cho lỗi server
    stack: process.env.NODE_ENV === 'development' || statusCode >= 500 ? err.stack : undefined
  };

  // Log dựa trên mức độ nghiêm trọng
  if (statusCode >= 500) {
    logger.error(`[SERVER ERROR] [${req.method}] ${req.path} - ${message}`, errorDetails);
  } else if (statusCode >= 400) {
    logger.warn(`[CLIENT ERROR] [${req.method}] ${req.path} - ${message}`, errorDetails);
  } else {
    logger.info(`[OTHER ERROR] [${req.method}] ${req.path} - ${message}`, errorDetails);
  }

  // Trả về response cho client
  const response = {
    success: false,
    message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  };

  res.status(statusCode).json(response);
};

// Helper để loại bỏ dữ liệu nhạy cảm
function sanitizeRequestBody(body) {
  if (!body) return undefined;
  
  const sanitized = { ...body };
  
  // Loại bỏ các field nhạy cảm
  const sensitiveFields = ['password', 'password_', 'token', 'credit_card', 'cvv'];
  sensitiveFields.forEach(field => {
    if (sanitized[field]) {
      sanitized[field] = '******';
    }
  });
  
  return sanitized;
}

export { errorConverter, errorHandler };