import "dotenv/config";
import fs from "fs";
import { runRealMultiAiDiscussion } from "./realMultiAiDiscussion.js";

const question = process.argv.slice(2).join(" ") || "印度首都缺水以及水資源品質不好有什麼改善對策？";

const result = await runRealMultiAiDiscussion(question);

fs.mkdirSync("reports/multi-ai", { recursive: true });
fs.writeFileSync("reports/multi-ai/v7-test.json", JSON.stringify(result, null, 2), "utf8");

console.log("AI STATUS");
console.log(JSON.stringify(result.aiStatus, null, 2));
console.log("");
console.log("FINAL ANSWER");
console.log(result.finalAnswer);
