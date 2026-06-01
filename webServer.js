import "dotenv/config";
import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { execFile } from "child_process";
import fs from "fs";
import { detectIntent } from "./src/intelligence/intentRouter.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json({ limit: "20mb" }));
app.use(express.static(path.join(__dirname, "public")));


function extractLastJsonObject(output) {
  const text = String(output || "").trim();
  const start = text.lastIndexOf("{");
  if (start === -1) throw new Error("No JSON object found in task output");
  return JSON.parse(text.slice(start));
}

function detectProject(input) {
  const t = String(input || "").toLowerCase();
  if (t.includes("erp") || input.includes("導覽機") || input.includes("租賃")) return "erp";
  if (t.includes("image") || input.includes("圖像") || input.includes("圖片") || input.includes("魔術師")) return "image";
  if (input.includes("智策") || input.includes("決策中心") || t.includes("command")) return "command";
  return "command";
}

function runNodeScript(args) {
  return new Promise((resolve, reject) => {
    execFile("node", args, { cwd: __dirname, timeout: 300000 }, (error, stdout, stderr) => {
      if (error) {
        reject(new Error(stderr || error.message));
        return;
      }
      resolve(stdout);
    });
  });
}

app.post("/api/task", async (req, res) => {
  try {
    const task = req.body?.task || "";
    if (!task.trim()) {
      res.status(400).json({ ok: false, error: "Missing task" });
      return;
    }

    const intent = detectIntent(task);

    if (intent === "direct-answer") {
      res.json({
        ok: true,
        intent,
        answer: "這是一般問題，不需要開多 AI 會議。請提供需要查詢的地點或資料，我會直接回答。"
      });
      return;
    }

    const output = await runNodeScript(["src/orchestrator/runAndSaveProjectTask.js", detectProject(task), task]);
    const parsed = JSON.parse(output);
    res.json({
      ok: true,
      intent,
      output,
      answer: parsed.answer,
      outputFile: parsed.outputFile,
      projectKey: parsed.projectKey
    });
  } catch (error) {
    res.status(500).json({ ok: false, error: error.message });
  }
});

app.get("/api/latest-report", async (req, res) => {
  try {
    const output = await runNodeScript(["src/orchestrator/latestReport.js"]);
    res.json({ ok: true, output });
  } catch (error) {
    res.status(500).json({ ok: false, error: error.message });
  }
});

app.get("/api/health", async (req, res) => {
  try {
    const output = await runNodeScript(["src/mcp/testAllMcp.js"]);
    res.json({
      ok: true,
      status: "healthy",
      output
    });
  } catch (error) {
    res.status(500).json({ ok: false, error: error.message });
  }
});

app.get("/api/reports", (req, res) => {
  const dir = path.join(__dirname, "reports", "orchestrator");
  if (!fs.existsSync(dir)) {
    res.json({ ok: true, reports: [] });
    return;
  }

  const reports = fs.readdirSync(dir)
    .filter(file => file.endsWith(".json"))
    .map(file => ({
      file,
      updatedAt: fs.statSync(path.join(dir, file)).mtime
    }))
    .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
    .slice(0, 20);

  res.json({ ok: true, reports });
});

app.listen(port, () => {
  console.log(`智策中心 Web UI 已啟動：http://localhost:${port}`);
});
