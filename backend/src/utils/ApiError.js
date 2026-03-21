/**
 * Custom Error class for API errors
 * Extends Error with additional properties
 */
class ApiError extends Error {
  constructor(message, statusCode, isOperational = true, stack = "") {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational; // Helps distinguish operational vs programming errors
    
    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

export default ApiError;
