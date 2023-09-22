const pool = require('./connectMySQL');

function readSchemaFile() {
  const fs = require('fs');
  const path = require('path');
  return fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf8');
}

function getQueries() {
  const queries = readSchemaFile()
    .split(';')
    .map(query => query.trim());

  queries.pop();

  return queries;
}

async function initializeDatabase() {
  try {
    console.log(getQueries());
    getQueries().forEach(async query => await pool.query(query));
    console.log('Database initialized successfully');
  } catch (error) {
    console.error('Error initializing database:', error);
  }
}

module.exports = initializeDatabase;
