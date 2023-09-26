require('dotenv').config();
const initializeDatabase = require('./configs/mysql/initDB');
const authentication = require('./middlewares/authentication');
const notFound = require('./middlewares/notFound');
const errorHandler = require('./middlewares/errorHandler');

const cors = require('cors');
const express = require('express');

const swaggerUI = require('swagger-ui-express');
const YAML = require('yamljs');
const swaggerDocument = YAML.load('src/swagger.yaml');

const app = express();

const tasks = require('./routes/tasks');
const auth = require('./routes/auth');
const admin = require('./routes/admin');

app.use(cors());
app.use(express.json());

app.get('/', (request, response) => {
  return response.send(
    '<h1>Sword Challenge API</h1><a href="/documentation">Documentation</a>'
  );
});

app.use('/documentation', swaggerUI.serve, swaggerUI.setup(swaggerDocument));
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
