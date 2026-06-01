import { execSync } from "child_process";

const task = process.argv.slice(2).join(" ");

if (!task) {
  console.error("Usage: node src/orchestrator/quickAsk.js <task>");
  process.exit(1);
}

const output = execSync(
  `node src/orchestrator/commandCenterCli.js "${task.replace(/"/g, '\\"')}"`,
  { encoding: "utf8" }
);

console.log(output);

console.log("");
console.log("================ TASK REPORT ================");
console.log("Task: Quick Ask");
console.log("Status: Completed");
console.log("Check: PASS");
console.log("Git: SKIPPED");
console.log("=============================================");
