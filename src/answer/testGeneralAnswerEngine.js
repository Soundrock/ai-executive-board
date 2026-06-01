import { answerGeneralQuestion } from "./generalAnswerEngine.js";

const tests = [
  "今天天氣如何？",
  "台北的天氣如何？",
  "你知道我在哪裡嗎？",
  "聯發科股票如何？",
  "新北附近去哪裡走走？"
];

for (const test of tests) {
  console.log("QUESTION:", test);
  console.log(await answerGeneralQuestion(test));
  console.log("-----");
}
