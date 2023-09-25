const ConflictError = require('./ConflictError');
const { StatusCodes } = require('http-status-codes');

describe('ConflictError', () => {
  const message = 'Conflict Error';

  test('should extend ApiError', () => {
    const error = new ConflictError(message);

    expect(error instanceof Error).toBe(true);
    expect(error instanceof ConflictError).toBe(true);
  });

  test('should have the correct status code', () => {
    const error = new ConflictError(message);

    expect(error.statusCode).toBe(StatusCodes.CONFLICT);
  });

  test('should have the correct message', () => {
    const error = new ConflictError(message);

    expect(error.message).toBe(message);
  });
});
