const mapToDTO = task => {
  delete task.task_id;
  delete task.user_id;
  delete task.email;
  delete task.password;
  delete task.role_id;

  return task;
};

module.exports = { mapToDTO };
