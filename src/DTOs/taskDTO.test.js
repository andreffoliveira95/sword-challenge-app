const { mapToDTO } = require('./taskDTO');

const mockTaskResponse = {
  task_id: 1,
  task_name: 'Task 1',
  description: 'First task description',
  user_id: 2,
  created_at: '2023-09-24T06:36:12.000Z',
  updated_at: '2023-09-25T06:36:12.000Z',
  username: 'user'
};

const taskDTO = {
  taskName: 'Task 1',
  description: 'First task description',
  username: 'user',
  createdAt: '24-09-2023',
  lastUpdatedAt: '25-09-2023'
};

describe('DTO Mapper Function', () => {
  test('should return correct task DTO', () => {
    expect(mapToDTO(mockTaskResponse)).toStrictEqual(taskDTO);
  });
});
