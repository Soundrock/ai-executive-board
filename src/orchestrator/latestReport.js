import fs from "fs";
import path from "path";

const dir = "reports/orchestrator";

if (!fs.existsSync(dir)) {
  console.error("No reports folder found.");
  process.exit(1);
}

const files = fs.readdirSync(dir)
  .filter(file => file.endsWith(".json"))
  .map(file => ({
    file,
    fullPath: path.join(dir, file),
    time: fs.statSync(path.join(dir, file)).mtimeMs
  }))
  .sort((a, b) => b.time - a.time);

if (files.length === 0) {
  console.error("No report found.");
  process.exit(1);
}

const latest = files[0];
const content = fs.readFileSync(latest.fullPath, "utf8");

console.log("Latest Report:");
console.log(latest.fullPath);
console.log("");
console.log(content);
