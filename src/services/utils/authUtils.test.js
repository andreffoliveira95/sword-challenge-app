const authUtils = require('./authUtils');
const jwt = require('jsonwebtoken');

describe('Authentication Utility Functions', () => {
  describe('Password Encryption and Comparing', () => {
    test.each([['anotherPassword'], ['pass']])(
      'should hash password "%s"',
      async (password) => {
        const hashedPassword = await authUtils.encryptPassword(password);

        expect(hashedPassword).not.toEqual(password);
        expect(hashedPassword.length).toEqual(60);
      }
    );

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

  describe('Token Generation', () => {
    it('should generate a valid JWT token', () => {
      const mockUser = {
        user_id: 1,
        username: 'testuser',
        role_name: 'user'
      };

      process.env.JWT_SECRET = 'JWT Secret';
      process.env.JWT_EXPIRES = '1h';

      const signSpy = jest.spyOn(jwt, 'sign');
      const token = authUtils.generateJWT(mockUser);

      expect(token.length).toBe(196);
      expect(signSpy).toHaveBeenCalledWith(
        {
          userID: mockUser.user_id,
          username: mockUser.username,
          roleName: mockUser.role_name
        },
        'JWT Secret',
        {
          expiresIn: '1h'
        }
      );
    });
  });
});
