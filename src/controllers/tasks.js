const tasksService = require('../services/tasks');
const userDAO = require('../DAOs/userDAO');

async function getTasks(request, response) {
  const user = await userDAO.getUser('sword@gmail.com', 'password-sword');
  const tasks = await tasksService.getTasks(user);
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
  const user = await userDAO.getUser('andre@gmail.com', 'password-andre');
  const deletedTask = await tasksService.deleteTask(user, paramID);
  return response.status(200).send(deletedTask);
}

async function updateTask(request, response) {
  const user = await userDAO.getUser('sword@gmail.com', 'password-sword');
  const paramID = request.params.id;
  const taskBody = request.body;

  const updatedTasksAfterUpdate = tasksService.updateTask(
    user,
    paramID,
    taskBody
  );

  return response.status(200).send({ tasks: updatedTasksAfterUpdate });
}

module.exports = { getTasks, getTask, createTask, updateTask, deleteTask };
