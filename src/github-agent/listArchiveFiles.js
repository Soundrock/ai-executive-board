import "dotenv/config";
import { GitHubAgent } from "./githubAgent.js";
import { GITHUB_OWNER } from "./githubConfig.js";

const repo = process.argv[2];

const agent = new GitHubAgent();

async function run() {
  const tree = await agent.getRepositoryTree(GITHUB_OWNER, repo);

  const files = tree.tree || [];

  const result = files
    .filter(f =>
      f.path.includes("Archive") ||
      f.path.endsWith(".zip") ||
      f.path.endsWith(".diff") ||
      f.path.includes(".DS_Store")
    )
    .map(f => f.path);

  console.log(JSON.stringify(result, null, 2));
}

run().catch(console.error);
