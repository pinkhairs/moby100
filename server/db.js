const sqlite3 = require("sqlite3").verbose();

const openDb = () => {
  var db = new sqlite3.Database('./server/sql.db');
  db.run("CREATE TABLE IF NOT EXISTS words (number, name, count)");
  return db;
}

const getDb = () => {
  var db = openDb();

  return new Promise((resolve) => {
    return db.all("SELECT * FROM words", (err, result) => {
      if (err || !result.length) resolve(false);
      else resolve(result);

      closeDb(db);
    });
  });
};

const updateDb = (command) => {
  var db = openDb();
  
  return new Promise((resolve) => {
    return db.run(command, (err, result) => {
      resolve(true);
      closeDb(db);
    });
  });
}

const emptyDb = () => {
  var db = openDb();

  return new Promise((resolve) => {
    return db.run("DELETE FROM words", () => {
      resolve(true);
      closeDb(db);
    });
  });
};

const populateDb = (topWords) => {
  let dbValues = [];

  topWords.forEach((value, index) => {
    let word = value.name;
    let number = topWords.length - index;
    let count = value.count;

    dbValues.push("('"+number+"', '"+word+"', '"+count+"')");
  });
  
  return new Promise((resolve) => {
    return emptyDb()
    .then(() => {
      updateDb("INSERT INTO words (number, name, count) VALUES "+dbValues+";")
      .then(() => {
        resolve(true);
      });
    });
  });
}

const closeDb = (db) => {
  db.close();
}

module.exports = { getDb, updateDb, emptyDb, populateDb };