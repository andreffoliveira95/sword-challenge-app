const taskDAO = require('../daos/taskDAO');

async function getTasks(user) {
  const { role_name, user_id } = user;

  if (isManager(role_name)) {
    const [tasks] = await taskDAO.getAllTasks();
    return tasks;
  } else {
    const [tasks] = await taskDAO.getUserTasks(user_id);
    return tasks;
  }
}

async function getTask(taskID) {
  const [task] = await taskDAO.getTaskByID(taskID);
  return task[0];
}

async function createTask(taskToCreate) {
  const { taskName, description, userID } = taskToCreate;

  if (isDescriptionBig(description)) {
    console.log('The message can only contain a maximum of 2500 characters');
  }

  const result = await taskDAO.createTask(taskName, description, userID);

  if (result[0].affectedRows === 0) {
    console.log('Task was not created');
  }

  const [tasks] = await taskDAO.getUserTasks(userID);
  return tasks;
}

async function deleteTask(user, taskID) {
  const { role_name } = user;

  if (isManager(role_name)) {
    return await taskDAO.deleteTask(taskID);
  } else {
    console.log('Not allowed to delete task');
  }
}

async function updateTask(user, taskID, taskBody) {
  const { user_id } = user;
  const { task_name, description } = taskBody;

  const task = await taskDAO.getTaskByID(taskID);

  if (task.user_id !== user_id) {
    console.log("You don't have permission to delete this task");
  }

  const result = await taskDAO.updateTask(
    user_id,
    taskID,
    task_name,
    description
  );

  if (result[0].affectedRows === 0) {
    console.log('No changes were applied to the task');
  }

  return await getTasks(user);
}

function isManager(role) {
  return role === 'Manager';
}

function isDescriptionBig(description) {
  return description.length > 2500;
}

module.exports = { getTasks, getTask, createTask, updateTask, deleteTask };
