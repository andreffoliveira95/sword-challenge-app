const express = require('express');
const tasksController = require('../controllers/tasks');
const router = express.Router();

router
  .route('/')
  .get(tasksController.getTasks)
  .post(tasksController.createTask);

router
  .route('/:id')
  .get(tasksController.getTaskByID)
  .patch(tasksController.updateTask)
  .delete(tasksController.deleteTask);

module.exports = router;
