const ApiError = require('./ApiError');
const { StatusCodes } = require('http-status-codes');

class UnauthorizedError extends ApiError {
  constructor(message) {
    super(message);
    this.statusCode = StatusCodes.UNAUTHORIZED;
  }
}

module.exports = UnauthorizedError;
