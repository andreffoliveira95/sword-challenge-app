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

const createTask = (request, response) => {
  const body = request.body;
  const updatedTasks = tasksService.createTask(body);
  return response.status(200).send(updatedTasks);
};

module.exports = { getTasks, getTaskByID, createTask };
