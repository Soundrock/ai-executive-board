import { getAgent, getAgents } from "../router/agentRegistry.js";
import { calculateWeights } from "../router/weightEngine.js";

function buildRoundOnePrompt(question, controllerName) {
  return `
你正在參與 Vincent AI Command Center 的多 AI 討論。

主控 AI：${controllerName}

請針對以下問題提出你的初步答案。
請務實、簡短，並以最高 CP 值為主要判斷標準。

問題：
${question}
`;
}

function buildRoundTwoPrompt(question, controllerName, roundOneResults) {
  return `
你正在參與第二輪討論。

主控 AI：${controllerName}

原始問題：
${question}

第一輪其他 AI 回答：
${roundOneResults.map(r => `
【${r.agentName}】
${r.answer}
`).join("\n")}

請你：
1. 檢查其他 AI 的盲點
2. 指出你同意或不同意的地方
3. 補充更高 CP 值的建議
4. 不要重複空話
`;
}

function buildFinalPrompt({ question, controller, participants, roundOne, roundTwo, weights, researchLevel }) {
  return `
你是主控 AI：${controller.name}
角色：主持型主控，不是答案收集器。

請根據多 AI 討論結果，做最終結論。

最高原則：
以 Vincent 的最高 CP 值決策邏輯判斷。
不是找最完美方案，而是找投入產出比最高、風險最低、最值得執行的方案。

研究等級：
${researchLevel}

AI 權重：
${JSON.stringify(weights, null, 2)}

原始問題：
${question}

第一輪回答：
${roundOne.map(r => `
【${r.agentName}】
${r.answer}
`).join("\n")}

第二輪回答：
${roundTwo.map(r => `
【${r.agentName}】
${r.answer}
`).join("\n")}

請輸出：
1. 最終建議
2. 為什麼這是最高 CP 值方案
3. 各 AI 觀點比較
4. 主要風險
5. 需要 Vincent 決策的事項
6. 下一步
`;
}

export async function runDiscussion({
  question,
  controllerId = "chatgpt",
  participantIds = ["gemini", "deepseek"],
  researchLevel = "standard"
}) {
  const controller = getAgent(controllerId);
  const participants = getAgents(participantIds).filter(a => a.id !== controllerId);
  const allAgentIds = [controllerId, ...participants.map(a => a.id)];
  const weights = calculateWeights(allAgentIds);

  if (!controller) throw new Error(`Unknown controller: ${controllerId}`);
  if (participants.length === 0) throw new Error("至少需要一個參與 AI");

  const roundOne = [];
  for (const agent of participants) {
    const response = await agent.ask(buildRoundOnePrompt(question, controller.name));
    roundOne.push({
      agentId: agent.id,
      agentName: agent.name,
      ok: response.ok,
      answer: response.answer
    });
  }

  const roundTwo = [];
  for (const agent of participants) {
    const response = await agent.ask(buildRoundTwoPrompt(question, controller.name, roundOne));
    roundTwo.push({
      agentId: agent.id,
      agentName: agent.name,
      ok: response.ok,
      answer: response.answer
    });
  }

  const finalPrompt = buildFinalPrompt({
    question,
    controller,
    participants,
    roundOne,
    roundTwo,
    weights,
    researchLevel
  });

  const finalResponse = await controller.ask(finalPrompt);

  return {
    controller: controller.name,
    participants: participants.map(a => a.name),
    researchLevel,
    weights,
    roundOne,
    roundTwo,
    final: finalResponse.answer
  };
}
