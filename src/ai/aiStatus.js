import "dotenv/config";
import fs from "fs";

function latestAuditStatus(key) {
  try {
    const file = "reports/audit/ai-reality-audit.json";
    if (!fs.existsSync(file)) return null;
    const data = JSON.parse(fs.readFileSync(file, "utf8"));
    return data[key] || null;
  } catch {
    return null;
  }
}

function buildStatus({ key, name, model, hasKey, role }) {
  const audit = latestAuditStatus(key);
  const connected = audit ? audit.status === "CONNECTED" : !!hasKey;

  return {
    name,
    model,
    connected,
    status: connected ? "CONNECTED" : "FAILED",
    role,
    responseTimeMs: audit?.responseTimeMs || null,
    error: connected ? null : audit?.error || "Not connected or not tested"
  };
}

export function getAiStatus() {
  return {
    chatgpt: buildStatus({
      key: "openai",
      name: "ChatGPT API",
      model: process.env.OPENAI_MODEL,
      hasKey: !!process.env.OPENAI_API_KEY,
      role: "主控 AI / 一般回答"
    }),
    gemini: buildStatus({
      key: "gemini",
      name: "Gemini",
      model: process.env.GEMINI_MODEL,
      hasKey: !!process.env.GEMINI_API_KEY,
      role: "參與 AI"
    }),
    deepseek: buildStatus({
      key: "deepseek",
      name: "DeepSeek",
      model: process.env.DEEPSEEK_MODEL,
      hasKey: !!process.env.DEEPSEEK_API_KEY,
      role: "參與 AI / 技術分析"
    }),
    github: {
      name: "GitHub Agent",
      model: "GitHub REST API",
      connected: !!process.env.GITHUB_TOKEN,
      status: !!process.env.GITHUB_TOKEN ? "CONNECTED" : "FAILED",
      role: "Repo 讀取",
      responseTimeMs: null,
      error: !!process.env.GITHUB_TOKEN ? null : "Missing GITHUB_TOKEN"
    }
  };
}
