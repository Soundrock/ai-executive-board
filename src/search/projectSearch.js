import sqlite3 from "sqlite3";

const keyword = process.argv.slice(2).join(" ");

if (!keyword) {
  console.error("Usage: node src/search/projectSearch.js <keyword>");
  process.exit(1);
}

const db = new sqlite3.Database("./data/vincent-memory.db");

db.all(
  `
  SELECT
    id,
    projectKey,
    category,
    title,
    createdAt
  FROM memories
  WHERE
    title LIKE ?
    OR content LIKE ?
  ORDER BY id DESC
  LIMIT 20
  `,
  [`%${keyword}%`, `%${keyword}%`],
  (err, rows) => {
    if (err) {
      console.error(err.message);
      process.exit(1);
    }

    console.log(JSON.stringify(rows, null, 2));
    db.close();
  }
);
