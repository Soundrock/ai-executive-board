import sqlite3 from "sqlite3";

const projectKey = process.argv[2];

const db = new sqlite3.Database("./data/vincent-memory.db");

db.all(
  `SELECT id,projectKey,category,title,createdAt
   FROM memories
   WHERE projectKey=?
   ORDER BY id DESC`,
  [projectKey],
  (err, rows) => {
    if (err) {
      console.error(err.message);
      process.exit(1);
    }

    console.log(JSON.stringify(rows,null,2));
    db.close();
  }
);
