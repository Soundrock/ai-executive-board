import "dotenv/config";
import { GitHubAgent } from "./githubAgent.js";
import { GITHUB_OWNER } from "./githubConfig.js";

const agent = new GitHubAgent();

async function run() {
  const repos = await agent.getRepositories();
  console.log("Repos:");
  for (const repo of repos.filter((r) => r.owner?.login === GITHUB_OWNER).slice(0, 10)) {
    console.log(`- ${repo.full_name}`);
  }

  const testRepos = [
    "tour-guide-rental-erp",
    "ai-image-magician",
    "vincent-ai-command-center"
  ];

  for (const repo of testRepos) {
    console.log(`\nTesting ${GITHUB_OWNER}/${repo}`);

    const branches = await agent.getBranches(GITHUB_OWNER, repo);
    console.log("Branches:", branches.map((b) => b.name).join(", "));

    const commits = await agent.getCommits(GITHUB_OWNER, repo);
    console.log("Latest commit:", commits[0]?.commit?.message || "No commit found");

    const tree = await agent.getRepositoryTree(GITHUB_OWNER, repo);
    console.log("Tree items:", tree.tree?.length || 0);
  }
}

run().catch((error) => {
  console.error("GitHub Agent test failed:");
  console.error(error.response?.data || error.message);
  process.exit(1);
});
