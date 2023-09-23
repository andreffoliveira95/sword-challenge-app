const tasksService = require('../services/tasks');
const tryCatchWrapper = require('../middlewares/tryCatchWrapper');
const { StatusCodes } = require('http-status-codes');

const getTasks = tryCatchWrapper(async (request, response) => {
  const tasks = await tasksService.getTasks();

  return response.status(StatusCodes.OK).send({ tasks: tasks });
});

const getTask = tryCatchWrapper(async (request, response) => {
  const paramID = request.params.id;
  const task = await tasksService.getTask(paramID);

  return response.status(StatusCodes.OK).send(task);
});

const createTask = tryCatchWrapper(async (request, response) => {
  const body = request.body;
  const createdTask = await tasksService.createTask(body);

  return response.status(StatusCodes.CREATED).send({ createdTask });
});

const deleteTask = tryCatchWrapper(async (request, response) => {
  const paramID = request.params.id;
  await tasksService.deleteTask(paramID);

  return response.status(StatusCodes.NO_CONTENT).send('Task deleted');
});

const updateTask = tryCatchWrapper(async (request, response) => {
  const paramID = request.params.id;
  const taskBody = request.body;
  const updatedTask = await tasksService.updateTask(paramID, taskBody);

  return response.status(StatusCodes.OK).send({ updatedTask });
});

module.exports = { getTasks, getTask, createTask, updateTask, deleteTask };
