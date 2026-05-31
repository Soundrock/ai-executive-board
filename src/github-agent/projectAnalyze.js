import "dotenv/config";
import { GitHubAgent } from "./githubAgent.js";
import { getProjectRepo } from "./projectMap.js";

const key = process.argv[2];
const project = getProjectRepo(key);

if (!project) {
  console.error("請輸入專案代號：erp / image / command");
  process.exit(1);
}

const agent = new GitHubAgent();

async function run() {
  const repoInfo = await agent.getRepository(project.owner, project.repo);
  const branches = await agent.getBranches(project.owner, project.repo);
  const commits = await agent.getCommits(project.owner, project.repo);
  const tree = await agent.getRepositoryTree(project.owner, project.repo);

  console.log(JSON.stringify({
    project: project.name,
    repo: repoInfo.full_name,
    private: repoInfo.private,
    defaultBranch: repoInfo.default_branch,
    language: repoInfo.language,
    updatedAt: repoInfo.updated_at,
    branches: branches.map(b => b.name),
    latestCommits: commits.slice(0, 5).map(c => ({
      sha: c.sha.substring(0, 7),
      message: c.commit.message,
      date: c.commit.author?.date
    })),
    fileCount: tree.tree?.length || 0
  }, null, 2));
}

run().catch((error) => {
  console.error(error.response?.data || error.message);
  process.exit(1);
});
