const sqlite3 = require("sqlite3").verbose();

const openDb = () => {
  var db = new sqlite3.Database('./server/sql.db');
  return db;
}

const runSql = async (sql) => {
  const db = await openDb();
  return new Promise((resolve, rejected) => {
    return db.all(sql, (err, result) => {
      if (err || !result.length) resolve(rejected);
      else resolve(result);

      closeDb(db);
    });
  }).catch((err) => {
    throw err
  });
}
const getDb = async () => {
  return await runSql("SELECT * FROM words");
};

const updateDb = async (sql) => {
  return await runSql(sql);
}

const emptyDb = async () => {
  return await runSql("DELETE FROM words");
};

const createDb = async () => {
  return await runSql("CREATE TABLE IF NOT EXISTS words (number, name, count)");
}

const populateDb = async (topWords) => {
  let dbValues = [];

  topWords.forEach((value, index) => {
    let word = value.name;
    let number = topWords.length - index;
    let count = value.count;

    dbValues.push("('"+number+"', '"+word+"', '"+count+"')");
  });

  var sql = "INSERT INTO words (number, name, count) VALUES "+dbValues.join(',')+";";

  var result = await emptyDb()
  .then(() => {
    return runSql(sql)
  });
  return result;
}

const closeDb = (db) => {
  db.close();
}

module.exports = { getDb, updateDb, emptyDb, populateDb };