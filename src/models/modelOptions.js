export const MODEL_OPTIONS = {
  openai: [
    { id: "gpt-5.5", label: "GPT-5.5 高品質", tier: "high" },
    { id: "gpt-5", label: "GPT-5", tier: "high" },
    { id: "gpt-4.1", label: "GPT-4.1", tier: "medium" },
    { id: "gpt-4.1-mini", label: "GPT-4.1 mini 省錢", tier: "low" }
  ],
  gemini: [
    { id: "gemini-2.5-pro", label: "Gemini 2.5 Pro 高品質", tier: "high" },
    { id: "gemini-2.5-flash", label: "Gemini 2.5 Flash 省錢", tier: "low" }
  ],
  deepseek: [
    { id: "deepseek-chat", label: "DeepSeek Chat", tier: "medium" },
    { id: "deepseek-reasoner", label: "DeepSeek Reasoner", tier: "high" }
  ]
};

export function getModelOptions() {
  return MODEL_OPTIONS;
}
