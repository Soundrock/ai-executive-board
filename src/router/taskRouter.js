export function routeTask(task) {
  const t = task.toLowerCase();

  if (t.includes("erp")) return "erp";
  if (t.includes("github")) return "github";
  if (t.includes("image")) return "vision";
  if (t.includes("photo")) return "vision";
  if (t.includes("picture")) return "vision";
  if (t.includes("gmail")) return "gmail";
  if (t.includes("mail")) return "gmail";
  if (t.includes("drive")) return "googleDrive";

  return "chatgpt";
}
