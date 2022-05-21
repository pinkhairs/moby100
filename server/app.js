const express = require('express');
const path = require('path');
const app = express();
const bodyParser = require('body-parser');
const port = 3001;

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '../client/dist')));

const helpers = require('./helpers');

app.get('/', (req,res) => {
  res.sendFile(path.join(__dirname, './client/dist/index.html'));
});

app.get('/api/words', (req,res) => {
  res.header('Access-Control-Allow-Origin', "*");
  res.header('Access-Control-Allow-Methods', 'GET');

  const mobyDick = helpers.getFileSegment('./static/mobydick.txt', 'Call me Ishmael', 'End of Project Gutenberg’s Moby Dick');
  const top100Words = helpers.topWordsInText(mobyDick, 100);

  res.send(top100Words);
});

app.listen(port, () => {
    console.log(`Server listening on the port ${port}`);
});

module.exports = app;
