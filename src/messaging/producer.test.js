const amqp = require('amqplib');
const { sendNotification } = require('./producer');

jest.mock('amqplib', () => ({
  connect: jest.fn()
}));

describe('sendNotification', () => {
  const message = 'Test message';
  process.env.AMQP_SERVER = 'amqp-server';
  process.env.QUEUE_NAME = 'queue-name';

  test('should send a notification', async () => {
    const createChannelMock = jest.fn();
    const assertQueueMock = jest.fn();
    const sendToQueueMock = jest.fn();

    amqp.connect.mockReturnValue({
      createChannel: createChannelMock
    });
    createChannelMock.mockReturnValue({
      assertQueue: assertQueueMock,
      sendToQueue: sendToQueueMock
    });

    await sendNotification(message);

    expect(amqp.connect).toHaveBeenCalledWith(process.env.AMQP_SERVER);
    expect(createChannelMock).toHaveBeenCalled();
    expect(assertQueueMock).toHaveBeenCalledWith(process.env.QUEUE_NAME, {
      durable: false
    });
    expect(sendToQueueMock).toHaveBeenCalledWith(
      process.env.QUEUE_NAME,
      Buffer.from(message)
    );
  });

  test('should handle errors', async () => {
    amqp.connect.mockRejectedValue(new Error('Connection error'));

    await expect(sendNotification(message)).rejects.toThrow(Error);
    expect(amqp.connect).toHaveBeenCalled();
  });
});
