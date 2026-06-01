import { askOpenAI } from "../../agents/openai.js";

export async function directAiAnswer(question = "", context = "") {
  const prompt = `
請直接回答使用者問題。

規則：
1. 用簡短、清楚、實用的中文回答
2. 不要寫成顧問報告
3. 不要每次都說最高CP值
4. 不要列「主要風險、Vincent決策事項、下一步」除非使用者明確要求
5. 如果是一般知識問題，直接回答
6. 如果資訊不足，只問最少必要問題
7. 如果有專案上下文，必須優先依照上下文回答

專案上下文：
${context || "無"}

使用者問題：
${question}
`;

  const result = await askOpenAI(prompt);

  if (!result.ok) {
    return "目前 AI 回答失敗，請稍後再試。";
  }

  return result.answer;
}
