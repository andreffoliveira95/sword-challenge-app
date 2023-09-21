const { tasksList } = require('../test-data');

const getTasks = user => {
  if (user.role === 'Manager') {
    return tasksList;
  } else {
    return tasksList.filter(task => task.user === user.name);
  }
};

module.exports = { getTasks };
