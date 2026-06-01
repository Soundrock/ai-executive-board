import "dotenv/config";

export function getAiStatus() {
  return {
    chatgpt: {
      name: "ChatGPT",
      connected: !!process.env.OPENAI_API_KEY,
      role: "主控 AI / 一般回答"
    },
    gemini: {
      name: "Gemini",
      connected: !!process.env.GEMINI_API_KEY,
      role: "參與 AI"
    },
    deepseek: {
      name: "DeepSeek",
      connected: !!process.env.DEEPSEEK_API_KEY,
      role: "參與 AI / 技術分析"
    },
    github: {
      name: "GitHub Agent",
      connected: !!process.env.GITHUB_TOKEN,
      role: "Repo 讀取"
    }
  };
}
