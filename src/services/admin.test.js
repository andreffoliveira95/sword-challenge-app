const { checkNotifications } = require('./admin');
const { showNotifications } = require('../messaging/subscriber');
const UnauthorizedError = require('../errors/UnauthorizedError');

jest.mock('../messaging/subscriber', () => ({
  showNotifications: jest.fn(() => ['notification1', 'notification2'])
}));

describe('Admin Service - Check Notifications', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('should return notifications when user is Manager', async () => {
    const user = { roleName: 'Manager' };

    const result = await checkNotifications(user);

    expect(showNotifications).toHaveBeenCalledTimes(1);
    expect(result).toEqual(['notification1', 'notification2']);
  });

  test('should throw Unauthorized Error when user is not Manager', async () => {
    const user = { roleName: 'Technician' };

    await expect(checkNotifications(user)).rejects.toThrow(UnauthorizedError);
    expect(showNotifications).not.toHaveBeenCalled();
  });
});
