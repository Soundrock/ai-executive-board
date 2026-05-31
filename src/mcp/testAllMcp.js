import { listMcpConnectors } from "./mcpRegistry.js";

console.log("MCP Connectors Summary");
console.log(JSON.stringify(listMcpConnectors(), null, 2));
