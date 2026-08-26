const { ApiError } = require('../utils/apiError');

/**
 * Centralized error handler. Keeps stack traces and internal details out of
 * API responses in production, per the SRS security controls.
 */
// eslint-disable-next-line no-unused-vars
function errorHandler(err, req, res, next) {
  if (process.env.NODE_ENV === 'development') {
    console.error(err);
  }

  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
      details: err.details || undefined,
    });
  }

  // Mongoose duplicate key error (unique index violation, e.g. email or SKU)
  if (err.code === 11000) {
    const field = Object.keys(err.keyPattern || {})[0] || 'field';
    return res.status(409).json({
      success: false,
      message: `Duplicate value for field: ${field}`,
    });
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      details: Object.fromEntries(
        Object.entries(err.errors).map(([key, val]) => [key, val.message])
      ),
    });
  }

  // Malformed ObjectId in a route param/body
  if (err.name === 'CastError') {
    return res.status(400).json({
      success: false,
      message: `Invalid identifier: ${err.value}`,
    });
  }

  return res.status(500).json({
    success: false,
    message: 'Internal server error',
  });
}

function notFoundHandler(req, res) {
  res.status(404).json({ success: false, message: 'Route not found' });
}

module.exports = { errorHandler, notFoundHandler };
