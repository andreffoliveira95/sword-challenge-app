const moment = require('moment');
const taskDAO = require('../DAOs/taskDAO');
const taskDTO = require('../DTOs/taskDTO');
const UnauthorizedError = require('../errors/UnauthorizedError');
const NotFoundError = require('../errors/NotFoundError');
const BadRequestError = require('../errors/BadRequestError');
const { sendNotification } = require('../producer');
const {
  isManager,
  areInputsValid,
  isDescriptionTooBig,
  doesTaskExist,
  wasTaskUpdated
} = require('./utils/tasksValidators');

const getTasks = async (user) => {
  const { userID, roleName } = user;

  if (isManager(roleName)) {
    const [tasks] = await taskDAO.getAllTasks();
    const tasksDTO = tasks.map((task) => taskDTO.mapToDTO(task));
    return tasksDTO;
  }

  const [tasks] = await taskDAO.getAllUserTasks(userID);
  const tasksDTO = tasks.map((task) => taskDTO.mapToDTO(task));
  return tasksDTO;
};

const getTask = async (taskID, user) => {
  const { userID, roleName } = user;

  if (isManager(roleName)) {
    const [task] = await taskDAO.getTaskByID(taskID);
    if (!doesTaskExist(task)) {
      throw new NotFoundError('Task not found.');
    }
    return taskDTO.mapToDTO(task[0]);
  }

  const [userTask] = await taskDAO.getUserTask(userID, taskID);
  if (!doesTaskExist(userTask)) {
    throw new NotFoundError('Task not found.');
  }
  return taskDTO.mapToDTO(userTask[0]);
};

const createTask = async (taskToCreate, user) => {
  const { taskName, description } = taskToCreate;
  const { userID, username, roleName } = user;

  if (areInputsValid(taskName, description)) {
    throw new BadRequestError('Please provide a task name and a description.');
  }

  if (isDescriptionTooBig(description)) {
    throw new BadRequestError(
      'The description can only contain a maximum of 2500 characters.'
    );
  }

  const [result] = await taskDAO.createTask(taskName, description, userID);
  const createdTaskID = result.insertId;
  const [task] = await taskDAO.getTaskByID(createdTaskID);

  if (!isManager(roleName)) {
    const taskName = task[0].task_name;
    const date = moment().format('MMMM Do YYYY, h:mm:ss a');
    const message = `Technician ${username} created task with name "${taskName}" on ${date}`;

    await sendNotification(message);
  }

  return taskDTO.mapToDTO(task[0]);
};

const deleteTask = async (taskID, user) => {
  const { roleName } = user;

  const [task] = await taskDAO.getTaskByID(taskID);

  if (!doesTaskExist(task)) {
    throw new NotFoundError('Could not delete task: task was not found.');
  }

  if (!isManager(roleName)) {
    throw new UnauthorizedError('Not authorized to delete this task.');
  }

  await taskDAO.deleteTask(taskID);
};

const updateTask = async (taskID, taskToUpdate, user) => {
  const { task_name, description } = taskToUpdate;
  const { userID, username, roleName } = user;

  if (areInputsValid(task_name, description)) {
    throw new BadRequestError('Please provide a task name and a description.');
  }

  if (isDescriptionTooBig(description)) {
    throw new BadRequestError(
      'The description can only contain a maximum of 2500 characters.'
    );
  }

  const [result] = await taskDAO.updateTask(
    userID,
    taskID,
    task_name,
    description
  );

  if (!wasTaskUpdated(result)) {
    throw new NotFoundError('Could not update task: task was not found.');
  }

  const [task] = await taskDAO.getTaskByID(taskID);

  if (!isManager(roleName)) {
    const taskName = task[0].task_name;
    const date = moment().format('MMMM Do YYYY, h:mm:ss');
    const message = `Technician ${username} updated task with name "${taskName}" on ${date}`;

    await sendNotification(message);
  }

  return taskDTO.mapToDTO(task[0]);
};

module.exports = { getTasks, getTask, createTask, updateTask, deleteTask };
