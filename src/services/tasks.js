const taskDAO = require('../DAOs/taskDAO');
const taskDTO = require('../DTOs/taskDTO');
const userDAO = require('../DAOs/userDAO');

const getTasks = async () => {
  const [user] = await userDAO.getUser('andre@gmail.com', 'password-andre');
  const { role_name, user_id } = user[0];

  if (isManager(role_name)) {
    const [tasks] = await taskDAO.getAllTasks();
    const tasksDTO = tasks.map(task => taskDTO.mapToDTO(task));
    return tasksDTO;
  }

  const [tasks] = await taskDAO.getAllUserTasks(user_id);
  const tasksDTO = tasks.map(task => taskDTO.mapToDTO(task));
  return tasksDTO;
};

const getTask = async taskID => {
  const [user] = await userDAO.getUser('andre@gmail.com', 'password-andre');
  const { user_id, role_name } = user[0];

  if (isManager(role_name)) {
    const [task] = await taskDAO.getTaskByID(taskID);
    return taskDTO.mapToDTO(task[0]);
  }

  const [userTask] = await taskDAO.getUserTask(user_id, taskID);
  return taskDTO.mapToDTO(userTask[0]);
};

const createTask = async taskToCreate => {
  const { taskName, description, userID } = taskToCreate;

  if (isDescriptionBig(description)) {
    console.log('The message can only contain a maximum of 2500 characters');
  }

  const result = await taskDAO.createTask(taskName, description, userID);

  if (result[0].affectedRows === 0) {
    console.log('Task was not created');
  }

  const [tasks] = await taskDAO.getAllUserTasks(userID);
  const tasksDTO = tasks.map(task => taskDTO.mapToDTO(task));
  return tasksDTO;
};

const deleteTask = async taskID => {
  const [user] = await userDAO.getUser('sword@gmail.com', 'password-sword');
  const { role_name } = user[0];

  if (isManager(role_name)) {
    await taskDAO.deleteTask(taskID);
    console.log('User deleted');
  } else {
    console.log('Not allowed to delete task');
  }
};

const updateTask = async (taskID, taskBody) => {
  const [user] = await userDAO.getUser('andre@gmail.com', 'password-andre');
  const { user_id } = user[0];
  const { task_name, description } = taskBody;

  await taskDAO.updateTask(user_id, taskID, task_name, description);

  return await getTasks(user[0]);
};

const isManager = role => {
  return role === 'Manager';
};

const isDescriptionBig = description => {
  return description.length > 2500;
};

module.exports = { getTasks, getTask, createTask, updateTask, deleteTask };
