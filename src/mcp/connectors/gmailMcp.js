export const gmailMcp = {
  id: "gmail",
  name: "Gmail MCP",
  status: "skeleton",
  permissionLevel: {
    read: "allowed",
    draft: "allowed",
    send: "requires_vincent_approval"
  },
  actions: [
    "searchEmails",
    "readEmail",
    "createDraft",
    "sendAfterApproval"
  ],
  rules: [
    "可以讀取與搜尋郵件",
    "可以建立草稿",
    "不可自動寄出郵件",
    "寄出前必須取得 Vincent 確認"
  ]
};

export async function searchEmails(query) {
  return {
    status: "mock",
    action: "searchEmails",
    query,
    message: "Gmail MCP skeleton ready. Real Gmail API integration pending."
  };
}

export async function readEmail(messageId) {
  return {
    status: "mock",
    action: "readEmail",
    messageId,
    message: "Gmail read skeleton ready."
  };
}

export async function createDraft({ to, subject, body }) {
  return {
    status: "mock",
    action: "createDraft",
    to,
    subject,
    body,
    message: "Draft creation skeleton ready."
  };
}

export async function sendAfterApproval(draftId, approved = false) {
  if (!approved) {
    return {
      status: "blocked",
      action: "sendAfterApproval",
      draftId,
      message: "需要 Vincent 確認後才能寄出。"
    };
  }

  return {
    status: "mock",
    action: "sendAfterApproval",
    draftId,
    message: "Send skeleton ready."
  };
}
