import fs from "fs";
import sqlite3 from "sqlite3";

const projectKey = process.argv[2];
const reportFile = process.argv[3];
const title = process.argv.slice(4).join(" ") || "Task Result";

if (!projectKey || !reportFile) {
  console.error("Usage: node src/orchestrator/saveTaskResult.js <projectKey> <reportFile> <title>");
  process.exit(1);
}

if (!fs.existsSync(reportFile)) {
  console.error(`Report file not found: ${reportFile}`);
  process.exit(1);
}

const content = fs.readFileSync(reportFile, "utf8");
const db = new sqlite3.Database("./data/vincent-memory.db");

db.run(
  `INSERT INTO memories(projectKey,category,title,content)
   VALUES(?,?,?,?)`,
  [projectKey, "task-result", title, content],
  function(err) {
    if (err) {
      console.error(err.message);
      process.exit(1);
    }

    console.log("Task result saved:", this.lastID);
    db.close();
  }
);
