import logger from '../utils/logger.js';

/**
 * Middleware để log thông tin request và response
 */
const requestLogger = (req, res, next) => {
  // Thời điểm bắt đầu xử lý request
  const start = Date.now();
  
  // Log request
  logger.logRequest(req, 'Incoming request');
  
  // Lưu method ban đầu để sử dụng trong closure
  const originalMethod = req.method;
  const originalUrl = req.originalUrl;
  
  // Lưu hàm end ban đầu
  const originalEnd = res.end;
  
  // Override hàm end để log response
  res.end = function(chunk, encoding) {
    // Tính toán thời gian phản hồi
    const responseTime = Date.now() - start;
    res.responseTime = responseTime;
    
    // Log response
    logger.logResponse(
      req, 
      res, 
      `Response sent in ${responseTime}ms`, 
      {
        method: originalMethod,
        url: originalUrl,
        statusCode: res.statusCode
      }
    );
    
    // Gọi hàm end ban đầu
    return originalEnd.call(this, chunk, encoding);
  };
  
  next();
};

export default requestLogger;
