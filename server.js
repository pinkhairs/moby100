const express = require('express');
const path = require('path');
const app = express(),
      bodyParser = require("body-parser");
      port = 3001;

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, './client/dist')));

const fs = require("fs");
var pluralize = require('pluralize');

const getFileSegment = (file, startText, endText) => {
  var fileSplit = fs.readFileSync(file).toString().split(/\r?\n/).filter(n => n);
  let segment = [];
  let segmentStart;

  for (let [i, value] of fileSplit.entries()) {
    if (value.trim().startsWith(endText)) break;
    if (value.trim().startsWith(startText)) {
      segmentStart = i;
    }
    
    if (segmentStart && i >= segmentStart) {
      segment.push(value);
    }
  }
  return segment.filter(n => n);
}

const sortObjByValue = (obj) => {
  var keys = Object.keys(obj);
  return keys.sort((a,b) => {
    if (obj[a] > 1) {
      return obj[b]-obj[a]
    }
  });
}

const top100WordsInText = (text) => {
  let paragraphWords = [];
  let wordCounts = {};
  let stopwords = getFileSegment('./static/stop-words.txt', 'a', 'z');

  for (let [i, paragraph] of text.entries()) {
    paragraphWords = paragraph.match(/\b(\w+)\b/g);
    paragraphWords.forEach((word) => {
      word = word.trim().toLowerCase();
      if (stopwords.includes(word)) return;
      word = pluralize.singular(word);
      
      if (wordCounts[word]) {
        wordCounts[word] = wordCounts[word] + 1;
      } else {
        wordCounts[word] = 1;
      }
    })
  }
  return sortObjByValue(wordCounts).slice(0, 100);
}

app.get('/', (req,res) => {
  res.sendFile(path.join(__dirname, './client/dist/index.html'));
});

app.listen(port, () => {
    console.log(`Server listening on the port ${port}`);
});

module.exports = app;
