const BadRequestError = require('./BadRequestError');
const { StatusCodes } = require('http-status-codes');

describe('BadRequestError', () => {
  const message = 'Bad Request Error';

  test('should extend ApiError', () => {
    const error = new BadRequestError(message);

    expect(error instanceof Error).toBe(true);
    expect(error instanceof BadRequestError).toBe(true);
  });

  test('should have the correct status code', () => {
    const error = new BadRequestError(message);

    expect(error.statusCode).toBe(StatusCodes.BAD_REQUEST);
  });

  test('should have the correct message', () => {
    const error = new BadRequestError(message);

    expect(error.message).toBe(message);
  });
});
