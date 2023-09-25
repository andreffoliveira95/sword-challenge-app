const amqp = require('amqplib');
const { showNotifications } = require('./subscriber');

jest.mock('amqplib', () => ({
  connect: jest.fn()
}));

describe('showNotifications', () => {
  process.env.AMQP_SERVER = 'fake-amqp-server';
  process.env.QUEUE_NAME = 'fake-queue-name';
  const createChannelMock = jest.fn();
  const assertQueueMock = jest.fn();
  const consumeMock = jest.fn();
  const ackMock = jest.fn();

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('should consume messages when there are messages', async () => {
    const fakeMessage = {
      content: 'Fake message content'
    };

    amqp.connect.mockReturnValue({
      createChannel: createChannelMock
    });
    createChannelMock.mockReturnValue({
      assertQueue: assertQueueMock,
      consume: consumeMock,
      ack: ackMock
    });

    await showNotifications();

    expect(amqp.connect).toHaveBeenCalledWith(process.env.AMQP_SERVER);
    expect(createChannelMock).toHaveBeenCalled();
    expect(assertQueueMock).toHaveBeenCalledWith(process.env.QUEUE_NAME, {
      durable: false
    });
    expect(consumeMock).toHaveBeenCalledWith(
      process.env.QUEUE_NAME,
      expect.any(Function)
    );
    consumeMock.mock.calls[0][1](fakeMessage);
    expect(ackMock).toHaveBeenCalledWith(fakeMessage);
  });

  test('should not aknowledge messages when there are no messages', async () => {
    const nullMessage = null;

    amqp.connect.mockReturnValue({
      createChannel: createChannelMock
    });
    createChannelMock.mockReturnValue({
      assertQueue: assertQueueMock,
      consume: consumeMock,
      ack: ackMock
    });

    await showNotifications();

    expect(amqp.connect).toHaveBeenCalledWith(process.env.AMQP_SERVER);
    expect(createChannelMock).toHaveBeenCalled();
    expect(assertQueueMock).toHaveBeenCalledWith(process.env.QUEUE_NAME, {
      durable: false
    });
    expect(consumeMock).toHaveBeenCalledWith(
      process.env.QUEUE_NAME,
      expect.any(Function)
    );
    consumeMock.mock.calls[0][1](nullMessage);
    expect(ackMock).not.toHaveBeenCalled();
  });
});
