const authService = require('../services/auth');

async function registerUser(request, response) {
  const body = request.body;
  await authService.createUser(body);
  return response
    .status(200)
    .send(`User created successfully with username ${body.username}`);
}

async function authenticateUser(request, response) {
  const body = request.body;
  const user = await authService.authenticateUser(body);
  return response.status(200).send(user);
}

module.exports = { registerUser, authenticateUser };
