const authUtils = require('./authUtils');
const jwt = require('jsonwebtoken');

describe('Authentication Utility Functions', () => {
  describe('encryptPassword', () => {
    test.each([['anotherPassword'], ['pass']])(
      'should hash password "%s"',
      async (password) => {
        const hashedPassword = await authUtils.encryptPassword(password);

        expect(hashedPassword).not.toEqual(password);
        expect(hashedPassword.length).toEqual(60);
      }
    );
  });

  describe('comparePassword', () => {
    test.each([['anotherPassword'], ['pass']])(
      'should compare password "%s" with its hash',
      async (password) => {
        const hashedPassword = await authUtils.encryptPassword(password);
        const result = await authUtils.comparePassword(
          password,
          hashedPassword
        );

        expect(result).toBe(true);
      }
    );

    test('should return false for an incorrect password', async () => {
      const hashedPassword = await authUtils.encryptPassword('corectPassword');
      const result = await authUtils.comparePassword(
        'correctPassword',
        hashedPassword
      );

      expect(result).toBe(false);
    });
  });

  describe('generateJWT', () => {
    test('should generate a valid JWT token', () => {
      const user = { user_id: 1, username: 'testuser', role_name: 'user' };
      process.env.JWT_SECRET = 'JWT Secret';
      process.env.JWT_EXPIRES = '1h';

      const signSpy = jest.spyOn(jwt, 'sign');
      const token = authUtils.generateJWT(user);

      expect(token.length).toBe(196);
      expect(signSpy).toHaveBeenCalledWith(
        {
          userID: user.user_id,
          username: user.username,
          roleName: user.role_name
        },
        process.env.JWT_SECRET,
        {
          expiresIn: process.env.JWT_EXPIRES
        }
      );
    });
  });
});
