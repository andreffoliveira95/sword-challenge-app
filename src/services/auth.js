const userDAO = require('../DAOs/userDAO');
const userDTO = require('../DTOs/userDTO');

const createUser = async userInfo => {
  const { username, email, password, role } = userInfo;
  const result = await userDAO.createUser(username, email, password, role);
  const [user] = await userDAO.getUserByID(result[0].insertId);

  return userDTO.mapToDTO(user[0]);
};

const authenticateUser = async userInfo => {
  const { email, password } = userInfo;
  const [user] = await userDAO.getUser(email, password);

  return userDTO.mapToDTO(user[0]);
};

module.exports = { createUser, authenticateUser };
