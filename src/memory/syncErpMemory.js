import sqlite3 from "sqlite3";
import { execSync } from "child_process";

const db = new sqlite3.Database("./data/vincent-memory.db");

const report = JSON.parse(
  execSync(
    "node src/github-agent/projectAnalyze.js erp",
    { encoding: "utf8" }
  )
);

db.run(
  `INSERT INTO memories(projectKey,category,title,content)
   VALUES(?,?,?,?)`,
  [
    "erp",
    "repo-snapshot",
    "ERP Repo Snapshot",
    JSON.stringify(report)
  ],
  function(err) {
    if (err) {
      console.error(err.message);
      process.exit(1);
    }

    console.log("ERP Snapshot Saved:", this.lastID);
    db.close();
  }
);
