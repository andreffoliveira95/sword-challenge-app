const tasksService = require('../services/tasks');
const { usersList } = require('../test-data');

const getTasks = (request, response) => {
  const tasks = tasksService.getTasks(usersList[1]);
  return response.status(200).send({ tasks: tasks });
};

const getTaskByID = (request, response) => {
  const paramID = request.params.id;
  const [task] = tasksService.getTaskByID(paramID);
  return response.status(200).send(task);
};

const createTask = (request, response) => {
  const body = request.body;
  const updatedTasksAfterCreate = tasksService.createTask(body);
  return response.status(200).send({ tasks: updatedTasksAfterCreate });
};

const updateTask = (request, response) => {
  const paramID = request.params.id;
  const message = request.body.message;
  const updatedTasksAfterUpdate = tasksService.updateTask(
    usersList[1],
    paramID,
    message
  );
  return response.status(200).send({ tasks: updatedTasksAfterUpdate });
};

const deleteTask = (request, response) => {
  const paramID = request.params.id;
  const [deletedTask] = tasksService.deleteTask(usersList[1], paramID);
  return response.status(200).send(deletedTask);
};

module.exports = { getTasks, getTaskByID, createTask, updateTask, deleteTask };
