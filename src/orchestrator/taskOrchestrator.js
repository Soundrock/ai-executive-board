import { routeTask } from "../router/taskRouter.js";
import { listMcpConnectors } from "../mcp/mcpRegistry.js";
import { AGENTS } from "../agents/agentRegistry.js";

export function planTask(task) {
  const route = routeTask(task);
  const connectors = listMcpConnectors();
  const connector = connectors.find(c => c.id === route);

  return {
    task,
    route,
    selectedConnector: connector || null,
    availableAgents: AGENTS.filter(a => a.enabled).map(a => ({
      id: a.id,
      name: a.name
    })),
    executionMode:
      route === "erp" || route === "github"
        ? "tool-assisted"
        : "discussion-first",
    approvalRequired:
      route === "erp" || route === "gmail" || route === "googleDrive"
  };
}
