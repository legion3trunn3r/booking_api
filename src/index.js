const express = require('express');
const routes = require('./routes');
const initDatabase = require('./database');

const app = express();
const port = 3000;

app.use(express.json());
app.use('/api', routes);

const startServer = async () => {
  await initDatabase();
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
};

startServer();