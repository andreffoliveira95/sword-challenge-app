const tasksService = require('../services/tasks');
const { usersList } = require('../test-data');

const getTasks = (request, response) => {
  const tasks = tasksService.getTasks(usersList[0]);
  return response.status(200).send(tasks);
};

const getTaskByID = (request, response) => {
  const paramID = request.params.id;
  const task = tasksService.getTaskByID(paramID);
  return response.status(200).send(task);
};

module.exports = { getTasks, getTaskByID };
