import { GitHubAgentTool } from "../server.js";

export const githubMcp = {
  id: "github",
  name: "GitHub MCP",
  status: "ready",
  tool: new GitHubAgentTool(),
  actions: [
    "getRepositories",
    "getRepository",
    "getBranches",
    "getCommits",
    "getRepositoryTree",
    "getFileContent"
  ]
};
