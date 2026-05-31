import axios from "axios";
import { GITHUB_TOKEN, GITHUB_OWNER } from "./githubConfig.js";

class GitHubAgent {
  constructor() {
    this.baseUrl = "https://api.github.com";
    this.headers = {
      Accept: "application/vnd.github.v3+json",
      "X-GitHub-Api-Version": "2022-11-28"
    };

    if (GITHUB_TOKEN) {
      this.headers.Authorization = `Bearer ${GITHUB_TOKEN}`;
    }
  }

  async _request(method, url, params = {}) {
    const response = await axios({
      method,
      url: `${this.baseUrl}${url}`,
      headers: this.headers,
      params
    });
    return response.data;
  }

  async getRepositories() {
    return this._request("GET", "/user/repos", {
      per_page: 100,
      sort: "updated"
    });
  }

  async getRepository(owner = GITHUB_OWNER, repo) {
    return this._request("GET", `/repos/${owner}/${repo}`);
  }

  async getBranches(owner = GITHUB_OWNER, repo) {
    return this._request("GET", `/repos/${owner}/${repo}/branches`, {
      per_page: 100
    });
  }

  async getCommits(owner = GITHUB_OWNER, repo) {
    return this._request("GET", `/repos/${owner}/${repo}/commits`, {
      per_page: 10
    });
  }

  async getRepositoryTree(owner = GITHUB_OWNER, repo) {
    const repoDetails = await this.getRepository(owner, repo);
    const branch = repoDetails.default_branch || "main";
    const branchDetails = await this._request("GET", `/repos/${owner}/${repo}/branches/${branch}`);
    const treeSha = branchDetails.commit.commit.tree.sha;

    return this._request("GET", `/repos/${owner}/${repo}/git/trees/${treeSha}`, {
      recursive: 1
    });
  }

  async getFileContent(owner = GITHUB_OWNER, repo, filePath) {
    const fileData = await this._request("GET", `/repos/${owner}/${repo}/contents/${filePath}`);
    if (!fileData || !fileData.content) return null;
    return Buffer.from(fileData.content, "base64").toString("utf8");
  }
}

export { GitHubAgent };
