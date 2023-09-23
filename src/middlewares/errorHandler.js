const ApiError = require('../errors/ApiError');
const { StatusCodes } = require('http-status-codes');

// eslint-disable-next-line no-unused-vars
const errorHandler = (error, request, response, next) => {
  if (error instanceof ApiError) {
    return response
      .status(error.statusCode)
      .json({ status: error.statusCode, error: error.message });
  }
  return response.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
    status: StatusCodes.INTERNAL_SERVER_ERROR,
    error: 'Something went wrong. Please try again later.'
  });
};

module.exports = errorHandler;
