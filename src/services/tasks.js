const { tasksList } = require('../test-data');

const getTasks = user => {
  if (user.role === 'Manager') {
    return tasksList;
  } else {
    return tasksList.filter(task => task.user === user.name);
  }
};

const getTaskByID = taskID => {
  return tasksList.filter(task => task.id === taskID);
};

const createTask = taskToCreate => {
  tasksList.push(taskToCreate);
  return tasksList;
};

const updateTask = (user, taskID, message) => {
  const newTasks = getTasks(user).map(task => {
    if (task.id === taskID) {
      task.message = message;
      task.updatedAt = 'a few seconds ago';
    }
    return task;
  });

  return newTasks;
};

module.exports = { getTasks, getTaskByID, createTask, updateTask };
