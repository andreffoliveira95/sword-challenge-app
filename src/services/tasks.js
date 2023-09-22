const { tasksList } = require('../test-data');

function getTasks(user) {
  if (user.role === 'Manager') {
    return tasksList;
  } else {
    return tasksList.filter(task => task.user === user.name);
  }
}

function getTaskByID(taskID) {
  return tasksList.filter(task => task.id === taskID);
}

function createTask(taskToCreate) {
  tasksList.push(taskToCreate);
  return tasksList;
}

function updateTask(user, taskID, message) {
  const newTasks = getTasks(user).map(task => {
    if (task.id === taskID) {
      task.message = message;
      task.updatedAt = 'a few seconds ago';
    }
    return task;
  });

  return newTasks;
}

function deleteTask(user, taskID) {
  if (user.role === 'Manager') {
    return tasksList.filter(task => task.id === taskID);
  }
}

module.exports = { getTasks, getTaskByID, createTask, updateTask, deleteTask };
