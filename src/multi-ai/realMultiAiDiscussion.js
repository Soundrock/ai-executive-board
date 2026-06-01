import "dotenv/config";
import { askOpenAI } from "../../agents/openai.js";
import { askGemini } from "../../agents/gemini.js";
import { askDeepSeek } from "../../agents/deepseek.js";

function cleanText(value) {
  if (!value) return "";
  if (typeof value === "string") return value.trim();
  if (value.answer) return String(value.answer).trim();
  if (value.text) return String(value.text).trim();
  if (value.content) return String(value.content).trim();
  return JSON.stringify(value, null, 2);
}

async function safeAsk(label, fn, prompt) {
  const startedAt = Date.now();

  try {
    const result = await fn(prompt);
    const answer = cleanText(result);

    return {
      ai: label,
      ok: true,
      durationMs: Date.now() - startedAt,
      answer: answer || "沒有取得有效回答。"
    };
  } catch (error) {
    return {
      ai: label,
      ok: false,
      durationMs: Date.now() - startedAt,
      answer: "",
      error: error.message
    };
  }
}

export async function runRealMultiAiDiscussion(question, context = "") {
  const basePrompt = `
你是 Vincent AI Command Center 的參與 AI。

請直接回答使用者問題。
要求：
1. 用繁體中文
2. 回答要清楚、實用、不要空泛
3. 不要寫成制式顧問報告
4. 不要每次都列「風險、決策事項、下一步」
5. 若需要研究深度，請直接給重點與可執行結論
6. 若有上下文，請優先依上下文回答

上下文：
${context || "無"}

使用者問題：
${question}
`;

  const responses = await Promise.all([
    safeAsk("ChatGPT", askOpenAI, basePrompt),
    safeAsk("DeepSeek", askDeepSeek, basePrompt)
  ]);

  const geminiSkipped = {
    ai: "Gemini",
    ok: false,
    durationMs: 0,
    answer: "",
    error: "Skipped because Gemini quota is currently exceeded"
  };

  responses.splice(1, 0, geminiSkipped);

  const controllerPrompt = `
你是 Vincent AI Command Center 的主控 AI。

請根據三個 AI 的回答，整理成 Vincent 看得懂、能直接使用的最終答案。

規則：
1. 不要寫長篇研究報告，除非使用者明確要求
2. 不要解釋什麼是 CP 值
3. 不要列無意義標題
4. 直接給結論、重點、建議做法
5. 若三個 AI 答案品質差，請修正後給出更好的答案
6. 若問題是一般問答，直接回答
7. 若問題需要比較，才列比較
8. 若問題需要引用資料但目前沒有網路來源，請明確說資料需要查證

使用者問題：
${question}

ChatGPT 回答：
${responses.find(r => r.ai === "ChatGPT")?.answer || responses.find(r => r.ai === "ChatGPT")?.error}

Gemini 回答：
${responses.find(r => r.ai === "Gemini")?.answer || responses.find(r => r.ai === "Gemini")?.error}

DeepSeek 回答：
${responses.find(r => r.ai === "DeepSeek")?.answer || responses.find(r => r.ai === "DeepSeek")?.error}
`;

  const finalResult = await safeAsk("Controller", askOpenAI, controllerPrompt);

  const activeAis = responses.filter(r => r.ok).map(r => r.ai);
  const inactiveAis = responses.filter(r => !r.ok).map(r => ({
    ai: r.ai,
    error: r.error || "Failed"
  }));

  return {
    ok: true,
    mode: "real-multi-ai",
    source: activeAis.length ? activeAis.join(" + ") : "No AI connected",
    inactiveAis,
    question,
    aiStatus: responses.map(r => ({
      ai: r.ai,
      ok: r.ok,
      durationMs: r.durationMs,
      error: r.error || null
    })),
    responses,
    finalAnswer: finalResult.answer || "主控 AI 未能產生最後結論。"
  };
}
