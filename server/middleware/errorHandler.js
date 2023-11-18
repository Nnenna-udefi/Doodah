// middleware/errorHandler.js
  const errorHandler = (err, req, res, next) => {
    if (res.headersSent) {
      // If headers have already been sent
      // Delegate the error to the default Express error handler
      return next(err);
    }
  
    console.error(err);
  
    // Determine the status code and message based on the error
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal Server Error';
  
    // Prepare the error response
    const errorResponse = { error: { message, status: statusCode, }, };
  
    // If it's a validation error, add more details to the response
    if (err.name === 'ValidationError') errorResponse.error.details = err.details;
  
    res.status(statusCode).json(errorResponse);
  };  

module.exports = errorHandler;