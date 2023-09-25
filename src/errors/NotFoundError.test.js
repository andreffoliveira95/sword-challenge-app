const NotFoundError = require('./NotFoundError');
const { StatusCodes } = require('http-status-codes');

describe('NotFoundError', () => {
  const message = 'Not Found Error';

  test('should extend ApiError', () => {
    const error = new NotFoundError(message);

    expect(error instanceof Error).toBe(true);
    expect(error instanceof NotFoundError).toBe(true);
  });

  test('should have the correct status code', () => {
    const error = new NotFoundError(message);

    expect(error.statusCode).toBe(StatusCodes.NOT_FOUND);
  });

  test('should have the correct message', () => {
    const error = new NotFoundError(message);

    expect(error.message).toBe(message);
  });
});
