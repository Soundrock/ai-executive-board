import { execSync } from "child_process";

const task = process.argv.slice(2).join(" ");

if (!task) {
  console.error("Usage: node src/orchestrator/quickAskNoGit.js <task>");
  process.exit(1);
}

execSync(
  `node src/orchestrator/commandCenterCli.js "${task.replace(/"/g, '\\"')}"`,
  { stdio: "inherit" }
);

console.log("");
console.log("================ TASK REPORT ================");
console.log("Task: Quick Ask No Git");
console.log("Status: Completed");
console.log("Check: PASS");
console.log("Git: SKIPPED");
console.log("=============================================");
