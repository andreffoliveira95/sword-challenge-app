const mapToDTO = (task) => {
  return {
    taskName: task.task_name,
    description: task.description,
    username: task.username,
    createdAt: task.created_at,
    updatedAt: task.updated_at
  };
};

module.exports = { mapToDTO };
