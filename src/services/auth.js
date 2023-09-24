const userDAO = require('../DAOs/userDAO');
const userDTO = require('../DTOs/userDTO');
const BadRequestError = require('../errors/BadRequestError');
const ConflictError = require('../errors/ConflictError');
const UnauthorizedError = require('../errors/UnauthorizedError');
const {
  encryptPassword,
  comparePassword,
  generateJWT
} = require('./utils/authUtils');
const {
  isUsernameInUse,
  isEmailInUse,
  areAllInputsGiven,
  isValidEmail,
  areAllAuthInputsGiven,
  doesUserExist
} = require('./utils/authValidators');

const registerUser = async (userInfo) => {
  const { username, email, password, role } = userInfo;

  if (!areAllInputsGiven(username, email, password)) {
    throw new BadRequestError(
      'Please provide a username, an email and a password.'
    );
  }

  if (!isValidEmail(email)) {
    throw new BadRequestError('Invalid email: Please provide a valid email.');
  }

  const [usernameCount] = await userDAO.getUsernameCount(username);
  if (isUsernameInUse(usernameCount[0].count)) {
    throw new ConflictError('Username is already in use.');
  }

  const [emailCount] = await userDAO.getEmailCount(email);
  if (isEmailInUse(emailCount[0].count)) {
    throw new ConflictError('Email is already in use.');
  }

  const hashedPassword = await encryptPassword(password);
  const [result] = await userDAO.createUser(
    username,
    email,
    hashedPassword,
    role
  );
  const [user] = await userDAO.getUserByID(result.insertId);
  const token = generateJWT(user[0]);

  return { user: userDTO.mapToDTO(user[0]), token };
};

const authenticateUser = async (userInfo) => {
  const { email, password } = userInfo;
  if (!areAllAuthInputsGiven(email, password)) {
    throw new BadRequestError('Please provide the email and password.');
  }

  const [user] = await userDAO.getUser(email);
  if (!doesUserExist(user)) {
    throw new UnauthorizedError('Invalid credential: Email does not exist.');
  }

  const [userPassword] = await userDAO.getPassword(email);
  const isPasswordCorrect = await comparePassword(
    password,
    userPassword[0].password
  );
  if (!isPasswordCorrect) {
    throw new UnauthorizedError('Invalid credential: Incorrect password.');
  }

  const token = generateJWT(user[0]);

  return { user: userDTO.mapToDTO(user[0]), token };
};

module.exports = { registerUser, authenticateUser };
