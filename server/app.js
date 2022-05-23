const express = require('express');
const path = require('path');
const app = express();
const bodyParser = require('body-parser');

const helpers = require('./helpers');

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '../client/dist')));

app.get('/api/words', (req, res) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET');
  helpers.getWordsApi()
  .then((words) => {
    res.send(words);
  })
});

module.exports = app;