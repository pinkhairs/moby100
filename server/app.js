const express = require('express');
const path = require('path');
const app = express();
const bodyParser = require('body-parser');
const port = 3001;

app.use(bodyParser.json());

const db = require('./db');
const helpers = require('./helpers');

app.get('/', (req, res) => {
  res.redirect('http://localhost:8080');
});

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,POST');
  next();
});

app.get('/api/words', (req, res) => {
  db.getDb().then((result) => {
    if (result) {
      res.send(result);
    } else {
      const topWords = helpers.getMobyDickTop100Words();
      db.populateDb(topWords)
      .then(() => {
        res.send(topWords);
      });
    }
  });
});

app.listen(port, () => {
  console.log(`Server listening on the port ${port}`);
});

module.exports = app;
