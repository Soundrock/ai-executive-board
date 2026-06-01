import { planTask } from "./taskOrchestrator.js";

const tasks = [
  "請分析 ERP 目前下一步",
  "請檢查 GitHub Repo 狀態",
  "請分析圖片中的文字",
  "請幫我整理 Gmail 客戶郵件",
  "請讀取 Google Drive 文件",
  "請評估今天開發優先順序"
];

for (const task of tasks) {
  console.log(JSON.stringify(planTask(task), null, 2));
}
