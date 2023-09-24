const adminService = require('../services/admin');
const tryCatchWrapper = require('../middlewares/tryCatchWrapper');
const { StatusCodes } = require('http-status-codes');

const checkNotifications = tryCatchWrapper(async (request, response) => {
  const user = request.user;
  await adminService.checkNotifications(user);

  return response
    .status(StatusCodes.OK)
    .json('Notifications recieved: Check the logs.');
});

module.exports = { checkNotifications };
