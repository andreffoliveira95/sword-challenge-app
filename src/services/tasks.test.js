const tasksService = require('../services/tasks');
const taskDAO = require('../DAOs/taskDAO');
const taskDTO = require('../DTOs/taskDTO');
const { sendNotification } = require('../messaging/producer');
const NotFoundError = require('../errors/NotFoundError');
const UnauthorizedError = require('../errors/UnauthorizedError');
const BadRequestError = require('../errors/BadRequestError');

jest.mock('../DAOs/taskDAO', () => ({
  getTasks: jest.fn(),
  getAllTasks: jest.fn(),
  getAllUserTasks: jest.fn(),
  getTaskByID: jest.fn(),
  getUserTask: jest.fn(),
  createTask: jest.fn(),
  deleteTask: jest.fn(),
  updateTask: jest.fn()
}));

jest.mock('../DTOs/taskDTO', () => ({
  mapToDTO: jest.fn((object) => object)
}));

jest.mock('../messaging/producer', () => ({
  sendNotification: jest.fn()
}));

jest.mock('moment', () => {
  return () =>
    jest.requireActual('moment')('24.09.2023', 'MMMM Do YYYY, h:mm:ss a');
});

describe('Tasks Service', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getTasks', () => {
    test('should return all tasks when user is Manager', async () => {
      const user = { userID: 1, roleName: 'Manager' };
      const mockAllTasks = [
        { taskID: 1, taskName: 'Manager Task 1' },
        { taskID: 2, taskName: 'Technician Task 2' },
        { taskID: 3, taskName: 'Technician Task 3' }
      ];

      taskDAO.getAllTasks.mockReturnValue([mockAllTasks]);

      const result = await tasksService.getTasks(user);

      expect(taskDAO.getAllTasks).toHaveBeenCalledTimes(1);
      expect(taskDAO.getAllUserTasks).not.toHaveBeenCalled();
      expect(taskDTO.mapToDTO).toHaveBeenCalledTimes(3);
      expect(result).toEqual(mockAllTasks);
    });

    test('should return only user tasks when user is not Manager', async () => {
      const user = { userID: 100, roleName: 'Technician' };
      const mockAllTasks = [
        { taskID: 1, taskName: 'Technician Task 1' },
        { taskID: 2, taskName: 'Technician Task 2' }
      ];

      taskDAO.getAllUserTasks.mockReturnValue([mockAllTasks]);

      const result = await tasksService.getTasks(user);

      expect(taskDAO.getAllUserTasks).toHaveBeenCalledTimes(1);
      expect(taskDAO.getAllUserTasks).toHaveBeenCalledWith(user.userID);
      expect(taskDAO.getAllTasks).not.toHaveBeenCalled();
      expect(taskDTO.mapToDTO).toHaveBeenCalledTimes(2);
      expect(result).toEqual(mockAllTasks);
    });
  });

  describe('getTask', () => {
    test('should return any task when user is Manager', async () => {
      const user = { userID: 1, roleName: 'Manager' };
      const task = { id: 1, name: 'Technician Task 1' };

      taskDAO.getTaskByID.mockReturnValue([[task]]);

      const result = await tasksService.getTask(task.id, user);

      expect(taskDAO.getTaskByID).toHaveBeenCalledWith(task.id);
      expect(taskDAO.getUserTask).not.toHaveBeenCalled();
      expect(taskDTO.mapToDTO).toHaveBeenCalledTimes(1);
      expect(result).toEqual(task);
    });

    test('should return only a user task when user is not Manager', async () => {
      const user = { userID: 1, roleName: 'Technician' };
      const task = { id: 1, name: 'Technician Task' };

      taskDAO.getUserTask.mockReturnValue([[task]]);

      const result = await tasksService.getTask(task.id, user);

      expect(taskDAO.getUserTask).toHaveBeenCalledWith(user.userID, task.id);
      expect(taskDTO.mapToDTO).toHaveBeenCalledTimes(1);
      expect(taskDAO.getTaskByID).not.toHaveBeenCalled();
      expect(result).toEqual(task);
    });

    test('should throw Not Found Error when task does not exist - Manager', async () => {
      const user = { userID: 1, roleName: 'Manager' };
      const taskID = 1;

      taskDAO.getTaskByID.mockReturnValue([[]]);

      await expect(tasksService.getTask(taskID, user)).rejects.toThrow(
        NotFoundError
      );

      expect(taskDAO.getTaskByID).toHaveBeenCalledWith(taskID);
      expect(taskDAO.getUserTask).not.toHaveBeenCalled();
      expect(taskDTO.mapToDTO).not.toHaveBeenCalled();
    });

    test('should throw Not Found Error when task does not exist - Technician', async () => {
      const user = { userID: 1, roleName: 'Technician' };
      const taskID = 1;

      taskDAO.getUserTask.mockReturnValue([[]]);

      await expect(tasksService.getTask(taskID, user)).rejects.toThrow(
        NotFoundError
      );

      expect(taskDAO.getUserTask).toHaveBeenCalledWith(user.userID, taskID);
      expect(taskDAO.getTaskByID).not.toHaveBeenCalled();
      expect(taskDTO.mapToDTO).not.toHaveBeenCalled();
    });
  });

  describe('createTask', () => {
    test('should create a task when inputs are valid and user is Manager', async () => {
      const user = { userID: 1, username: 'User1', roleName: 'Manager' };
      const taskToCreate = { taskName: 'Task 1', description: 'Description 1' };
      const createdTask = { task_id: 100, task_name: 'Task 1', user_id: 1 };

      taskDAO.createTask.mockReturnValue([{ insertId: createdTask.task_id }]);
      taskDAO.getTaskByID.mockReturnValue([[createdTask]]);

      const result = await tasksService.createTask(taskToCreate, user);

      expect(taskDAO.createTask).toHaveBeenCalledWith(
        taskToCreate.taskName,
        taskToCreate.description,
        user.userID
      );
      expect(taskDAO.getTaskByID).toHaveBeenCalledWith(createdTask.task_id);
      expect(sendNotification).not.toHaveBeenCalledWith();
      expect(taskDTO.mapToDTO).toHaveBeenCalledWith(createdTask);
      expect(result).toEqual(createdTask);
    });

    test('should create a task when inputs are valid and user is Tecnician', async () => {
      const taskToCreate = { taskName: 'Task 1', description: 'Description 1' };
      const mockUser = { userID: 1, username: 'User1', roleName: 'Tecnician' };
      const createdTask = { task_id: 100, task_name: 'Task 1', user_id: 1 };

      taskDAO.createTask.mockResolvedValue([{ insertId: createdTask.task_id }]);
      taskDAO.getTaskByID.mockResolvedValue([[createdTask]]);
      taskDTO.mapToDTO.mockImplementation((createdTask) => createdTask);

      const result = await tasksService.createTask(taskToCreate, mockUser);

      expect(taskDAO.createTask).toHaveBeenCalledWith(
        'Task 1',
        'Description 1',
        1
      );
      expect(taskDAO.getTaskByID).toHaveBeenCalledWith(createdTask.task_id);
      expect(sendNotification).toHaveBeenCalled();
      expect(taskDTO.mapToDTO).toHaveBeenCalledWith(createdTask); //
      expect(result).toEqual(createdTask);
    });

    test('should throw a Bad Request Error when description is too big', async () => {
      const taskToCreate = {
        taskName: 'Task 1',
        description: 'A'.repeat(2501)
      };
      const user = { userID: 1, username: 'User1', roleName: 'Manager' };

      await expect(tasksService.createTask(taskToCreate, user)).rejects.toThrow(
        BadRequestError
      );

      expect(taskDAO.createTask).not.toHaveBeenCalled();
    });

    test('should throw a Bad Request Error when inputs are not valid', async () => {
      const taskToCreate = { taskName: '', description: '' };
      const user = { userID: 1, username: 'User1', roleName: 'Manager' };

      await expect(tasksService.createTask(taskToCreate, user)).rejects.toThrow(
        BadRequestError
      );
    });
  });

  /* describe('updateTask', () => {
    test('should update a task when Manager tries to update not his own task', async () => {
      const taskToUpdate = { taskName: 'Task 1', description: 'After Change' };
      const existingTask = { taskName: 'Task 1', description: 'Before change' };
      const user = { userID: 1, username: 'User1', roleName: 'Manager' };
      const taskID = 1;

      taskDAO.getTaskByID.mockReturnValue([[existingTask]]);
      taskDAO.updateTask.mockReturnValue([{ affectedRows: 0 }]);
      taskDTO.mapToDTO.mockReturnValue((task) => task);

      await expect(
        tasksService.updateTask(taskID, taskToUpdate, user)
      ).rejects.toThrow(NotFoundError);

      expect(taskDAO.getTaskByID).toHaveBeenCalledWith(taskID);
      expect(taskDAO.updateTask).toHaveBeenCalledWith(
        user.userID,
        taskID,
        taskToUpdate.taskName,
        taskToUpdate.description
      );
      expect(taskDTO.mapToDTO).toHaveBeenCalledWith();
    });

    test('should throw Not Found Error when Tecnician tries to update not his own task', async () => {
      const taskToUpdate = { taskName: 'Task 1', description: 'After Change' };
      const existingTask = { taskName: 'Task 1', description: 'Before change' };
      const user = { userID: 1, username: 'User1', roleName: 'Technician' };
      const taskID = 1;

      taskDAO.getTaskByID.mockReturnValue([[existingTask]]);
      taskDAO.updateTask.mockReturnValue([{ affectedRows: 0 }]);

      await expect(
        tasksService.updateTask(taskID, taskToUpdate, user)
      ).rejects.toThrow(NotFoundError);

      expect(taskDAO.getTaskByID).toHaveBeenCalledWith(taskID);
      expect(taskDAO.updateTask).toHaveBeenCalledWith(
        user.userID,
        taskID,
        taskToUpdate.taskName,
        taskToUpdate.description
      );
      expect(taskDTO.mapToDTO).not.toHaveBeenCalled();
    });

    test('should throw Not Authorized Error when Manager tries to update not his own task', async () => {
      const taskToUpdate = { taskName: 'Task 1', description: 'After Change' };
      const existingTask = { taskName: 'Task 1', description: 'Before change' };
      const user = { userID: 1, username: 'User1', roleName: 'Manager' };
      const taskID = 1;

      taskDAO.getTaskByID.mockReturnValue([[existingTask]]);
      taskDAO.updateTask.mockReturnValue([{ affectedRows: 0 }]);

      await expect(
        tasksService.updateTask(taskID, taskToUpdate, user)
      ).rejects.toThrow(UnauthorizedError);

      expect(taskDAO.getTaskByID).toHaveBeenCalledWith(taskID);
      expect(taskDAO.updateTask).toHaveBeenCalledWith(
        user.userID,
        taskID,
        taskToUpdate.taskName,
        taskToUpdate.description
      );
      expect(taskDTO.mapToDTO).not.toHaveBeenCalled();
    });

    test('should throw Not Found Error when task does not exist', async () => {
      const taskToUpdate = { taskName: 'Task 1', description: 'Description 1' };
      const user = { userID: 1, username: 'User1', roleName: 'Manager' };
      const taskID = 1;

      taskDAO.getTaskByID.mockReturnValue([[]]);

      await expect(
        tasksService.updateTask(taskID, taskToUpdate, user)
      ).rejects.toThrow(NotFoundError);

      expect(taskDAO.getTaskByID).toHaveBeenCalledWith(taskID);
      expect(taskDAO.updateTask).not.toHaveBeenCalled();
      expect(taskDTO.mapToDTO).not.toHaveBeenCalled();
    });

    test('should throw a Bad Request Error when description is too big', async () => {
      const taskToUpdate = { taskName: 'Task 1', description: 'Description 1' };
      const user = { userID: 1, username: 'User1', roleName: 'Manager' };
      const taskID = 1;

      await expect(
        tasksService.updateTask(taskID, taskToUpdate, user)
      ).rejects.toThrow(BadRequestError);

      expect(taskDAO.getTaskByID).not.toHaveBeenCalled();
    });

    test('should throw a Bad Request Error when inputs are not valid', async () => {
      const taskToUpdate = { taskName: 'Task 1', description: 'Description 1' };
      const user = { userID: 1, username: 'User1', roleName: 'Manager' };
      const taskID = 1;

      await expect(
        tasksService.updateTask(taskID, taskToUpdate, user)
      ).rejects.toThrow(BadRequestError);
    });
  }); */

  describe('deleteTask', () => {
    test('should delete a task when called by a Manager', async () => {
      const user = { roleName: 'Manager' };
      const existingTask = { taskID: 1, name: 'Task 1' };

      taskDAO.getTaskByID.mockResolvedValue([existingTask]);

      await tasksService.deleteTask(existingTask.taskID, user);

      expect(taskDAO.getTaskByID).toHaveBeenCalledWith(existingTask.taskID);
      expect(taskDAO.deleteTask).toHaveBeenCalledWith(existingTask.taskID);
    });

    test('should throw a Not Found Error when task does not exist', async () => {
      const user = { roleName: 'Manager' };
      const existingTask = { taskID: 1, name: 'Task 1' };

      taskDAO.getTaskByID.mockReturnValue([[]]);

      await expect(
        tasksService.deleteTask(existingTask.taskID, user)
      ).rejects.toThrow(NotFoundError);

      expect(taskDAO.getTaskByID).toHaveBeenCalledWith(existingTask.taskID);
      expect(taskDAO.deleteTask).not.toHaveBeenCalled();
    });

    test('should throw an Unauthorized Error when user is not Manager', async () => {
      const user = { roleName: 'Technician' };

      await expect(tasksService.deleteTask(1, user)).rejects.toThrow(
        UnauthorizedError
      );

      expect(taskDAO.getTaskByID).not.toHaveBeenCalled();
    });
  });
});
