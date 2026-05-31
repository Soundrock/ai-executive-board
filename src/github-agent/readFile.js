import "dotenv/config";
import { GitHubAgent } from "./githubAgent.js";
import { GITHUB_OWNER } from "./githubConfig.js";

const repo = process.argv[2];
const filePath = process.argv[3];

if (!repo || !filePath) {
  console.error("Usage: node src/github-agent/readFile.js <repo> <filePath>");
  process.exit(1);
}

const agent = new GitHubAgent();

async function run() {
  const content = await agent.getFileContent(GITHUB_OWNER, repo, filePath);
  console.log(content);
}

run().catch((error) => {
  console.error("Read file failed:");
  console.error(error.response?.data || error.message);
  process.exit(1);
});
