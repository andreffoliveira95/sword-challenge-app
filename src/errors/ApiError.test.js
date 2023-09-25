const ApiError = require('./ApiError');

describe('ApiError', () => {
  const message = 'Api Error';

  test('should extend Error', () => {
    const error = new ApiError(message);

    expect(error instanceof Error).toBe(true);
    expect(error instanceof ApiError).toBe(true);
  });

  test('should have the correct message', () => {
    const errorMessage = message;
    const error = new ApiError(errorMessage);

    expect(error.message).toBe(errorMessage);
  });
});
