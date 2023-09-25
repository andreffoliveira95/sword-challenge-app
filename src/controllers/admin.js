const adminService = require('../services/admin');
const tryCatchWrapper = require('../middlewares/tryCatchWrapper');
const { StatusCodes } = require('http-status-codes');

const checkNotifications = tryCatchWrapper(async (request, response) => {
  const user = request.user;
  const messages = await adminService.checkNotifications(user);

  return response.status(StatusCodes.OK).json({ messages });
});

module.exports = { checkNotifications };
