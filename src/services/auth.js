const userDAO = require('../DAOs/userDAO');

async function createUser(userInfo) {
  const { username, email, password, role } = userInfo;
  const result = await userDAO.createUser(username, email, password, role);
  const [user] = await userDAO.getUserByID(result[0].insertId);

  return user[0];
}

async function authenticateUser(userInfo) {
  const { email, password } = userInfo;
  const [user] = await userDAO.getUser(email, password);

  return user[0];
}

module.exports = { createUser, authenticateUser };
