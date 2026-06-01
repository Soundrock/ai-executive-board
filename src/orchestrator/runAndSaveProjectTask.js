import { execSync } from "child_process";
import fs from "fs";
import path from "path";
import sqlite3 from "sqlite3";

const projectKey = process.argv[2];
const task = process.argv.slice(3).join(" ");

if (!projectKey || !task) {
  console.error("Usage: node src/orchestrator/runAndSaveProjectTask.js <erp|image|command> <task>");
  process.exit(1);
}

const safeTime = new Date().toISOString().replace(/[:.]/g, "-");
const outputDir = "reports/orchestrator";
fs.mkdirSync(outputDir, { recursive: true });

const outputFile = path.join(outputDir, `${projectKey}-${safeTime}.json`);

execSync(
  `node src/orchestrator/runProjectTask.js ${projectKey} "${task.replace(/"/g, '\\"')}" > "${outputFile}"`,
  { stdio: "ignore" }
);

const raw = fs.readFileSync(outputFile, "utf8");
const data = JSON.parse(raw);
const answer = data.final || raw;

await new Promise((resolve, reject) => {
  const db = new sqlite3.Database("./data/vincent-memory.db");
  db.run(
    `INSERT INTO memories(projectKey,category,title,content)
     VALUES(?,?,?,?)`,
    [projectKey, "task-result", task, raw],
    function(err) {
      db.close();
      if (err) reject(err);
      else resolve();
    }
  );
});

console.log(JSON.stringify({
  status: "completed",
  projectKey,
  task,
  outputFile,
  answer
}, null, 2));
