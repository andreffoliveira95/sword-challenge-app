const ApiError = require('./ApiError');
const { StatusCodes } = require('http-status-codes');

class ServerError extends ApiError {
  constructor(message) {
    super(message);
    this.statusCode = StatusCodes.INTERNAL_SERVER_ERROR;
  }
}

module.exports = ServerError;
