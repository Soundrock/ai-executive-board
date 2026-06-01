import { execSync } from "child_process";

const task = process.argv.slice(2).join(" ");

if (!task) {
  console.error("Usage: node src/orchestrator/commandCenterCli.js <task>");
  process.exit(1);
}

function detectProject(input) {
  const t = input.toLowerCase();

  if (t.includes("erp")) return "erp";
  if (t.includes("圖像") || t.includes("image") || t.includes("魔術師")) return "image";
  if (t.includes("智策") || t.includes("command")) return "command";

  return "command";
}

const projectKey = detectProject(task);

execSync(
  `node src/orchestrator/runAndSaveProjectTask.js ${projectKey} "${task}"`,
  { stdio: "inherit" }
);
