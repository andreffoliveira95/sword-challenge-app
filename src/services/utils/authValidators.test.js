const authValidators = require('./authValidators'); // Adjust the path as needed

describe('Authentication Validation Functions', () => {
  describe('isUsernameInUse', () => {
    test.each([
      [true, 1],
      [false, 0]
    ])(
      'should return %p when username count is %i',
      (expectedResult, usernameCount) => {
        const result = authValidators.isUsernameInUse(usernameCount);

        expect(result).toBe(expectedResult);
      }
    );
  });

  describe('isEmailInUse', () => {
    test.each([
      [true, 1],
      [false, 0]
    ])('should return %p when email count is %i', (usernameCount) => {
      const result = authValidators.isEmailInUse(usernameCount);

      expect(result).toBe(true);
    });
  });

  describe('areAllInputsGiven', () => {
    test.each([
      [true, 'user', 'user@example.com', 'password', '1'],
      [false, 'user', 'user@example.com', 'password', '3'],
      [false, '', 'user@example.com', 'password', '1'],
      [false, 'user', '', 'password', '1'],
      [false, 'user', 'user@example.com', '', '1'],
      [false, 'user', 'user@example.com', 'password', ''],
      [false, '', '', '', '']
    ])(
      'should return %p when username="%s", email="%s", password="%s" and roleID="%s"',
      (expectedResult, username, email, password, roleID) => {
        const result = authValidators.areAllInputsGiven(
          username,
          email,
          password,
          roleID
        );

        expect(result).toBe(expectedResult);
      }
    );
  });

  describe('areAllAuthGiven', () => {
    test.each([
      [true, 'user@example.com', 'password'],
      [false, '', 'password'],
      [false, 'user@example.com', ''],
      [false, '', '']
    ])(
      'should return %p when email="%s", password="%s"',
      (expectedResult, email, password) => {
        const result = authValidators.areAllAuthInputsGiven(email, password);

        expect(result).toBe(expectedResult);
      }
    );
  });

  describe('isValidEmail', () => {
    test.each([
      [false, 'useremail'],
      [false, 'user@.com'],
      [false, '@example.com'],
      [false, 'user@example'],
      [true, 'user@example.com'],
      [true, 'user_v2@exam.ple.com'],
      [true, 'user.v3@example.com'],
      [true, 'user.v4@example.domain']
    ])('should return %p when email="%s"', (expectedResult, email) => {
      expect(authValidators.isValidEmail(email)).toBe(expectedResult);
    });
  });

  describe('doesUserExist', () => {
    test.each([
      [true, 'user array is not empty', [{ id: 1, username: 'user' }]],
      [false, 'user array is empty', []]
    ])(
      'should return %p when %s',
      (expectedResult, scenarioDescription, userArray) => {
        const result = authValidators.doesUserExist(userArray);

        expect(result).toBe(expectedResult);
      }
    );
  });
});
