const express = require('express');
const path = require('path');
const app = express();
const bodyParser = require('body-parser');
const PORT = process.env.PORT || 3001;

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '../client/dist')));

app.get('/', (req, res) => {
  res.sendFile('index.html');
});

app.get('/api/words', (req, res) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET');
  return helpers.getWordsApi();
});

app.listen(PORT, () => {
  console.log(`Server listening on the port ${PORT}`);
});

module.exports = app;