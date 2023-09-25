const pool = require('./connectMySQL');
const fs = require('fs');
const path = require('path');

const readSchemaFile = (filePath) => {
  return fs.readFileSync(filePath, 'utf8');
};

const executeSQLStatments = async (schemaDir, schemaFiles) => {
  schemaFiles.forEach(async (file) => {
    const sqlStatment = readSchemaFile(path.join(schemaDir, file));
    await pool.query(sqlStatment);
  });

  await pool.query(`USE ${process.env.MYSQL_DATABASE}`);
  await pool.query(`INSERT IGNORE INTO roles VALUES (? , ?)`, [1, 'Manager']);
  await pool.query(`INSERT IGNORE INTO roles VALUES (? , ?)`, [
    2,
    'Technician'
  ]);
};

const initializeDatabase = async () => {
  try {
    const schemaDir = path.join(__dirname, 'schemas');
    const schemaFiles = fs.readdirSync(schemaDir);

    await executeSQLStatments(schemaDir, schemaFiles);
  } catch (error) {
    throw new Error('Error initializing database:', error);
  }
};

module.exports = initializeDatabase;
