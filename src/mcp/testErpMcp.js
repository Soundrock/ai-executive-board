import {
  erpMcp,
  readRepoStructure,
  analyzeOrders,
  analyzeInventory,
  analyzeFinance,
  generateErpReport,
  modifyAfterApproval
} from "./connectors/erpMcp.js";

console.log("ERP MCP:");
console.log(JSON.stringify(erpMcp, null, 2));

console.log(await readRepoStructure());
console.log(await analyzeOrders());
console.log(await analyzeInventory());
console.log(await analyzeFinance());
console.log(await generateErpReport());
console.log(await modifyAfterApproval(false));
