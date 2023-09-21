const authService = require('../services/auth');

const registerUser = (request, response) => {
  const body = request.body;
  const newUser = authService.createUser(body);
  return response.status(200).send(newUser);
};

const authenticateUser = (request, response) => {
  const body = request.body;
  const user = authService.authenticateUser(body);
  return response.status(200).send(user);
};

module.exports = { registerUser, authenticateUser };
