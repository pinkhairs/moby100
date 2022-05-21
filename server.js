var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var port = 3001;

const fs = require("fs");
var pluralize = require('pluralize');

const { endianness } = require('os');
const { resolveSoa, resolveNaptr } = require('dns');

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

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

app.get('/words', (req, res) => {
  const mobyDick = getFileSegment('./static/mobydick.txt', 'Call me Ishmael.', 'End of Project Gutenberg’s Moby Dick');
  const top100WordsInMobyDick = top100WordsInText(mobyDick);
  res.send(top100WordsInMobyDick);
});

app.listen(port, () => {
  console.log(`Project listening on port ${port}`);
})

module.exports = app;
