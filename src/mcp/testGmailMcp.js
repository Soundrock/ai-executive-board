import {
  gmailMcp,
  searchEmails,
  readEmail,
  createDraft,
  sendAfterApproval
} from "./connectors/gmailMcp.js";

console.log("Gmail MCP:");
console.log(JSON.stringify(gmailMcp, null, 2));

console.log("Search:");
console.log(await searchEmails("from:customer@example.com"));

console.log("Read:");
console.log(await readEmail("mock-message-id"));

console.log("Draft:");
console.log(await createDraft({
  to: "customer@example.com",
  subject: "Test Draft",
  body: "This is a test draft."
}));

console.log("Send without approval:");
console.log(await sendAfterApproval("mock-draft-id", false));
