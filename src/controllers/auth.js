const authService = require('../services/auth');
const tryCatchWrapper = require('../middlewares/tryCatchWrapper');
const { StatusCodes } = require('http-status-codes');

const registerUser = tryCatchWrapper(async (request, response) => {
  const body = request.body;
  const user = await authService.registerUser(body);

  return response.status(StatusCodes.CREATED).json(user);
});

const authenticateUser = tryCatchWrapper(async (request, response) => {
  const body = request.body;
  const user = await authService.authenticateUser(body);

  return response.status(StatusCodes.OK).send(user);
});

module.exports = { registerUser, authenticateUser };
