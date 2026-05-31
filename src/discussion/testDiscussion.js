import "dotenv/config";
import { runDiscussion } from "./discussionEngine.js";

const question = process.argv.slice(2).join(" ") || "請評估 Multi-Agent AI 系統對 Vincent 的實際價值。";

const result = await runDiscussion({
  question,
  controllerId: "chatgpt",
  participantIds: ["gemini", "deepseek"],
  researchLevel: "standard"
});

console.log(JSON.stringify(result, null, 2));
