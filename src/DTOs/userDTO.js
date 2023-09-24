const moment = require('moment');

const mapToDTO = (user) => {
  return {
    userID: user.user_id,
    username: user.username,
    roleName: user.role_name,
    createdAt: moment(user.created_at).format('DD-MM-YYYY'),
    lastUpdatedAt: moment(user.updated_at).format('DD-MM-YYYY')
  };
};

module.exports = { mapToDTO };
