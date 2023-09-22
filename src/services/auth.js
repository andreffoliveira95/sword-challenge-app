const userDAO = require('../daos/userDAO');

async function createUser(userInfo) {
  const { username, email, password } = userInfo;
  await userDAO.createUser(username, email, password);
}

async function authenticateUser(userInfo) {
  const { email, password } = userInfo;
  return await userDAO.getUser(email, password);
}

module.exports = { createUser, authenticateUser };
