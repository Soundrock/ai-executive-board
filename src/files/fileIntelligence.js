import fs from "fs";
import path from "path";

export function summarizeUploadedFiles(files = []) {
  if (!files.length) return "";

  return files.map(file => {
    const ext = path.extname(file.originalName || "").toLowerCase();
    let type = "file";

    if ([".png", ".jpg", ".jpeg", ".webp", ".gif", ".bmp", ".tiff"].includes(ext)) type = "image";
    if ([".pdf"].includes(ext)) type = "pdf";
    if ([".doc", ".docx"].includes(ext)) type = "word";
    if ([".xls", ".xlsx", ".csv"].includes(ext)) type = "spreadsheet";
    if ([".ppt", ".pptx"].includes(ext)) type = "presentation";
    if ([".txt"].includes(ext)) type = "text";
    if ([".eml", ".msg"].includes(ext)) type = "email";

    return {
      name: file.originalName,
      path: file.path,
      mimeType: file.mimeType,
      size: file.size,
      type,
      supported: true
    };
  });
}

export function buildFileContext(files = []) {
  const summaries = summarizeUploadedFiles(files);

  if (!summaries.length) return "";

  return `使用者已上傳檔案：

${summaries.map((file, index) => `${index + 1}. ${file.name}
類型：${file.type}
路徑：${file.path}
大小：${file.size} bytes`).join("\n\n")}

注意：
目前系統已收到檔案 metadata。
圖片修改、PDF全文讀取、Word/Excel內容解析會在下一階段接入。`;
}
