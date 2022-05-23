const db = require('./db');

const getFileInLines = (file) => {
  return require('fs').readFileSync(file).toString().split(/\r?\n/).filter(n => n);
}

const markEnds = (fileInLines, startText, endText) => {
  var ends = { beginning: 0, finale: 0 };
  var startSet = false;

  for (let [i, value] of fileInLines.entries()) {
    if (value.trim().startsWith(startText)) {
      if (!startSet) {
        ends.beginning = i;
        startSet = true;
      }
    }
    if (value.trim().startsWith(endText)) {
      ends.finale = i;
    }
  }

  return ends;
};

const getFileSegment = (file, startText, endText) => {
  var fileSplit = getFileInLines(file);
  let bookEnds = markEnds(fileSplit, startText, endText);
  let lines = [];

  for (let [i, value] of fileSplit.entries()) {
    if (i >= bookEnds.beginning && i <= bookEnds.finale) {
      lines.push(value);
    }
  }

  return lines.filter(n => n);
}

const topWordsInText = (text, numberOfWords) => {
  var sortObjArrBy = (obj, sorter) => {
    let smallToLarge = obj.sort((a, b) => (a[sorter] > b[sorter]) ? 1 : -1);
    let largeToSmall = smallToLarge.reverse();
    return largeToSmall;
  };
  
  let paragraphWords = [];
  let wordCounts = []
  let stopwords = getFileSegment('./static/stop-words.txt', 'a', 'z');
  let wordAccountedFor = false;

  for (let [i, paragraph] of text.entries()) {
    paragraphWords = paragraph.match(/\b(\w+)\b/g);

    for (let i = 0; i < paragraphWords.length; i++)  {
      let word = paragraphWords[i];
      word = word.toLowerCase();
      if (stopwords.includes(word)) continue;

      word = require('pluralize').singular(word)
      wordAccountedFor =wordCounts.find(entry => entry.name === word);

      if (!wordAccountedFor) {
        wordCounts.push({ name: word, count: 1 });
      } else {
        let entry = wordCounts.indexOf(wordAccountedFor);
        wordCounts[entry] = {...wordCounts[entry], count: wordCounts[entry].count + 1};
      }
    }
  }

  var topWords = sortObjArrBy(wordCounts, 'count').slice(0, numberOfWords);
  return topWords;
};

const getMobyDickTop100Words = () => {
  const mobyDick = getFileSegment('./static/mobydick.txt', 'Call me Ishmael', 'End of Project Gutenberg’s Moby Dick');
  const numberOfWords = 100;
  const topWords = topWordsInText(mobyDick, numberOfWords);
  return topWords;
};

const getWordsApi = () => {
  return db.getDb().then((result) => {
    if (result) {
      return result;
    } else {
      const topWords = getMobyDickTop100Words();
      return db.populateDb(topWords).then(topWords => topWords);
    }
  });
}

module.exports = { getFileInLines, markEnds, getFileSegment, topWordsInText, getMobyDickTop100Words, getWordsApi }