const taskDAO = require('../DAOs/taskDAO');
const taskDTO = require('../DTOs/taskDTO');
const UnauthorizedError = require('../errors/UnauthorizedError');
const NotFoundError = require('../errors/NotFoundError');
const BadRequestError = require('../errors/BadRequestError');

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
    doesTaskExist(task);
    return taskDTO.mapToDTO(task[0]);
  }

  const [userTask] = await taskDAO.getUserTask(userID, taskID);
  doesTaskExist(userTask);
  return taskDTO.mapToDTO(userTask[0]);
};

const createTask = async (taskToCreate, user) => {
  const { taskName, description } = taskToCreate;
  const { userID } = user;

  validateInputs(taskName, description);

  const [result] = await taskDAO.createTask(taskName, description, userID);
  const createdTaskID = result.insertId;
  const [task] = await taskDAO.getTaskByID(createdTaskID);

  return taskDTO.mapToDTO(task[0]);
};

const deleteTask = async (taskID, user) => {
  const { roleName } = user;

  const [task] = await taskDAO.getTaskByID(taskID);
  if (task.length === 0) {
    throw new NotFoundError('Could not delete task: task was not found.');
  }

  if (!isManager(roleName)) {
    throw new UnauthorizedError('Not authorized to delete this task.');
  }

  await taskDAO.deleteTask(taskID);
};

const updateTask = async (taskID, taskToUpdate, user) => {
  const { task_name, description } = taskToUpdate;
  const { userID } = user;

  validateInputs(task_name, description);
  const [result] = await taskDAO.updateTask(
    userID,
    taskID,
    task_name,
    description
  );
  wasTaskUpdated(result);
  const [task] = await taskDAO.getTaskByID(taskID);

  return taskDTO.mapToDTO(task[0]);
};

const isManager = (role) => {
  return role === 'Manager';
};

const validateInputs = (taskName, description) => {
  if (!taskName || !description) {
    throw new BadRequestError('Please provide a task name and a description.');
  }

  if (description.length > 2500) {
    throw new BadRequestError(
      'The description can only contain a maximum of 2500 characters.'
    );
  }
};

const doesTaskExist = (task) => {
  if (task.length === 0) {
    throw new NotFoundError('Task not found.');
  }
};

const wasTaskUpdated = (result) => {
  if (result.affectedRows === 0) {
    throw new NotFoundError('Could not update task: task was not found.');
  }
};

module.exports = { getTasks, getTask, createTask, updateTask, deleteTask };
