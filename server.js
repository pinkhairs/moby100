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
app.use(express.static('src'));

app.get('/', (req, res) => {
  const stopWordsFile = fs.readFileSync("./static/stop-words.txt").toString().split(/\r?\n/).filter(n => n);
  const book = fs.readFileSync("./static/mobydick.txt").toString().split(/\r?\n/).filter(n => n);
  const firstSentence = "Call me Ishmael.";
  const endOfBook = "End of Project Gutenberg’s Moby Dick; or The Whale, by Herman Melville";

  let stopwords = [];
  let firstStopWord;
  let firstBookLine;
  let paragraphWords = [];
  let wordCounts = {};

  const getWordUseCount = (array, search) => {
    var count = array.filter((v, i) => i === search).length;
    return count;
  }

  const sortWords = (obj) => {
    var keys = Object.keys(obj);
    return keys.sort((a,b) => {
      if (obj[a] > 1) {
        return obj[b]-obj[a]
      }
    });
  }

  for (let [i, word] of stopWordsFile.entries()) {
      if (word == 'a') {
      firstStopWord = i;
    }
    
    if (firstStopWord && i >= firstStopWord) {
      stopwords.push(word);
    }
  }

  stopwords = stopwords.filter(n => n);
  let ok;

  for (let [i, paragraph] of book.entries()) {
    if (paragraph.trim().includes(endOfBook)) break;

    if (paragraph.trim().startsWith(firstSentence)) {
      firstBookLine = i;
    }
    
    if (firstBookLine && i >= firstBookLine) {
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
  }

  let rows = '';

  top100 = sortWords(wordCounts).slice(0, 100);
  let i = 0;

  top100.forEach((word) => {
    ++i;
    rows = rows + '<tr><td>'+i+'</td><td>'+word+'</td><td>'+wordCounts[word]+'</td></tr>';
  })

  res.send('<table>'+rows+'</table>');
});

app.listen(port, () => {
  console.log(`Project listening on port ${port}`);
})

module.exports = app;
