const ServerError = require('./ServerError');
const { StatusCodes } = require('http-status-codes');

describe('ServerError', () => {
  const message = 'Server Error';

  test('should extend ApiError', () => {
    const error = new ServerError(message);

    expect(error instanceof Error).toBe(true);
    expect(error instanceof ServerError).toBe(true);
  });

  test('should have the correct status code', () => {
    const error = new ServerError(message);

    expect(error.statusCode).toBe(StatusCodes.INTERNAL_SERVER_ERROR);
  });

  test('should have the correct message', () => {
    const error = new ServerError(message);

    expect(error.message).toBe(message);
  });
});
