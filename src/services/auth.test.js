const userDAO = require('../DAOs/userDAO');
const userDTO = require('../DTOs/userDTO');
const BadRequestError = require('../errors/BadRequestError');
const UnauthorizedError = require('../errors/UnauthorizedError');
const ConflictError = require('../errors/ConflictError');
const authService = require('./auth');
const authUtils = require('./utils/authUtils');

jest.mock('../DAOs/userDAO', () => ({
  getUser: jest.fn(),
  getPassword: jest.fn(() => [[{ password: 'hashedPassword' }]]),
  getUsernameCount: jest.fn(),
  getEmailCount: jest.fn(),
  createUser: jest.fn(),
  getUserByID: jest.fn()
}));

jest.mock('../DTOs/userDTO', () => ({
  mapToDTO: jest.fn((object) => object)
}));

jest.mock('./utils/authUtils', () => ({
  encryptPassword: jest.fn(() => 'hashedPassword'),
  comparePassword: jest.fn(),
  generateJWT: jest.fn(() => 'JWT Token')
}));

describe('Authentication Service', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('registerUser', () => {
    test('should register a user when inputs are valid', async () => {
      const userToCreate = {
        username: 'user',
        email: 'user@example.com',
        password: 'password',
        roleID: '1'
      };

      userDAO.getUsernameCount.mockReturnValue([[{ count: 0 }]]);
      userDAO.getEmailCount.mockReturnValue([[{ count: 0 }]]);
      userDAO.createUser.mockReturnValue([{ insertId: userToCreate.roleID }]);
      userDAO.getUserByID.mockReturnValue([[userToCreate]]);

      const result = await authService.registerUser(userToCreate);

      expect(userDAO.getUsernameCount).toHaveBeenCalledWith(
        userToCreate.username
      );
      expect(userDAO.getEmailCount).toHaveBeenCalledWith(userToCreate.email);
      expect(userDAO.createUser).toHaveBeenCalledWith(
        userToCreate.username,
        userToCreate.email,
        'hashedPassword',
        userToCreate.roleID
      );
      expect(authUtils.encryptPassword).toHaveBeenCalledWith(
        userToCreate.password
      );
      expect(userDAO.getUserByID).toHaveBeenCalledWith(userToCreate.roleID);
      expect(authUtils.generateJWT).toHaveBeenCalledWith(userToCreate);
      expect(result).toEqual({ user: userToCreate, token: 'JWT Token' });
    });

    test('should throw Conflict Error when email is already in use', async () => {
      const userToCreate = {
        username: 'user',
        email: 'user@example.com',
        password: 'password',
        roleID: '1'
      };

      userDAO.getUsernameCount.mockReturnValue([[{ count: 0 }]]);
      userDAO.getEmailCount.mockReturnValue([[{ count: 1 }]]);

      await expect(authService.registerUser(userToCreate)).rejects.toThrow(
        ConflictError
      );
      expect(userDAO.getUsernameCount).toHaveBeenCalledWith(
        userToCreate.username
      );
      expect(userDAO.getEmailCount).toHaveBeenCalledWith(userToCreate.email);
      expect(authUtils.encryptPassword).not.toHaveBeenCalled();
    });

    test('should throw Conflict Error when username is already in use', async () => {
      const userToCreate = {
        username: 'user',
        email: 'user@example.com',
        password: 'password',
        roleID: '1'
      };

      userDAO.getUsernameCount.mockReturnValue([[{ count: 1 }]]);

      await expect(authService.registerUser(userToCreate)).rejects.toThrow(
        ConflictError
      );
      expect(userDAO.getUsernameCount).toHaveBeenCalledWith(
        userToCreate.username
      );
      expect(userDAO.getEmailCount).not.toHaveBeenCalled();
    });

    test('should throw Bad Request Error when email is invalid', async () => {
      const userToCreate = {
        username: 'user',
        email: '@example.com',
        password: 'password',
        roleID: 1
      };

      await expect(authService.registerUser(userToCreate)).rejects.toThrow(
        BadRequestError
      );
      expect(userDAO.getUsernameCount).not.toHaveBeenCalledWith(
        userToCreate.username
      );
    });

    test('should throw Bad Request Error when inputs are invalid', async () => {
      const userToCreate = {
        username: '',
        email: '',
        password: '',
        roleID: 1
      };

      await expect(authService.registerUser(userToCreate)).rejects.toThrow(
        BadRequestError
      );
    });
  });

  describe('authenticateUser', () => {
    test('should authenticate a user with valid credentials', async () => {
      const userInfo = { email: 'user@example.com', password: 'password' };
      const user = { user_id: 1, username: 'user', role_name: 'User' };

      userDAO.getUser.mockReturnValue([[user]]);
      authUtils.comparePassword.mockReturnValue(true);
      userDTO.mapToDTO.mockReturnValue(user);

      const result = await authService.authenticateUser(userInfo);

      expect(userDAO.getUser).toHaveBeenCalledWith(userInfo.email);
      expect(userDAO.getPassword).toHaveBeenCalledWith(userInfo.email);
      expect(authUtils.comparePassword).toHaveBeenCalledWith(
        userInfo.password,
        'hashedPassword'
      );
      expect(authUtils.generateJWT).toHaveBeenCalledWith(user);
      expect(userDTO.mapToDTO).toHaveBeenCalledWith(user);
      expect(result).toEqual({ user: user, token: 'JWT Token' });
    });

    test('should throw Unauthorized Error when password is incorrect', async () => {
      const userInfo = { email: 'user@example.com', password: 'password' };
      const user = { user_id: 1, username: 'user', role_name: 'User' };

      userDAO.getUser.mockReturnValue([[user]]);
      authUtils.comparePassword.mockReturnValue(false);

      await expect(authService.authenticateUser(userInfo)).rejects.toThrow(
        UnauthorizedError
      );

      expect(userDAO.getUser).toHaveBeenCalledWith(userInfo.email);
      expect(userDAO.getPassword).toHaveBeenCalledWith(userInfo.email);
      expect(authUtils.comparePassword).toHaveBeenCalledWith(
        userInfo.password,
        'hashedPassword'
      );
      expect(authUtils.generateJWT).not.toHaveBeenCalled();
    });

    test('should throw Unauthorized Error when email is incorrect', async () => {
      const userInfo = { email: 'user@example.com', password: 'password' };

      userDAO.getUser.mockReturnValue([[]]);

      await expect(authService.authenticateUser(userInfo)).rejects.toThrow(
        UnauthorizedError
      );

      expect(userDAO.getUser).toHaveBeenCalledWith(userInfo.email);
      expect(userDAO.getPassword).not.toHaveBeenCalled();
    });

    test('should throw BadRequest Error when email and/or password are missing', async () => {
      const userInfo = { email: '', password: '' };

      await expect(authService.authenticateUser(userInfo)).rejects.toThrow(
        BadRequestError
      );

      expect(userDAO.getUser).not.toHaveBeenCalled();
    });
  });
});
