import { askOpenAI } from "../../agents/openai.js";
import { askGemini } from "../../agents/gemini.js";
import { askDeepSeek } from "../../agents/deepseek.js";

export const AGENTS = {
  chatgpt: {
    id: "chatgpt",
    name: "ChatGPT",
    role: "首席策略長",
    ask: askOpenAI
  },
  gemini: {
    id: "gemini",
    name: "Gemini",
    role: "研究分析長",
    ask: askGemini
  },
  deepseek: {
    id: "deepseek",
    name: "DeepSeek",
    role: "中國專家 / 技術專家",
    ask: askDeepSeek
  }
};

export function getAgent(id) {
  return AGENTS[id];
}

export function getAgents(ids) {
  return ids.map(getAgent).filter(Boolean);
}
