const pool = require('./connectMySQL');

const readSchemaFile = () => {
  const fs = require('fs');
  const path = require('path');
  return fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf8');
};

const getQueries = () => {
  const queries = readSchemaFile()
    .split(';')
    .map((query) => query.trim());

  queries.pop();

  return queries;
};

const initializeDatabase = async () => {
  try {
    getQueries().forEach(async (query) => await pool.query(query));
    console.log('Database initialized successfully!');
  } catch (error) {
    console.error('Error initializing database:', error);
  }
};

module.exports = initializeDatabase;
