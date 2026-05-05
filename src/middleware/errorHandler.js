const { ValidationError, UniqueConstraintError } = require('sequelize');
const ApiError = require('../utils/ApiError');
const env = require('../config/env');

const notFound = (req, _res, next) => {
  next(new ApiError(404, `Route not found: ${req.method} ${req.originalUrl}`));
};

const errorHandler = (err, _req, res, _next) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal server error';
  let details = err.details || null;

  if (err instanceof UniqueConstraintError) {
    statusCode = 409;
    message = 'Duplicate record';
    details = err.errors.map((error) => ({
      field: error.path,
      message: error.message
    }));
  } else if (err instanceof ValidationError) {
    statusCode = 400;
    message = 'Database validation failed';
    details = err.errors.map((error) => ({
      field: error.path,
      message: error.message
    }));
  }

  const response = {
    success: false,
    message,
    ...(details ? { details } : {})
  };

  if (env.nodeEnv !== 'production') {
    response.stack = err.stack;
  }

  res.status(statusCode).json(response);
};

module.exports = {
  notFound,
  errorHandler
};
