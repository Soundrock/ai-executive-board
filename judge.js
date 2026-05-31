import OpenAI from "openai";

export async function judgeAnswers(question, answers) {
  if (!process.env.OPENAI_API_KEY) {
    return "OPENAI_API_KEY 尚未設定，無法進行總評。";
  }

  const client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
  });

  const content = `
你是 Vincent 的 AI 總評審。請根據問題與三個 AI 的回答，做出務實、清楚、簡短的總結。

使用者問題：
${question}

AI 回答：
${answers.map((item) => `
【${item.agent}】
狀態：${item.ok ? "成功" : "失敗"}
回答：
${item.answer}
`).join("\n")}

請輸出：
1. 最佳答案
2. 各AI重點比較
3. 主要風險
4. 建議執行方式
5. 信心分數 0到100
`;

  try {
    const response = await client.chat.completions.create({
      model: process.env.OPENAI_MODEL || "gpt-4.1-mini",
      messages: [
        {
          role: "system",
          content: "請用繁體中文、專業、務實、精簡回答。"
        },
        {
          role: "user",
          content
        }
      ]
    });

    return response.choices?.[0]?.message?.content || "";
  } catch (error) {
    return `總評失敗：${error.message}`;
  }
}
