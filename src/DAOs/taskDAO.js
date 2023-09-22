const pool = require('../configs/mysql/connectMySQL');

async function getAllTasks() {
  return await pool.query(
    'SELECT * FROM tasks INNER JOIN users ON tasks.user_id = users.user_id'
  );
}

async function getAllUserTasks(userID) {
  return await pool.query(
    'SELECT * FROM tasks INNER JOIN users ON tasks.user_id = users.user_id WHERE tasks.user_id = ?',
    userID
  );
}

async function getUserTask(userID, taskID) {
  return await pool.query(
    'SELECT * FROM tasks INNER JOIN users ON tasks.user_id = users.user_id WHERE tasks.user_id = ? AND tasks.task_id = ?',
    [userID, taskID]
  );
}

async function getTaskByID(taskID) {
  return await pool.query(
    'SELECT * FROM tasks INNER JOIN users ON tasks.user_id = users.user_id WHERE task_id = ?',
    taskID
  );
}

async function createTask(taskName, description, userID) {
  return await pool.query(
    'INSERT INTO tasks (task_name, description, user_id) VALUES (?, ?, ?)',
    [taskName, description, userID]
  );
}

async function deleteTask(taskID) {
  return await pool.query('DELETE FROM tasks WHERE task_id = ?', taskID);
}

async function updateTask(userID, taskID, taskName, description) {
  return await pool.query(
    'UPDATE tasks SET task_name = ?, description = ? WHERE user_id = ? AND task_id = ?',
    [taskName, description, userID, taskID]
  );
}

module.exports = {
  getAllTasks,
  getAllUserTasks,
  getUserTask,
  getTaskByID,
  createTask,
  deleteTask,
  updateTask
};
