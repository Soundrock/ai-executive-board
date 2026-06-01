import { planTask } from "./taskOrchestrator.js";

const task = process.argv.slice(2).join(" ");

if (!task) {
  console.error("Usage: node src/orchestrator/runTask.js <task>");
  process.exit(1);
}

const plan = planTask(task);

console.log(JSON.stringify({
  task,
  plan,
  status: "planned",
  nextAction:
    plan.executionMode === "tool-assisted"
      ? "Use MCP connector first, then AI discussion."
      : "Start multi-agent discussion first."
}, null, 2));
