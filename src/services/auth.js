const userDAO = require('../DAOs/userDAO');
const userDTO = require('../DTOs/userDTO');
const BadRequestError = require('../errors/BadRequestError');
const ConflictError = require('../errors/ConflictError');

const createUser = async (userInfo) => {
  const { username, email, password, role } = userInfo;

  const [usernameCount] = await userDAO.getUsernameCount(username);
  isUsernameInUse(usernameCount);

  const [emailCount] = await userDAO.getEmailCount(email);
  isEmailInUse(emailCount);

  validateInputs(username, email, password);

  const [result] = await userDAO.createUser(username, email, password, role);
  const [user] = await userDAO.getUserByID(result.insertId);

  return userDTO.mapToDTO(user[0]);
};

const authenticateUser = async (userInfo) => {
  const { email, password } = userInfo;
  const [user] = await userDAO.getUser(email, password);

  return userDTO.mapToDTO(user[0]);
};

const isUsernameInUse = (usernameCount) => {
  if (usernameCount[0].count !== 0) {
    throw new ConflictError('Username is already in use.');
  }
};

const isEmailInUse = (emailCount) => {
  if (emailCount[0].count !== 0) {
    throw new ConflictError('Email is already in use.');
  }
};

const validateInputs = (username, email, password) => {
  if (!username || !email || !password) {
    throw new BadRequestError(
      'Please provide a username, an email and a password.'
    );
  }

  if (!isValidEmail(email)) {
    throw new BadRequestError('Invalid email: Please provide a valid email.');
  }
};

const isValidEmail = (email) => {
  const emailPattern = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/g;
  return emailPattern.test(email);
};

module.exports = { createUser, authenticateUser };
