require('dotenv').config();
const initializeDatabase = require('./configs/mysql/initDB');
const authentication = require('./middlewares/authentication');
const notFound = require('./middlewares/notFound');
const errorHandler = require('./middlewares/errorHandler');
const cors = require('cors');
const express = require('express');

const app = express();

const tasks = require('./routes/tasks');
const auth = require('./routes/auth');
const admin = require('./routes/admin');

app.use(cors());
app.use(express.json());

app.use('/api/auth', auth);
app.use('/api/tasks', authentication, tasks);
app.use('/api/admin', authentication, admin);

app.use(notFound);
app.use(errorHandler);

const port = process.env.NODE_PORT || 3000;

const start = async () => {
  try {
    await initializeDatabase();
    app.listen(port, console.log('Listening on port ' + port));
  } catch (error) {
    setTimeout(() => start(), 5000);
  }
};

start();
