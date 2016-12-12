const PORT = process.env.PORT || 1337;

const express = require('express');
const app = express();
const path = require('path');
const chalk = require('chalk');

app.use(
  require('morgan')('dev'),
  express.static(path.join(__dirname, '../client'))
);

app.listen(PORT, () => console.log(
  chalk.green.bold('Map View file server listening on port: ') 
  + chalk.cyan.bold(PORT)
));