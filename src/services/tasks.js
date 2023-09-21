const { tasksList } = require('../test-data');

const getTasks = user => {
  if (user.role === 'Manager') {
    return tasksList;
  } else {
    return tasksList.filter(task => task.user === user.name);
  }
};

const getTaskByID = paramID => {
  return tasksList.filter(task => task.id === paramID);
};

const createTask = taskToCreate => {
  tasksList.push(taskToCreate);
  return tasksList;
};

module.exports = { getTasks, getTaskByID, createTask };
