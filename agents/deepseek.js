import OpenAI from "openai";

export async function askDeepSeek(question) {
  if (!process.env.DEEPSEEK_API_KEY) {
    return {
      agent: "DeepSeek",
      ok: false,
      answer: "DEEPSEEK_API_KEY 尚未設定"
    };
  }

  try {
    const client = new OpenAI({
      apiKey: process.env.DEEPSEEK_API_KEY,
      baseURL: "https://api.deepseek.com"
    });

    const response = await client.chat.completions.create({
      model: process.env.DEEPSEEK_MODEL || "deepseek-chat",
      messages: [
        {
          role: "system",
          content: "你是專業AI顧問，請用繁體中文、清楚、務實、精簡回答。"
        },
        {
          role: "user",
          content: question
        }
      ]
    });

    return {
      agent: "DeepSeek",
      ok: true,
      answer: response.choices?.[0]?.message?.content || ""
    };
  } catch (error) {
    return {
      agent: "DeepSeek",
      ok: false,
      answer: error.message
    };
  }
}
