import { githubMcp } from "./connectors/githubMcp.js";
import { gmailMcp } from "./connectors/gmailMcp.js";
import { googleDriveMcp } from "./connectors/googleDriveMcp.js";
import { erpMcp } from "./connectors/erpMcp.js";

export const MCP_CONNECTORS = {
  github: githubMcp,
  gmail: gmailMcp,
  googleDrive: googleDriveMcp,
  erp: erpMcp
};

export function listMcpConnectors() {
  return Object.values(MCP_CONNECTORS).map(({ id, name, status, actions }) => ({
    id,
    name,
    status,
    actions
  }));
}

export function getMcpConnector(id) {
  return MCP_CONNECTORS[id];
}
