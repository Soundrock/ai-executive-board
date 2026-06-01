import "dotenv/config";
import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { execFile } from "child_process";
import fs from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json({ limit: "20mb" }));
app.use(express.static(path.join(__dirname, "public")));

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

    const output = await runNodeScript(["src/orchestrator/commandCenterCli.js", task]);
    res.json({ ok: true, output });
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
