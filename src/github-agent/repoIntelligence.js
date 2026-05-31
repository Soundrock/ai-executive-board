import "dotenv/config";
import fs from "fs";
import path from "path";
import { GitHubAgent } from "./githubAgent.js";
import { PROJECT_REPOS, getProjectRepo } from "./projectMap.js";

const target = process.argv[2] || "all";
const outputDir = path.join(process.cwd(), "reports", "repo-intelligence");
fs.mkdirSync(outputDir, { recursive: true });

const agent = new GitHubAgent();

function detectTechStack(files) {
  const paths = files.map(f => f.path);
  return {
    electron: paths.some(p => p.endsWith("main.js") || p.includes("electron")),
    node: paths.some(p => p.endsWith("package.json")),
    html: paths.some(p => p.endsWith(".html")),
    css: paths.some(p => p.endsWith(".css")),
    javascript: paths.some(p => p.endsWith(".js")),
    images: paths.filter(p => /\.(png|jpg|jpeg|webp|gif)$/i.test(p)).length,
    docs: paths.filter(p => /\.(md|pdf|docx|pptx|xlsx)$/i.test(p)).length
  };
}

function healthCheck(files) {
  const paths = files.map(f => f.path);
  return {
    totalFiles: files.length,
    archiveFiles: paths.filter(p => p.includes("Archive")).length,
    zipFiles: paths.filter(p => p.endsWith(".zip")).length,
    diffFiles: paths.filter(p => p.endsWith(".diff")).length,
    dsStoreFiles: paths.filter(p => p.includes(".DS_Store")).length,
    packageFiles: paths.filter(p => p.endsWith("package.json")).length,
    readmeFiles: paths.filter(p => p.toLowerCase().endsWith("readme.md")).length
  };
}

function makeRecommendations(projectName, health, tech) {
  const items = [];

  if (health.dsStoreFiles > 0) items.push("移除 .DS_Store，避免無意義檔案污染 Repo。");
  if (health.zipFiles > 0) items.push("ZIP 檔建議移到 Release 或外部備份，不建議長期放在 Repo。");
  if (health.diffFiles > 0) items.push("DIFF 檔建議整理到 review/archive 文件，不建議混在主 Repo。");
  if (health.archiveFiles > 20) items.push("Archive 檔案偏多，建議建立清理計畫，避免 AI 分析時混淆版本。");
  if (health.readmeFiles === 0) items.push("建議補 README，方便 AI 與人員快速理解專案。");
  if (tech.electron) items.push("Electron 專案建議保留 main.js、package.json、核心 HTML/CSS/JS 作為主要分析入口。");

  if (items.length === 0) items.push("目前未發現明顯結構問題。");

  return items;
}

async function analyzeProject(key) {
  const project = getProjectRepo(key);
  if (!project) throw new Error(`Unknown project key: ${key}`);

  const repoInfo = await agent.getRepository(project.owner, project.repo);
  const branches = await agent.getBranches(project.owner, project.repo);
  const commits = await agent.getCommits(project.owner, project.repo);
  const tree = await agent.getRepositoryTree(project.owner, project.repo);
  const files = tree.tree || [];

  const techStack = detectTechStack(files);
  const health = healthCheck(files);
  const recommendations = makeRecommendations(project.name, health, techStack);

  const report = {
    projectKey: key,
    projectName: project.name,
    repo: repoInfo.full_name,
    private: repoInfo.private,
    defaultBranch: repoInfo.default_branch,
    language: repoInfo.language,
    updatedAt: repoInfo.updated_at,
    branchCount: branches.length,
    branches: branches.map(b => b.name),
    latestCommits: commits.slice(0, 5).map(c => ({
      sha: c.sha.substring(0, 7),
      message: c.commit.message,
      date: c.commit.author?.date
    })),
    techStack,
    health,
    recommendations,
    importantFiles: files
      .filter(f =>
        f.path.endsWith("package.json") ||
        f.path.endsWith("README.md") ||
        f.path.endsWith("PROJECT-CONTEXT.md") ||
        f.path.endsWith("DEVELOPMENT-RULES.md") ||
        f.path.endsWith("index.html") ||
        f.path.endsWith("main.js") ||
        f.path.endsWith("app.js")
      )
      .map(f => f.path)
      .slice(0, 80)
  };

  const outFile = path.join(outputDir, `${key}-repo-intelligence.json`);
  fs.writeFileSync(outFile, JSON.stringify(report, null, 2), "utf8");

  console.log(`完成：${project.name}`);
  console.log(`報告：${outFile}`);
  return report;
}

async function run() {
  const keys = target === "all" ? Object.keys(PROJECT_REPOS) : [target];
  const reports = [];

  for (const key of keys) {
    reports.push(await analyzeProject(key));
  }

  const summaryFile = path.join(outputDir, "summary.json");
  fs.writeFileSync(summaryFile, JSON.stringify(reports, null, 2), "utf8");

  console.log("全部完成");
  console.log(`總表：${summaryFile}`);
}

run().catch(error => {
  console.error("Repo Intelligence failed:");
  console.error(error.response?.data || error.message);
  process.exit(1);
});
