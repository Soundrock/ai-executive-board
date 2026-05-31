import OpenAI from "openai";

export async function askOpenAI(question) {
  if (!process.env.OPENAI_API_KEY) {
    return {
      agent: "OpenAI",
      ok: false,
      answer: "OPENAI_API_KEY 尚未設定"
    };
  }

  try {
    const client = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    });

    const response = await client.chat.completions.create({
      model: process.env.OPENAI_MODEL || "gpt-4.1-mini",
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
      agent: "OpenAI",
      ok: true,
      answer: response.choices?.[0]?.message?.content || ""
    };
  } catch (error) {
    return {
      agent: "OpenAI",
      ok: false,
      answer: error.message
    };
  }
}
