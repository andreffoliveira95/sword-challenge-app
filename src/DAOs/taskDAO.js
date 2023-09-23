const pool = require('../configs/mysql/connectMySQL');

const getAllTasks = async function () {
  return await pool.query(
    'SELECT * FROM tasks INNER JOIN users ON tasks.user_id = users.user_id'
  );
};

const getAllUserTasks = async function (userID) {
  return await pool.query(
    'SELECT * FROM tasks INNER JOIN users ON tasks.user_id = users.user_id WHERE tasks.user_id = ?',
    userID
  );
};

const getUserTask = async function (userID, taskID) {
  return await pool.query(
    'SELECT * FROM tasks INNER JOIN users ON tasks.user_id = users.user_id WHERE tasks.user_id = ? AND tasks.task_id = ?',
    [userID, taskID]
  );
};

const getTaskByID = async taskID => {
  return await pool.query(
    'SELECT * FROM tasks INNER JOIN users ON tasks.user_id = users.user_id WHERE task_id = ?',
    taskID
  );
};

const createTask = async (taskName, description, userID) => {
  return await pool.query(
    'INSERT INTO tasks (task_name, description, user_id) VALUES (?, ?, ?)',
    [taskName, description, userID]
  );
};

const deleteTask = async taskID => {
  return await pool.query('DELETE FROM tasks WHERE task_id = ?', taskID);
};

const updateTask = async (userID, taskID, taskName, description) => {
  return await pool.query(
    'UPDATE tasks SET task_name = ?, description = ? WHERE user_id = ? AND task_id = ?',
    [taskName, description, userID, taskID]
  );
};

module.exports = {
  getAllTasks,
  getAllUserTasks,
  getUserTask,
  getTaskByID,
  createTask,
  deleteTask,
  updateTask
};
