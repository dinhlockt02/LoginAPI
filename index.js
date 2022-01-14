const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { mongoConnectionString } = require('./config/mongo');

const app = express();

const api = require('./src/api');

mongoose
  .connect(mongoConnectionString)
  .then(() => {
    app.listen(3000, () => {
      console.log('server is running on port 3000');
    });
  })
  .catch(() => {
    console.log('Connection failed');
  });

app.use(bodyParser.json());

app.use('/api', api);

app.use((req, res, next) => {
  res.status(404).json({
    message: 'Resource not found',
  });
});

app.use((err, req, res, next) => {
  let { statusCode } = err;
  const { message } = err;
  if (!statusCode) {
    statusCode = 500;
  }

  res.status(statusCode).json({
    message: message,
  });
});
