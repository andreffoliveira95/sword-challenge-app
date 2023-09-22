const pool = require('../configs/mysql/connectMySQL');

async function getUser(email, password) {
  try {
    const [user] = await pool.query(
      'SELECT * FROM users INNER JOIN roles ON users.role_id = roles.role_id WHERE email = ? AND password = ?',
      [email, password]
    );
    return user[0];
  } catch (error) {
    console.log(error);
  }
}

async function createUser(username, email, password) {
  try {
    await pool.query(
      'INSERT INTO users (username, email, password) VALUES (?, ?, ?)',
      [username, email, password]
    );
  } catch (error) {
    console.log(error);
  }
}

module.exports = { getUser, createUser };
