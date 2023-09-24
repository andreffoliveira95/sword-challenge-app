const tasksService = require('../services/tasks');
const tryCatchWrapper = require('../middlewares/tryCatchWrapper');
const { StatusCodes } = require('http-status-codes');

const getTasks = tryCatchWrapper(async (request, response) => {
  const user = request.user;
  const tasks = await tasksService.getTasks(user);

  return response.status(StatusCodes.OK).json(tasks);
});

const getTask = tryCatchWrapper(async (request, response) => {
  const paramID = request.params.id;
  const user = request.user;
  const task = await tasksService.getTask(paramID, user);

  return response.status(StatusCodes.OK).json(task);
});

const createTask = tryCatchWrapper(async (request, response) => {
  const taskToCreate = request.body;
  const user = request.user;
  const createdTask = await tasksService.createTask(taskToCreate, user);

  return response.status(StatusCodes.CREATED).json(createdTask);
});

const deleteTask = tryCatchWrapper(async (request, response) => {
  const paramID = request.params.id;
  const user = request.user;
  await tasksService.deleteTask(paramID, user);

  return response
    .status(StatusCodes.NO_CONTENT)
    .json('Task successfully deleted');
});

const updateTask = tryCatchWrapper(async (request, response) => {
  const paramID = request.params.id;
  const taskToUpdate = request.body;
  const user = request.user;
  const updatedTask = await tasksService.updateTask(
    paramID,
    taskToUpdate,
    user
  );

  return response.status(StatusCodes.OK).send({ updatedTask });
});

module.exports = {
  getTasks,
  getTask,
  createTask,
  updateTask,
  deleteTask
};
