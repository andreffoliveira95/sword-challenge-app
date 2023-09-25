const { isManager } = require('./utils/tasksValidators');
const { showNotifications } = require('../messaging/subscriber');
const UnauthorizedError = require('../errors/UnauthorizedError');

const checkNotifications = async (user) => {
  const { roleName } = user;

  if (isManager(roleName)) {
    return await showNotifications();
  }

  throw new UnauthorizedError('You are not allowed to access admin page.');
};

module.exports = { checkNotifications };
