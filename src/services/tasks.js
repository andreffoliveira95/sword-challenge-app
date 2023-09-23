const taskDAO = require('../DAOs/taskDAO');
const taskDTO = require('../DTOs/taskDTO');
const userDAO = require('../DAOs/userDAO');
const UnauthorizedError = require('../errors/UnauthorizedError');
const NotFoundError = require('../errors/NotFoundError');
const BadRequestError = require('../errors/BadRequestError');

const getTasks = async () => {
  const [user] = await userDAO.getUser('andre@gmail.com', 'password-andre');
  const { role_name, user_id } = user[0];

  if (isManager(role_name)) {
    const [tasks] = await taskDAO.getAllTasks();
    const tasksDTO = tasks.map((task) => taskDTO.mapToDTO(task));
    return tasksDTO;
  }

  const [tasks] = await taskDAO.getAllUserTasks(user_id);
  const tasksDTO = tasks.map((task) => taskDTO.mapToDTO(task));
  return tasksDTO;
};

const getTask = async (taskID) => {
  const [user] = await userDAO.getUser('sword@gmail.com', 'password-sword');
  const { user_id, role_name } = user[0];

  if (isManager(role_name)) {
    const [task] = await taskDAO.getTaskByID(taskID);
    doesTaskExist(task);
    return taskDTO.mapToDTO(task[0]);
  }

  const [userTask] = await taskDAO.getUserTask(user_id, taskID);
  doesTaskExist(userTask);
  return taskDTO.mapToDTO(userTask[0]);
};

const createTask = async (taskToCreate) => {
  const { taskName, description, userID } = taskToCreate;
  validateInputs(taskName, description);

  const [result] = await taskDAO.createTask(taskName, description, userID);
  const createdTaskID = result.insertId;
  const [task] = await taskDAO.getTaskByID(createdTaskID);

  return taskDTO.mapToDTO(task[0]);
};

const deleteTask = async (taskID) => {
  const [user] = await userDAO.getUser('andre@gmail.com', 'password-andre');
  const { role_name } = user[0];

  if (!isManager(role_name)) {
    throw new UnauthorizedError('Not authorized to delete this task.');
  }

  await taskDAO.deleteTask(taskID);
};

const updateTask = async (taskID, taskBody) => {
  const [user] = await userDAO.getUser('andre@gmail.com', 'password-andre');
  const { user_id } = user[0];

  const { task_name, description } = taskBody;
  validateInputs(task_name, description);
  const [result] = await taskDAO.updateTask(
    user_id,
    taskID,
    task_name,
    description
  );
  wasTaskCreated(result);
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

const wasTaskCreated = (result) => {
  if (result.affectedRows === 0) {
    throw new NotFoundError('Could not update task: task was not found.');
  }
};

module.exports = { getTasks, getTask, createTask, updateTask, deleteTask };
