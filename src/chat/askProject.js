import sqlite3 from "sqlite3";

const question = process.argv.slice(2).join(" ");

if (!question) {
  console.error("Usage: node src/chat/askProject.js <question>");
  process.exit(1);
}

const db = new sqlite3.Database("./data/vincent-memory.db");

db.all(
  `
  SELECT
    projectKey,
    category,
    title,
    content,
    createdAt
  FROM memories
  ORDER BY id DESC
  LIMIT 50
  `,
  [],
  (err, rows) => {
    if (err) {
      console.error(err.message);
      process.exit(1);
    }

    const result = {
      question,
      memoryCount: rows.length,
      projects: [...new Set(rows.map(r => r.projectKey))],
      topMatches: rows.slice(0, 10).map(r => ({
        projectKey: r.projectKey,
        category: r.category,
        title: r.title,
        createdAt: r.createdAt
      }))
    };

    console.log(JSON.stringify(result, null, 2));
    db.close();
  }
);
