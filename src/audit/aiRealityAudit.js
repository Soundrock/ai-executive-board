import "dotenv/config";
import { askOpenAI } from "../../agents/openai.js";
import { askGemini } from "../../agents/gemini.js";
import { askDeepSeek } from "../../agents/deepseek.js";
import fs from "fs";

function cleanPreview(result) {
  return JSON.stringify(result).slice(0, 500);
}

async function testAI(name, model, fn) {
  const started = Date.now();

  try {
    const result = await fn(`
請只回答以下內容：

AI=${name}
MODEL_CHECK=PASS

不要解釋。
`);

    const apiOk = result?.ok !== false;
    const answer = result?.answer || "";
    const passed = apiOk && String(answer).includes("MODEL_CHECK=PASS");

    return {
      ai: name,
      model,
      status: passed ? "CONNECTED" : "FAILED",
      responseTimeMs: Date.now() - started,
      preview: cleanPreview(result),
      error: passed ? null : String(answer || "API returned failed result")
    };

  } catch (error) {
    return {
      ai: name,
      model,
      status: "FAILED",
      responseTimeMs: Date.now() - started,
      preview: "",
      error: error.message
    };
  }
}

const report = {
  timestamp: new Date().toISOString(),
  openai: await testAI("OpenAI", process.env.OPENAI_MODEL, askOpenAI),
  gemini: await testAI("Gemini", process.env.GEMINI_MODEL, askGemini),
  deepseek: await testAI("DeepSeek", process.env.DEEPSEEK_MODEL, askDeepSeek)
};

fs.mkdirSync("reports/audit", { recursive: true });
fs.writeFileSync("reports/audit/ai-reality-audit.json", JSON.stringify(report, null, 2));

console.log(JSON.stringify(report, null, 2));
