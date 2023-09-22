const tasksService = require('../services/tasks');

async function getTasks(request, response) {
  const tasks = await tasksService.getTasks();
  return response.status(200).send({ tasks: tasks });
}

async function getTask(request, response) {
  const paramID = request.params.id;
  const task = await tasksService.getTask(paramID);
  return response.status(200).send(task);
}

async function createTask(request, response) {
  const body = request.body;
  const updatedTasksAfterCreate = await tasksService.createTask(body);
  return response.status(200).send({ tasks: updatedTasksAfterCreate });
}

async function deleteTask(request, response) {
  const paramID = request.params.id;
  const deletedTask = await tasksService.deleteTask(paramID);
  return response.status(200).send(deletedTask);
}

async function updateTask(request, response) {
  const paramID = request.params.id;
  const taskBody = request.body;

  const updatedTasksAfterUpdate = await tasksService.updateTask(
    paramID,
    taskBody
  );

  return response.status(200).send({ tasks: updatedTasksAfterUpdate });
}

module.exports = { getTasks, getTask, createTask, updateTask, deleteTask };
