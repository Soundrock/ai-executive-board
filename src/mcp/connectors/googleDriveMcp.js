export const googleDriveMcp = {
  id: "googleDrive",
  name: "Google Drive MCP",
  status: "skeleton",
  permissionLevel: {
    search: "allowed",
    read: "allowed",
    export: "requires_vincent_approval",
    delete: "blocked"
  },
  actions: [
    "searchFiles",
    "readFile",
    "summarizeFile",
    "exportFileAfterApproval"
  ],
  rules: [
    "可以搜尋 Google Drive 檔案",
    "可以讀取 Vincent 授權的檔案",
    "匯出或轉存前需 Vincent 確認",
    "不可刪除檔案"
  ]
};

export async function searchFiles(query) {
  return {
    status: "mock",
    action: "searchFiles",
    query,
    message: "Google Drive MCP skeleton ready. Real Google Drive API integration pending."
  };
}

export async function readFile(fileId) {
  return {
    status: "mock",
    action: "readFile",
    fileId,
    message: "Google Drive read skeleton ready."
  };
}

export async function summarizeFile(fileId) {
  return {
    status: "mock",
    action: "summarizeFile",
    fileId,
    message: "Google Drive summarize skeleton ready."
  };
}

export async function exportFileAfterApproval(fileId, approved = false) {
  if (!approved) {
    return {
      status: "blocked",
      action: "exportFileAfterApproval",
      fileId,
      message: "需要 Vincent 確認後才能匯出或轉存。"
    };
  }

  return {
    status: "mock",
    action: "exportFileAfterApproval",
    fileId,
    message: "Google Drive export skeleton ready."
  };
}
