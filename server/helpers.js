const getFileSegment = (file, startText, endText) => {
  var fileSplit = require('fs').readFileSync(file).toString().split(/\r?\n/).filter(n => n);
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

const top100WordsInText = (text) => {
  var sortObjByValue = (obj) => {
    var keys = Object.keys(obj);
    return keys.sort((a,b) => {
      if (obj[a] > 1) {
        return obj[b]-obj[a]
      }
    });
  };
  
  let paragraphWords = [];
  let wordCounts = {};
  let stopwords = getFileSegment('./static/stop-words.txt', 'a', 'z');

  for (let [i, paragraph] of text.entries()) {
    paragraphWords = paragraph.match(/\b(\w+)\b/g);
    paragraphWords.forEach((word) => {
      word = word.trim().toLowerCase();
      if (stopwords.includes(word)) return;
      word = require('pluralize').singular(word);
      
      if (wordCounts[word]) {
        wordCounts[word] = wordCounts[word] + 1;
      } else {
        wordCounts[word] = 1;
      }
    })
  }
  return sortObjByValue(wordCounts).slice(0, 100);
};

module.exports = { getFileSegment, top100WordsInText };