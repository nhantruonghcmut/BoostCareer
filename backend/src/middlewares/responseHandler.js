const responseHandler = (req, res, next) => {
  res.success = (data = null, message = "Success", statusCode = 200) => {
    return res.status(statusCode).json({
      success: true,
      message,
      data
    });
  };
  
  res.error = (message = "Error occurred", statusCode = 500, error = null) => {
    console.error(`API Error: ${message}`, error);
    return res.status(statusCode).json({
      success: false,
      message,
      // Only include detailed error in development
      ...(process.env.NODE_ENV === 'development' && { error: error?.message || error })
    });
  };
  next();
};

module.exports = responseHandler;