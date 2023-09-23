const userDAO = require('../DAOs/userDAO');
const userDTO = require('../DTOs/userDTO');
const BadRequestError = require('../errors/BadRequestError');
const ConflictError = require('../errors/ConflictError');
const UnauthorizedError = require('../errors/UnauthorizedError');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const registerUser = async (userInfo) => {
  const { username, email, password, role } = userInfo;
  validateInputs(username, email, password);

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const [usernameCount] = await userDAO.getUsernameCount(username);
  isUsernameInUse(usernameCount);

  const [emailCount] = await userDAO.getEmailCount(email);
  isEmailInUse(emailCount);

  const [result] = await userDAO.createUser(
    username,
    email,
    hashedPassword,
    role
  );
  const [user] = await userDAO.getUserByID(result.insertId);

  const token = jwt.sign(userDTO.mapToDTO(user[0]), process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES
  });

  return { user: userDTO.mapToDTO(user[0]), token };
};

const authenticateUser = async (userInfo) => {
  const { email, password } = userInfo;

  validateAuthenticationInputs(email, password);

  const [user] = await userDAO.getUser(email);
  if (user.length === 0) {
    throw new UnauthorizedError('Invalid credential: Email does not exist.');
  }

  const [userPassword] = await userDAO.getPassword(email);
  const isPasswordCorrect = await bcrypt.compare(
    password,
    userPassword[0].password
  );
  if (!isPasswordCorrect) {
    throw new UnauthorizedError('Invalid credential: Incorrect password.');
  }

  const token = jwt.sign(
    {
      userID: user[0].user_id,
      username: user[0].username,
      roleName: user[0].role_name
    },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRES
    }
  );

  return { user: userDTO.mapToDTO(user[0]), token };
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

const validateAuthenticationInputs = (email, password) => {
  if (!email || !password) {
    throw new BadRequestError('Please provide the email and password.');
  }
};

const isValidEmail = (email) => {
  const emailPattern = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/g;
  return emailPattern.test(email);
};

module.exports = { registerUser, authenticateUser };
