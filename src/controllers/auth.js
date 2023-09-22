const authService = require('../services/auth');
const userDTO = require('../DTOs/userDTO');

async function registerUser(request, response) {
  const body = request.body;
  const newUser = await authService.createUser(body);
  return response.status(200).send(userDTO.mapToDTO(newUser));
}

async function authenticateUser(request, response) {
  const body = request.body;
  const user = await authService.authenticateUser(body);
  return response.status(200).send(userDTO.mapToDTO(user));
}

module.exports = { registerUser, authenticateUser };
