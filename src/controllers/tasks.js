const tasksService = require('../services/tasks');
const { usersList } = require('../test-data');

const getTasks = (request, response) => {
  const tasks = tasksService.getTasks(usersList[0]);
  response.status(200).send(tasks);
};

module.exports = { getTasks };
