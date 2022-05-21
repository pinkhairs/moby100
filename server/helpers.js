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
      word = word.trim().toLowerCase();
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

module.exports = { getFileSegment, topWordsInText };