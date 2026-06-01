import { execSync } from "child_process";
import { runDiscussion } from "../discussion/discussionEngine.js";

const task = process.argv.slice(2).join(" ") || "請分析 ERP 目前下一步";

const repoSummary = execSync(
  "node src/github-agent/projectAnalyze.js erp",
  { encoding: "utf8" }
);

const memorySummary = execSync(
  "node src/chat/askProject.js ERP",
  { encoding: "utf8" }
);

const question = `
任務：
${task}

ERP Repo 摘要：
${repoSummary}

ERP Memory 摘要：
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
