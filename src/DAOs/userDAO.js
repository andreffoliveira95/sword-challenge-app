const pool = require('../configs/mysql/connectMySQL');

const getUser = async (email) => {
  return await pool.query(
    'SELECT * FROM users INNER JOIN roles ON users.role_id = roles.role_id WHERE email = ?',
    [email]
  );
};

const getUserByID = async (userID) => {
  return await pool.query(
    'SELECT * FROM users INNER JOIN roles ON users.role_id = roles.role_id WHERE user_id = ?',
    userID
  );
};

const createUser = async (username, email, password, roleID) => {
  return await pool.query(
    'INSERT INTO users (username, email, password, role_id) VALUES (?, ?, ?, ?)',
    [username, email, password, roleID]
  );
};

const getUsernameCount = async (username) => {
  return await pool.query(
    'SELECT COUNT(*) as count FROM users WHERE username = ?',
    username
  );
};

const getEmailCount = async (email) => {
  return await pool.query(
    'SELECT COUNT(*) as count FROM users WHERE email = ?',
    email
  );
};

const getPassword = async (email) => {
  return await pool.query('SELECT password FROM users WHERE email = ?', email);
};

module.exports = {
  getUser,
  getUserByID,
  createUser,
  getUsernameCount,
  getEmailCount,
  getPassword
};
