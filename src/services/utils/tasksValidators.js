const isManager = (role) => {
  return role === 'Manager';
};

const areInputsValid = (taskName, description) => {
  return taskName !== '' && description !== '';
};

const isDescriptionTooBig = (description) => {
  return description.length > 2500;
};

const doesTaskExist = (task) => {
  return task.length !== 0;
};

const wasTaskUpdated = (affectedRows) => {
  return affectedRows !== 0;
};

module.exports = {
  isManager,
  areInputsValid,
  isDescriptionTooBig,
  doesTaskExist,
  wasTaskUpdated
};
