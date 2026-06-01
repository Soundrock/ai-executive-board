import fs from "fs";

const usageFile = "data/usage-log.json";

function readUsage() {
  try {
    if (!fs.existsSync(usageFile)) return [];
    return JSON.parse(fs.readFileSync(usageFile, "utf8"));
  } catch {
    return [];
  }
}

function writeUsage(rows) {
  fs.mkdirSync("data", { recursive: true });
  fs.writeFileSync(usageFile, JSON.stringify(rows, null, 2), "utf8");
}

function estimateCostUsd(model = "", inputChars = 0, outputChars = 0) {
  const estimatedTokens = Math.ceil((inputChars + outputChars) / 4);

  const modelRates = {
    "gpt-5.5": 0.01,
    "gpt-5": 0.008,
    "gpt-4.1": 0.004,
    "gpt-4.1-mini": 0.0004,
    "gemini-2.5-pro": 0.004,
    "gemini-2.5-flash": 0.0004,
    "deepseek-chat": 0.0003,
    "deepseek-reasoner": 0.001
  };

  const per1k = modelRates[model] ?? 0.001;
  return Number(((estimatedTokens / 1000) * per1k).toFixed(6));
}

export function recordUsage({ provider, model, input = "", output = "", status = "ok" }) {
  const rows = readUsage();

  const row = {
    time: new Date().toISOString(),
    provider,
    model,
    inputChars: String(input).length,
    outputChars: String(output).length,
    estimatedCostUsd: estimateCostUsd(model, String(input).length, String(output).length),
    status
  };

  rows.push(row);
  writeUsage(rows.slice(-1000));

  return row;
}

export function getUsageSummary() {
  const rows = readUsage();

  const totalCostUsd = rows.reduce((sum, row) => sum + (row.estimatedCostUsd || 0), 0);

  const byModel = {};
  for (const row of rows) {
    const key = row.model || "unknown";
    byModel[key] ??= { calls: 0, estimatedCostUsd: 0 };
    byModel[key].calls += 1;
    byModel[key].estimatedCostUsd += row.estimatedCostUsd || 0;
  }

  return {
    totalCalls: rows.length,
    estimatedCostUsd: Number(totalCostUsd.toFixed(6)),
    byModel,
    note: "這是依文字長度估算的成本，不是官方帳單。官方剩餘額度仍需到各平台後台查看。"
  };
}
