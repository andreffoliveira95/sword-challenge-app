const tasksService = require('../services/tasks');
const tryCatchWrapper = require('../middlewares/tryCatchWrapper');

const getTasks = tryCatchWrapper(async (request, response) => {
  const tasks = await tasksService.getTasks();
  return response.status(200).send({ tasks: tasks });
});

const getTask = tryCatchWrapper(async (request, response) => {
  const paramID = request.params.id;
  const task = await tasksService.getTask(paramID);
  return response.status(200).send(task);
});

const createTask = tryCatchWrapper(async (request, response) => {
  const body = request.body;
  const updatedTasksAfterCreate = await tasksService.createTask(body);
  return response.status(200).send({ tasks: updatedTasksAfterCreate });
});

const deleteTask = tryCatchWrapper(async (request, response) => {
  const paramID = request.params.id;
  const deletedTask = await tasksService.deleteTask(paramID);
  return response.status(200).send(deletedTask);
});

const updateTask = tryCatchWrapper(async (request, response) => {
  const paramID = request.params.id;
  const taskBody = request.body;

  const updatedTasksAfterUpdate = await tasksService.updateTask(
    paramID,
    taskBody
  );

  return response.status(200).send({ tasks: updatedTasksAfterUpdate });
});

module.exports = { getTasks, getTask, createTask, updateTask, deleteTask };
