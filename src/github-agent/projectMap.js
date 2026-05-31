export const PROJECT_REPOS = {
  erp: { owner: "Soundrock", repo: "tour-guide-rental-erp", name: "導覽機租賃 ERP" },
  image: { owner: "Soundrock", repo: "ai-image-magician", name: "AI 圖像魔術師" },
  command: { owner: "Soundrock", repo: "vincent-ai-command-center", name: "智策中心" }
};

export function getProjectRepo(key) {
  return PROJECT_REPOS[key];
}
