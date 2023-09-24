const moment = require('moment');

const mapToDTO = (task) => {
  return {
    taskName: task.task_name,
    description: task.description,
    username: task.username,
    createdAt: moment(task.created_at).format('DD-MM-YYYY'),
    lastUpdatedAt: moment(task.updated_at).format('DD-MM-YYYY')
  };
};

module.exports = { mapToDTO };
