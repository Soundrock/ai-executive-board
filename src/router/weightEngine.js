export function calculateWeights(agentIds) {
  const uniqueIds = [...new Set(agentIds)];
  const hasChatGPT = uniqueIds.includes("chatgpt");

  if (!hasChatGPT) {
    const weight = 100 / uniqueIds.length;
    return Object.fromEntries(uniqueIds.map(id => [id, weight]));
  }

  if (uniqueIds.length === 2) {
    const other = uniqueIds.find(id => id !== "chatgpt");
    return {
      chatgpt: 60,
      [other]: 40
    };
  }

  const remaining = uniqueIds.filter(id => id !== "chatgpt");
  const otherWeight = 60 / remaining.length;

  return {
    chatgpt: 40,
    ...Object.fromEntries(remaining.map(id => [id, otherWeight]))
  };
}
