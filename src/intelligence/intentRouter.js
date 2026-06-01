export function detectIntent(question = "") {

  const q = question.toLowerCase();

  if (
    q.includes("天氣") ||
    q.includes("股票") ||
    q.includes("股市") ||
    q.includes("健康") ||
    q.includes("旅遊") ||
    q.includes("去哪") ||
    q.includes("餐廳") ||
    q.includes("車")
  ) {
    return "direct-answer";
  }

  if (
    q.includes("下一步") ||
    q.includes("roadmap") ||
    q.includes("規劃") ||
    q.includes("策略") ||
    q.includes("比較")
  ) {
    return "decision";
  }

  if (
    q.includes("建立") ||
    q.includes("開發") ||
    q.includes("修改") ||
    q.includes("產生圖片") ||
    q.includes("生成圖片") ||
    q.includes("寫程式")
  ) {
    return "agent";
  }

  if (
    q.includes("進度") ||
    q.includes("做到哪") ||
    q.includes("目前狀態")
  ) {
    return "memory";
  }

  return "direct-answer";
}
