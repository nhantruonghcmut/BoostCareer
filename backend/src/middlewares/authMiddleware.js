const jwt = require('jsonwebtoken');
const ApiError = require('../utils/ApiError');

// Verify access token middleware
const verifyToken = (req, res, next) => {
  try {
    const accessToken = req.cookies.accessToken;
    
    if (!accessToken) {
      throw new ApiError('No access token provided', 401);
    }

    const decoded = jwt.verify(accessToken, process.env.JWT_ACCESS_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return next(new ApiError('Invalid token', 401));
    }
    if (error.name === 'TokenExpiredError') {
      return next(new ApiError('Token expired', 401));
    }
    next(error);
  }
};

// Role-based access control middleware
const verifyRole = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return next(new ApiError('User not authenticated', 401));
    }

    if (!roles.includes(req.user.role)) {
      return next(new ApiError('Unauthorized access', 403));
    }

    next();
  };
};

module.exports = {
  verifyToken,
  verifyRole
};