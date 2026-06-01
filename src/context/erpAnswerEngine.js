import { loadErpContext } from "./contextEngine.js";

export function answerErpQuestion(question="") {

  const context = loadErpContext();

  if (!context) {
    return "ERP知識庫尚未建立。";
  }

  const q = question.toLowerCase();

  if (
    q.includes("下一步") ||
    q.includes("roadmap") ||
    q.includes("優先")
  ) {

    return `
ERP目前建議優先順序：

1. 新版Excel匯入
2. 庫存排程與缺貨邏輯
3. 訂單狀態流程
4. 財務與付款管理
5. 出貨文件與PDF流程

原因：

這是目前ERP既定Roadmap，
也是影響營運最大的項目。

建議先完成第1項。
`;
  }

  return "ERP問題已收到，但尚未建立對應回答模板。";
}
