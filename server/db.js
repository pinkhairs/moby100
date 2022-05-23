const sqlite3 = require("sqlite3").verbose();

const openDb = () => {
  var db = new sqlite3.Database('./server/sql.db');
  return db;
}

const runSql = async (sql) => {
  const db = openDb();
  return await new Promise((resolve, reject) => {
    return db.all(sql, (err, result) => {
      if (err) resolve(false);
      else resolve(result);

      closeDb(db);
    });
  }).catch((err) => {
    throw err
  });
}

const getDb = async () => {
  return await runSql("SELECT number, name, count FROM words ORDER BY number DESC");
};

const updateDb = async (sql) => {
  return await runSql(sql);
}

const emptyDb = async () => {
  return await runSql("DELETE FROM words");
};

const populateDb = async (topWords) => {
  let dbValues = [];

  topWords.forEach((value, index) => {
    let word = value.name;
    let number = topWords.length - index;
    let count = value.count;

    dbValues.push("('"+number+"', '"+word+"', '"+count+"')");
  });

  var sql = "INSERT INTO words (number, name, count) VALUES "+dbValues.join(',')+";";

  return await emptyDb()
  .then(() => {
    return runSql("CREATE TABLE IF NOT EXISTS words (number int, name, count int)")
    .then(() => {
      return runSql(sql).then(() => topWords);
    })
  });
}

const closeDb = (db) => {
  db.close();
}

module.exports = { getDb, updateDb, emptyDb, populateDb };