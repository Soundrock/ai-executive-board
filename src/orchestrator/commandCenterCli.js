import { execSync } from "child_process";

const task = process.argv.slice(2).join(" ");

if (!task) {
  console.error("Usage: node src/orchestrator/commandCenterCli.js <task>");
  process.exit(1);
}

function escapeShell(input) {
  return input.replace(/"/g, '\\"');
}

function detectProject(input) {
  const t = input.toLowerCase();

  if (t.includes("erp") || input.includes("導覽機") || input.includes("租賃")) return "erp";
  if (t.includes("image") || input.includes("圖像") || input.includes("圖片") || input.includes("魔術師")) return "image";
  if (input.includes("智策") || input.includes("決策中心") || t.includes("command")) return "command";

  return "command";
}

const projectKey = detectProject(task);
const safeTask = escapeShell(task);

execSync(
  `node src/orchestrator/runAndSaveProjectTask.js ${projectKey} "${safeTask}"`,
  { stdio: "inherit" }
);
