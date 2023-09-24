const authService = require('../services/auth');
const tryCatchWrapper = require('../middlewares/tryCatchWrapper');
const { StatusCodes } = require('http-status-codes');

const registerUser = tryCatchWrapper(async (request, response) => {
  const userInfo = request.body;
  const user = await authService.registerUser(userInfo);

  return response.status(StatusCodes.CREATED).json(user);
});

const authenticateUser = tryCatchWrapper(async (request, response) => {
  const userInfo = request.body;
  const user = await authService.authenticateUser(userInfo);

  return response.status(StatusCodes.OK).json(user);
});

module.exports = { registerUser, authenticateUser };
