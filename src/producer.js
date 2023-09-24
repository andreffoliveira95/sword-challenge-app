// messageBroker.js
const amqp = require('amqplib');

const sendNotification = async (message) => {
  try {
    const connection = await amqp.connect(process.env.AMQP_SERVER);
    const channel = await connection.createChannel();

    await channel.assertQueue(process.env.QUEUE_NAME, { durable: false });
    channel.sendToQueue(process.env.QUEUE_NAME, Buffer.from(message));
    console.log(message);
  } catch (error) {
    console.log(error);
  }
};

module.exports = { sendNotification };
