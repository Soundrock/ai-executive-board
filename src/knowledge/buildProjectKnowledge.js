import fs from "fs";
import sqlite3 from "sqlite3";
import { execSync } from "child_process";

const projectKey = process.argv[2];

const PROJECTS = {
  erp: "ERP",
  image: "AI Image Magician",
  command: "Vincent AI Command Center"
};

if (!PROJECTS[projectKey]) {
  console.error("Unknown project");
  process.exit(1);
}

const db = new sqlite3.Database("./data/vincent-memory.db");

const report = JSON.parse(
  execSync(
    `node src/github-agent/projectAnalyze.js ${projectKey}`,
    { encoding: "utf8" }
  )
);

const knowledge = {
  projectKey,
  projectName: PROJECTS[projectKey],
  generatedAt: new Date().toISOString(),
  repo: report.repo,
  branches: report.branches,
  latestCommits: report.latestCommits,
  fileCount: report.fileCount
};

const outputFile = `./reports/knowledge/${projectKey}-knowledge.json`;

fs.writeFileSync(
  outputFile,
  JSON.stringify(knowledge, null, 2)
);

db.run(
  `INSERT INTO memories(projectKey,category,title,content)
   VALUES(?,?,?,?)`,
  [
    projectKey,
    "knowledge",
    `${PROJECTS[projectKey]} Knowledge`,
    JSON.stringify(knowledge)
  ],
  function(err) {
    if (err) {
      console.error(err.message);
      process.exit(1);
    }

    console.log(`${projectKey} knowledge saved:`, this.lastID);
    db.close();
  }
);
