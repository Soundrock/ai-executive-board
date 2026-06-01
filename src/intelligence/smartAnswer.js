import { detectIntent } from "./intentRouter.js";

export function smartAnswer(question="") {

  const intent = detectIntent(question);

  if (intent === "direct-answer") {
    return {
      mode: "direct-answer",
      answer: `直接回答模式：${question}`
    };
  }

  if (intent === "decision") {
    return {
      mode: "decision",
      answer: "此問題需要決策分析，已切換至決策模式。"
    };
  }

  if (intent === "agent") {
    return {
      mode: "agent",
      answer: "此問題需要執行任務，已切換至 Agent 模式。"
    };
  }

  if (intent === "memory") {
    return {
      mode: "memory",
      answer: "正在查詢專案記憶庫。"
    };
  }

  return {
    mode: "direct-answer",
    answer: question
  };
}
