const mysql = require('mysql2');

const pool = mysql.createPool({
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: 'sword_challenge',
  connectionLimit: 10,
  multipleStatements: true
});

module.exports = pool.promise();
