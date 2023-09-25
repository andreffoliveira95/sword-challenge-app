const UnauthorizedError = require('./UnauthorizedError');
const { StatusCodes } = require('http-status-codes');

describe('UnauthorizedError', () => {
  const message = 'Unauthorized Error';

  test('should extend ApiError', () => {
    const error = new UnauthorizedError(message);

    expect(error instanceof Error).toBe(true);
    expect(error instanceof UnauthorizedError).toBe(true);
  });

  test('should have the correct status code', () => {
    const error = new UnauthorizedError(message);

    expect(error.statusCode).toBe(StatusCodes.UNAUTHORIZED);
  });

  test('should have the correct message', () => {
    const error = new UnauthorizedError(message);

    expect(error.message).toBe(message);
  });
});
