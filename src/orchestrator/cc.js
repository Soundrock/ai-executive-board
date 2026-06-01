import { execSync } from "child_process";

const command = process.argv[2];
const task = process.argv.slice(3).join(" ");

if (!command) {
  console.log("Usage:");
  console.log("node src/orchestrator/cc.js ask <task>");
  console.log("node src/orchestrator/cc.js latest");
  process.exit(0);
}

if (command === "ask") {
  if (!task) {
    console.error("Missing task.");
    process.exit(1);
  }

  execSync(
    `node src/orchestrator/quickAskNoGit.js "${task.replace(/"/g, '\\"')}"`,
    { stdio: "inherit" }
  );
  process.exit(0);
}

if (command === "latest") {
  execSync("node src/orchestrator/latestReport.js", { stdio: "inherit" });
  process.exit(0);
}

console.error(`Unknown command: ${command}`);
process.exit(1);
