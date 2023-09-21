const tasksList = require('../test-data');

const getTasks = (request, response) => {
  response.status(200).send(tasksList);
};

module.exports = { getTasks };
