import "dotenv/config";
import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { runDiscussion } from "./src/discussion/discussionEngine.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json({ limit: "10mb" }));
app.use(express.static(path.join(__dirname, "public")));

app.post("/api/discuss", async (req, res) => {
  try {
    const result = await runDiscussion(req.body);
    res.json(result);
  } catch (error) {
    res.status(500).json({
      ok: false,
      error: error.message
    });
  }
});

app.listen(port, () => {
  console.log(`智策中心 Web UI 已啟動：http://localhost:${port}`);
});
