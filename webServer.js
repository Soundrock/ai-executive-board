import "dotenv/config";
import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { execFile } from "child_process";
import fs from "fs";
import multer from "multer";
import { detectIntent } from "./src/intelligence/intentRouter.js";
import { answerErpQuestion } from "./src/context/erpAnswerEngine.js";
import { answerGeneralQuestion } from "./src/answer/generalAnswerEngine.js";
import { directAiAnswer } from "./src/ai/directAiAnswer.js";
import { getAiStatus } from "./src/ai/aiStatus.js";
import { runRealMultiAiDiscussion } from "./src/multi-ai/realMultiAiDiscussion.js";
import { getUsageSummary } from "./src/usage/usageTracker.js";
import { getModelOptions } from "./src/models/modelOptions.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 3000;

const upload = multer({
  dest: "uploads/",
  limits: { fileSize: 50 * 1024 * 1024 }
});

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

app.post("/api/upload", upload.array("files", 20), (req, res) => {
  const files = (req.files || []).map(file => ({
    originalName: file.originalname,
    filename: file.filename,
    path: file.path,
    mimeType: file.mimetype,
    size: file.size,
    uploadedAt: new Date().toISOString()
  }));

  fs.mkdirSync("data", { recursive: true });
  const historyFile = "data/upload-history.json";
  let history = [];
  try {
    if (fs.existsSync(historyFile)) {
      history = JSON.parse(fs.readFileSync(historyFile, "utf8"));
    }
  } catch {
    history = [];
  }

  history.push(...files);
  fs.writeFileSync(historyFile, JSON.stringify(history.slice(-500), null, 2));

  res.json({ ok: true, files });
});

app.get("/api/uploads", (req, res) => {
  const historyFile = "data/upload-history.json";
  let files = [];
  try {
    if (fs.existsSync(historyFile)) {
      files = JSON.parse(fs.readFileSync(historyFile, "utf8"));
    }
  } catch {
    files = [];
  }

  res.json({ ok: true, files: files.slice(-100).reverse() });
});

app.post("/api/task", async (req, res) => {
  try {
    const task = req.body?.task || "";
    if (!task.trim()) {
      res.status(400).json({ ok: false, error: "Missing task" });
      return;
    }

    const intent = detectIntent(task);

    const projectKey = detectProject(task);

    if (projectKey === "erp" && (intent === "decision" || intent === "memory")) {
      res.json({
        ok: true,
        intent,
        projectKey,
        answer: answerErpQuestion(task),
        source: "ERP Context Engine",
        mode: "project-context",
        aiStatus: getAiStatus()
      });
      return;
    }

    if (intent === "direct-answer") {
      const multiAi = await runRealMultiAiDiscussion(task);
      res.json({
        ok: true,
        intent,
        answer: multiAi.finalAnswer,
        source: multiAi.source,
        mode: multiAi.mode,
        aiStatus: getAiStatus(),
        aiResponses: multiAi.responses,
        aiRunStatus: multiAi.aiStatus,
        inactiveAis: multiAi.inactiveAis || []
      });
      return;
    }

    const output = await runNodeScript(["src/orchestrator/runAndSaveProjectTask.js", projectKey, task]);
    const parsed = JSON.parse(output);
    res.json({
      ok: true,
      intent,
      output,
      answer: parsed.answer,
      outputFile: parsed.outputFile,
      projectKey: parsed.projectKey,
      source: "Multi-Agent",
      mode: "decision",
      aiStatus: getAiStatus()
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

app.get("/api/usage", (req, res) => {
  res.json({
    ok: true,
    usage: getUsageSummary()
  });
});

app.get("/api/model-options", (req, res) => {
  res.json({
    ok: true,
    models: getModelOptions()
  });
});

app.get("/api/ai-status", (req, res) => {
  res.json({
    ok: true,
    aiStatus: getAiStatus()
  });
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
