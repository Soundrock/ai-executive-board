import { loadErpContext } from "./contextEngine.js";

export function answerErpQuestion(question = "") {
  const context = loadErpContext();

  if (!context) return "ERP知識庫尚未建立。";

  const q = question.toLowerCase();

  if (
    q.includes("下一步") ||
    q.includes("roadmap") ||
    q.includes("優先")
  ) {
    return `ERP目前建議優先順序：

1. 新版Excel匯入
2. 庫存排程與缺貨邏輯
3. 訂單狀態流程
4. 財務與付款管理
5. 出貨文件與PDF流程

建議先完成第1項：新版Excel匯入。

原因：
這會直接影響訂單資料品質，後面的庫存、財務、出貨都會依賴它。`;
  }

  if (
    q.includes("在做什麼") ||
    q.includes("目前功能") ||
    q.includes("做到哪") ||
    q.includes("進度") ||
    q.includes("目前狀態")
  ) {
    return `目前 ERP 的核心方向是「導覽機租賃作業管理」。

目前已知主要功能方向：

1. 團務訂單建立與管理
2. Excel匯入訂單資料
3. 庫存排程與缺貨提醒
4. 出貨與回收流程
5. 財務與付款狀態
6. 客戶資料管理
7. 簽收單與文件輸出

目前下一個最重要功能是：
新版Excel匯入與資料品質檢查。`;
  }

  return `這是 ERP 相關問題。

目前 ERP 主要在做：
訂單、Excel匯入、庫存排程、出貨回收、財務付款、文件輸出。

如果你問下一步，我建議先做新版Excel匯入。`;
}
