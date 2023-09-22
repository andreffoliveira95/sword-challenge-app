const userDAO = require('../daos/userDAO');

async function createUser(userInfo) {
  const { username, email, password, role } = userInfo;
  const [user] = await userDAO.createUser(username, email, password, role);
  return user[0];
}

async function authenticateUser(userInfo) {
  const { email, password } = userInfo;
  return await userDAO.getUser(email, password);
}

module.exports = { createUser, authenticateUser };
