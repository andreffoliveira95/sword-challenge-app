const express = require('express');
const tasks = require('./routes/tasks');
const auth = require('./routes/auth');

const app = express();

app.use(express.json());
app.use('/api/auth', auth);
app.use('/api/tasks', tasks);

app.listen(3000, () => {
  console.log('listening on port 3000');
});
