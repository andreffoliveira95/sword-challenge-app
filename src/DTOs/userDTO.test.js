const { mapToDTO } = require('./userDTO');

const mockUserResponse = {
  user_id: 1,
  username: 'user',
  email: 'user@example.com',
  password: 'password',
  role_id: 1,
  created_at: '2023-09-01T14:48:00.000Z',
  updated_at: '2023-09-24T14:48:00.000Z',
  role_name: 'Manager'
};

const userDTO = {
  userID: 1,
  username: 'user',
  roleName: 'Manager',
  createdAt: '01-09-2023',
  lastUpdatedAt: '24-09-2023'
};

describe('DTO Mapper Function', () => {
  test('should return correct user DTO', () => {
    expect(mapToDTO(mockUserResponse)).toStrictEqual(userDTO);
  });
});
