const authService = require('../services/auth');
const tryCatchWrapper = require('../middlewares/tryCatchWrapper');

const registerUser = tryCatchWrapper(async (request, response) => {
  const body = request.body;
  const newUser = await authService.createUser(body);
  return response.status(200).send(newUser);
});

const authenticateUser = tryCatchWrapper(async (request, response) => {
  const body = request.body;
  const user = await authService.authenticateUser(body);
  return response.status(200).send(user);
});

module.exports = { registerUser, authenticateUser };
