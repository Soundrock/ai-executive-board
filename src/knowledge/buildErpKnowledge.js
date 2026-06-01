import fs from "fs";
import sqlite3 from "sqlite3";
import { execSync } from "child_process";

const db = new sqlite3.Database("./data/vincent-memory.db");

const repoInfo = JSON.parse(
  execSync(
    "node src/github-agent/projectAnalyze.js erp",
    { encoding: "utf8" }
  )
);

const knowledge = {
  project: "ERP",
  generatedAt: new Date().toISOString(),
  currentStatus: "Active Development",
  repo: repoInfo.repo,
  defaultBranch: repoInfo.defaultBranch,
  branches: repoInfo.branches,
  latestCommits: repoInfo.latestCommits,
  roadmap: [
    "Inventory Logic",
    "Finance Workflow",
    "Import Center",
    "ERP Memory",
    "Document Workflow"
  ],
  knownIssues: [
    "Inventory reminder logic verification",
    "Import workflow standardization",
    "Finance report integration"
  ]
};

fs.writeFileSync(
  "./reports/knowledge/erp-knowledge.json",
  JSON.stringify(knowledge, null, 2)
);

db.run(
  `INSERT INTO memories(projectKey,category,title,content)
   VALUES(?,?,?,?)`,
  [
    "erp",
    "knowledge",
    "ERP Knowledge Base",
    JSON.stringify(knowledge)
  ],
  function(err) {
    if (err) {
      console.error(err.message);
      process.exit(1);
    }

    console.log("ERP Knowledge Saved:", this.lastID);
    db.close();
  }
);
