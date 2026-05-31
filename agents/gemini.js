import { GoogleGenAI } from "@google/genai";

export async function askGemini(question) {
  if (!process.env.GEMINI_API_KEY) {
    return {
      agent: "Gemini",
      ok: false,
      answer: "GEMINI_API_KEY 尚未設定"
    };
  }

  try {
    const ai = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY
    });

    const response = await ai.models.generateContent({
      model: process.env.GEMINI_MODEL || "gemini-2.5-flash",
      contents: `請用繁體中文、清楚、務實、精簡回答：\n\n${question}`
    });

    return {
      agent: "Gemini",
      ok: true,
      answer: response.text || ""
    };
  } catch (error) {
    return {
      agent: "Gemini",
      ok: false,
      answer: error.message
    };
  }
}
