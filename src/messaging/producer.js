const amqp = require('amqplib');

const sendNotification = async (message) => {
  try {
    const connection = await amqp.connect(process.env.AMQP_SERVER);
    const channel = await connection.createChannel();

    await channel.assertQueue(process.env.QUEUE_NAME, { durable: false });
    channel.sendToQueue(process.env.QUEUE_NAME, Buffer.from(message));
    console.log(message);
  } catch (error) {
    throw new Error(`Failed to send notification: ${error.message}`);
  }
};

module.exports = { sendNotification };
