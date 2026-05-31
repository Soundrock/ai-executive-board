export const erpMcp = {
  id: "erp",
  name: "ERP MCP",
  status: "skeleton",
  repoKey: "erp",
  permissionLevel: {
    read: "allowed",
    analyze: "allowed",
    report: "allowed",
    modify: "requires_vincent_approval"
  },
  actions: [
    "readRepoStructure",
    "analyzeOrders",
    "analyzeInventory",
    "analyzeFinance",
    "generateErpReport",
    "modifyAfterApproval"
  ],
  rules: [
    "可以讀取 ERP Repo 架構",
    "可以分析訂單、庫存、財務與報表邏輯",
    "可以提出修改建議",
    "不可直接修改 ERP",
    "任何 ERP 修改都必須 Vincent 確認"
  ]
};

export async function readRepoStructure() {
  return {
    status: "mock",
    action: "readRepoStructure",
    repoKey: "erp",
    message: "ERP MCP skeleton ready. GitHub Agent can already read ERP repo."
  };
}

export async function analyzeOrders() {
  return {
    status: "mock",
    action: "analyzeOrders",
    message: "ERP order analysis skeleton ready."
  };
}

export async function analyzeInventory() {
  return {
    status: "mock",
    action: "analyzeInventory",
    message: "ERP inventory analysis skeleton ready."
  };
}

export async function analyzeFinance() {
  return {
    status: "mock",
    action: "analyzeFinance",
    message: "ERP finance analysis skeleton ready."
  };
}

export async function generateErpReport() {
  return {
    status: "mock",
    action: "generateErpReport",
    message: "ERP report skeleton ready."
  };
}

export async function modifyAfterApproval(approved = false) {
  if (!approved) {
    return {
      status: "blocked",
      action: "modifyAfterApproval",
      message: "需要 Vincent 確認後才能修改 ERP。"
    };
  }

  return {
    status: "mock",
    action: "modifyAfterApproval",
    message: "ERP modify skeleton ready."
  };
}
