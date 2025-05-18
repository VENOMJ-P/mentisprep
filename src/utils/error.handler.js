export class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

export const errorHandler = (err, req, res, next) => {
  console.error("Error:", err);

  // Default error values
  let statusCode = 500;
  let message = "Something went wrong";
  let errors = {};

  // Handle known errors
  if (err instanceof AppError) {
    statusCode = err.statusCode;
    message = err.message;
  }

  // Handle Sequelize validation errors
  if (err.name === "SequelizeValidationError") {
    statusCode = 400;
    message = "Validation error";
    err.errors.forEach((e) => {
      errors[e.path] = e.message;
    });
  }

  // Handle Sequelize unique constraint errors
  if (err.name === "SequelizeUniqueConstraintError") {
    statusCode = 409;
    message = "Duplicate entry";
    err.errors.forEach((e) => {
      errors[e.path] = e.message;
    });
  }

  // Handle Sequelize foreign key constraint errors
  if (err.name === "SequelizeForeignKeyConstraintError") {
    statusCode = 400;
    message = "Referenced resource not found";
  }

  // Handle Sequelize database errors
  if (err.name === "SequelizeDatabaseError") {
    statusCode = 500;
    message = "Database error";
  }

  // Send error response
  res.status(statusCode).json({
    success: false,
    message,
    errors: Object.keys(errors).length > 0 ? errors : undefined,
    stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
  });
};
