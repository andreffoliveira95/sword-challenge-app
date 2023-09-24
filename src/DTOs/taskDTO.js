const moment = require('moment');

const mapToDTO = (task) => {
  return {
    taskName: task.task_name,
    description: task.description,
    username: task.username,
    createdAt: moment(task.created_at).format('YYYY-MM-DD'),
    lastUpdatedAt: moment(task.updated).format('YYYY-MM-DD')
  };
};

module.exports = { mapToDTO };
