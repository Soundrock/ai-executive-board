import "dotenv/config";
import readlineSync from "readline-sync";
import { askOpenAI } from "./agents/openai.js";
import { askGemini } from "./agents/gemini.js";
import { askDeepSeek } from "./agents/deepseek.js";
import { judgeAnswers } from "./judge.js";

console.log("\nVincent AI Command Center v1");
console.log("請輸入你的問題，系統會同時詢問 OpenAI、Gemini、DeepSeek。\n");

const question = readlineSync.question("請輸入問題：");

if (!question.trim()) {
  console.log("沒有輸入問題，程式結束。");
  process.exit(0);
}

console.log("\n正在詢問三個 AI，請稍候...\n");

const results = await Promise.all([
  askOpenAI(question),
  askGemini(question),
  askDeepSeek(question)
]);

console.log("三個 AI 回答完成：\n");

for (const result of results) {
  console.log("================================");
  console.log(result.agent);
  console.log(result.ok ? "狀態：成功" : "狀態：失敗");
  console.log(result.answer);
  console.log("================================\n");
}

console.log("正在產生總評...\n");

const finalJudgement = await judgeAnswers(question, results);

console.log("================================");
console.log("最終總評");
console.log("================================");
console.log(finalJudgement);
console.log("================================\n");
