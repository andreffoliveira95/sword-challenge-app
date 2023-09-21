const { usersList } = require('../test-data');

const createUser = user => {
  usersList.push(user);
  return user;
};

const authenticateUser = userInfo => {
  const { name } = userInfo;

  const [user] = usersList.filter(user => {
    if (name === user.name) {
      delete user.id;
      return user;
    }
  });

  console.log(user);

  return user;
};

module.exports = { createUser, authenticateUser };
