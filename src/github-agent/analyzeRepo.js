import "dotenv/config";
import { GitHubAgent } from "./githubAgent.js";
import { GITHUB_OWNER } from "./githubConfig.js";

const repo = process.argv[2];

if (!repo) {
  console.error("請輸入 repo 名稱，例如：node src/github-agent/analyzeRepo.js tour-guide-rental-erp");
  process.exit(1);
}

const agent = new GitHubAgent();

async function run() {
  console.log(`Analyzing ${GITHUB_OWNER}/${repo}`);

  const repoInfo = await agent.getRepository(GITHUB_OWNER, repo);
  const branches = await agent.getBranches(GITHUB_OWNER, repo);
  const commits = await agent.getCommits(GITHUB_OWNER, repo);
  const tree = await agent.getRepositoryTree(GITHUB_OWNER, repo);

  const files = tree.tree || [];
  const topFiles = files
    .filter((item) => item.type === "blob")
    .slice(0, 80)
    .map((item) => item.path);

  const report = {
    repo: repoInfo.full_name,
    private: repoInfo.private,
    defaultBranch: repoInfo.default_branch,
    language: repoInfo.language,
    updatedAt: repoInfo.updated_at,
    branchCount: branches.length,
    branches: branches.map((b) => b.name),
    latestCommits: commits.slice(0, 5).map((c) => ({
      sha: c.sha.substring(0, 7),
      message: c.commit.message,
      date: c.commit.author?.date
    })),
    fileCount: files.length,
    topFiles
  };

  console.log(JSON.stringify(report, null, 2));
}

run().catch((error) => {
  console.error("Repo analysis failed:");
  console.error(error.response?.data || error.message);
  process.exit(1);
});
