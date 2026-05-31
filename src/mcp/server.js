import { GitHubAgent } from "../github-agent/githubAgent.js";

class GitHubAgentTool {
  constructor() {
    this.agent = new GitHubAgent();
  }

  async execute(action, params = {}) {
    const { owner, repo, path } = params;

    if (action === "getRepositories") return this.agent.getRepositories();
    if (action === "getRepository") return this.agent.getRepository(owner, repo);
    if (action === "getBranches") return this.agent.getBranches(owner, repo);
    if (action === "getCommits") return this.agent.getCommits(owner, repo);
    if (action === "getRepositoryTree") return this.agent.getRepositoryTree(owner, repo);
    if (action === "getFileContent") return this.agent.getFileContent(owner, repo, path);

    throw new Error(`Unknown GitHubAgentTool action: ${action}`);
  }
}

class RepoReaderTool extends GitHubAgentTool {}

class HealthCheckTool {
  async execute() {
    return {
      status: "ok",
      service: "mcp-server-skeleton",
      timestamp: new Date().toISOString()
    };
  }
}

export { GitHubAgentTool, RepoReaderTool, HealthCheckTool };
