import { routeTask } from "./taskRouter.js";

const tests = [
  "ERP inventory issue",
  "GitHub repo status",
  "Image OCR",
  "Gmail customer email",
  "Google Drive document",
  "General question"
];

for (const test of tests) {
  console.log(`${test} => ${routeTask(test)}`);
}
