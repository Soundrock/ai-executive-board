import { execSync } from "child_process";
import { runDiscussion } from "../discussion/discussionEngine.js";

const projectKey = process.argv[2];
const task = process.argv.slice(3).join(" ");

if (!projectKey || !task) {
  console.error("Usage: node src/orchestrator/runProjectTask.js <erp|image|command> <task>");
  process.exit(1);
}

const repoSummary = execSync(
  `node src/github-agent/projectAnalyze.js ${projectKey}`,
  { encoding: "utf8" }
);

const memorySummary = execSync(
  `node src/chat/askProject.js ${projectKey}`,
  { encoding: "utf8" }
);

const question = `
專案代號：
${projectKey}

任務：
${task}

Repo 摘要：
${repoSummary}

Memory 摘要：
${memorySummary}

請用最高 CP 值角度分析，給出下一步建議。
`;

const result = await runDiscussion({
  question,
  controllerId: "chatgpt",
  participantIds: ["gemini", "deepseek"],
  researchLevel: "standard"
});

console.log(JSON.stringify(result, null, 2));
