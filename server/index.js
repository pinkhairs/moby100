const express = require('express');
const path = require('path');
const app = express();
const bodyParser = require('body-parser');
const PORT = process.env.PORT || 3001;

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

app.listen(PORT, () => {
  console.log(`Server listening on the port ${PORT}`);
});

module.exports = app;