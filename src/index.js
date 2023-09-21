const express = require('express');
const tasks = require('./routes/tasks');
const app = express();

app.use('/api/tasks', tasks);

app.listen(3000, () => {
  console.log('listening on port 3000');
});
