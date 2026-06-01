export function printTaskReport({ task, status = "Completed", check = "PASS", git = "PASS", next = "" }) {
  console.log("");
  console.log("================ TASK REPORT ================");
  console.log(`Task: ${task}`);
  console.log(`Status: ${status}`);
  console.log(`Check: ${check}`);
  console.log(`Git: ${git}`);
  if (next) console.log(`Next: ${next}`);
  console.log("=============================================");
}
