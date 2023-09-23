require('dotenv').config();
const initializeDatabase = require('./configs/mysql/initDB');
const express = require('express');

const app = express();

const tasks = require('./routes/tasks');
const auth = require('./routes/auth');

app.use(express.json());
app.use('/api/auth', auth);
app.use('/api/tasks', tasks);

const port = process.env.NODE_PORT || 3000;

initializeDatabase();
app.listen(port, () => console.log('Listening on port ' + port));
