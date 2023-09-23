const ApiError = require('./ApiError');
const { StatusCodes } = require('http-status-codes');

class ConflictError extends ApiError {
  constructor(message) {
    super(message);
    this.statusCode = StatusCodes.CONFLICT;
  }
}

module.exports = ConflictError;
