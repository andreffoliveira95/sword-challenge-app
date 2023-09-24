const amqp = require('amqplib');

const showNotifications = async () => {
  const connection = await amqp.connect(process.env.AMQP_SERVER);
  const channel = await connection.createChannel();
  await channel.assertQueue(process.env.QUEUE_NAME, { durable: false });

  await channel.consume(process.env.QUEUE_NAME, (message) => {
    if (message !== null) {
      console.log(`Received: ${message.content.toString()}`);
      channel.ack(message);
    }
  });
};

module.exports = { showNotifications };
