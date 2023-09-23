const pool = require('../configs/mysql/connectMySQL');

const getUser = async (email, password) => {
  return await pool.query(
    'SELECT * FROM users INNER JOIN roles ON users.role_id = roles.role_id WHERE email = ? AND password = ?',
    [email, password]
  );
};

const getUserByID = async userID => {
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

module.exports = { getUser, getUserByID, createUser };
