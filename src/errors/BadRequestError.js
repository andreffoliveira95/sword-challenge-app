const ApiError = require('./ApiError');
const { StatusCodes } = require('http-status-codes');

class BadRequestError extends ApiError {
  constructor(message) {
    super(message);
    this.statusCode = StatusCodes.BAD_REQUEST;
  }
}

module.exports = BadRequestError;
