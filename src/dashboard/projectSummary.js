import sqlite3 from "sqlite3";

const db = new sqlite3.Database("./data/vincent-memory.db");

db.all(
  `
  SELECT
    projectKey,
    COUNT(*) as memoryCount,
    MAX(createdAt) as lastUpdate
  FROM memories
  GROUP BY projectKey
  ORDER BY projectKey
  `,
  [],
  (err, rows) => {
    if (err) {
      console.error(err.message);
      process.exit(1);
    }

    console.log(JSON.stringify(rows, null, 2));
    db.close();
  }
);
