import "dotenv/config";
import { GitHubAgent } from "./githubAgent.js";
import { GITHUB_OWNER } from "./githubConfig.js";

const repo = process.argv[2];

if (!repo) {
  console.error("Usage: node src/github-agent/repoHealthCheck.js <repo>");
  process.exit(1);
}

const agent = new GitHubAgent();

async function run() {
  const tree = await agent.getRepositoryTree(GITHUB_OWNER, repo);

  const files = tree.tree || [];

  const zipFiles = files.filter(f => f.path.endsWith(".zip"));
  const diffFiles = files.filter(f => f.path.endsWith(".diff"));
  const dsStoreFiles = files.filter(f => f.path.includes(".DS_Store"));
  const archiveFiles = files.filter(f => f.path.includes("Archive"));

  console.log(JSON.stringify({
    repo,
    totalFiles: files.length,
    zipFiles: zipFiles.length,
    diffFiles: diffFiles.length,
    dsStoreFiles: dsStoreFiles.length,
    archiveFiles: archiveFiles.length
  }, null, 2));
}

run().catch(console.error);
