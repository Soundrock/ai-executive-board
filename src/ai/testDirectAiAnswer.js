import "dotenv/config";
import { directAiAnswer } from "./directAiAnswer.js";

console.log(await directAiAnswer("Salesforce的App是做什麼功能的？"));
