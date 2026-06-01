import { detectIntent } from "./intentRouter.js";

const tests = [
  "今天天氣如何",
  "ERP下一步做什麼",
  "幫我開發ERP",
  "ERP目前進度"
];

for (const t of tests) {
  console.log(t,"=>",detectIntent(t));
}
