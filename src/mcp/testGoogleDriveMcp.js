import {
  googleDriveMcp,
  searchFiles,
  readFile,
  summarizeFile,
  exportFileAfterApproval
} from "./connectors/googleDriveMcp.js";

console.log("Google Drive MCP:");
console.log(JSON.stringify(googleDriveMcp, null, 2));

console.log("Search:");
console.log(await searchFiles("ERP 報告"));

console.log("Read:");
console.log(await readFile("mock-file-id"));

console.log("Summarize:");
console.log(await summarizeFile("mock-file-id"));

console.log("Export without approval:");
console.log(await exportFileAfterApproval("mock-file-id", false));
