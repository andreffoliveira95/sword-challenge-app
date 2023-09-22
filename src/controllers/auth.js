const authService = require('../services/auth');

function registerUser(request, response) {
  const body = request.body;
  const newUser = authService.createUser(body);
  return response.status(200).send(newUser);
}

async function authenticateUser(request, response) {
  const body = request.body;
  await authService.authenticateUser(body);
  return response
    .status(200)
    .send(`User created with username: ${body.username}`);
}

module.exports = { registerUser, authenticateUser };
