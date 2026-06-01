import { execSync } from "child_process";
import fs from "fs";
import path from "path";

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
  `node src/orchestrator/runProjectTask.js ${projectKey} "${task}" > "${outputFile}"`,
  { stdio: "inherit" }
);

execSync(
  `node src/orchestrator/saveTaskResult.js ${projectKey} "${outputFile}" "${task}"`,
  { stdio: "inherit" }
);

console.log(JSON.stringify({
  status: "completed",
  projectKey,
  task,
  outputFile
}, null, 2));
