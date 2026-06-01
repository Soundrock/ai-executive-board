import sqlite3 from "sqlite3";

const [projectKey, category, title, content] = process.argv.slice(2);

const db = new sqlite3.Database("./data/vincent-memory.db");

db.run(
  `INSERT INTO memories(projectKey,category,title,content)
   VALUES(?,?,?,?)`,
  [projectKey, category, title, content],
  function(err) {
    if (err) {
      console.error(err.message);
      process.exit(1);
    }

    console.log("Memory added:", this.lastID);
    db.close();
  }
);
