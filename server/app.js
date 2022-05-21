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

app.post('/api/words', (req, res) => {
  const numberOfWords = 100;
  const mobyDick = helpers.getFileSegment('./static/mobydick.txt', 'Call me Ishmael', 'End of Project Gutenberg’s Moby Dick');
  const topWords = helpers.topWordsInText(mobyDick, numberOfWords);
  let dbValues = [];

  topWords.forEach((value, index) => {
    let word = value.name;
    let number = numberOfWords - index;
    let count = value.count;

    dbValues.push("('"+number+"', '"+word+"', '"+count+"')");
  });

  db.emptyDb()
  .then(() => {
    db.updateDb("INSERT INTO words (number, name, count) VALUES "+dbValues+";")
    .then(() => {
      res.sendStatus(200);
    });
  });
})
.get('/api/words', (req, res) => {
  const topWords = db.getDb().then((result) => {
    res.send(result);
  });
});

app.listen(port, () => {
  console.log(`Server listening on the port ${port}`);
});

module.exports = app;
