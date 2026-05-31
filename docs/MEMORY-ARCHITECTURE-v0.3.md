# 智策中心 Memory Architecture v0.3

## 原則

採用多專案獨立記憶庫。

GitHub 只存程式碼與規格文件。
不存大量 logs、圖片、PDF、PPT、Excel 或 API Key。

## 儲存策略

Rental ERP：
維持 Firebase，不變更。

智策中心：
優先使用 SQLite。

AI 圖像魔術師：
優先使用 SQLite。

名片大師：
優先使用 SQLite。

大檔案：
先放本機 uploads 資料夾。
未來可升級 Google Drive 或 Firebase Storage。

## 專案記憶庫預設資料夾

data/projects/erp
data/projects/ai-image-magician
data/projects/business-card-master
data/projects/factory-development
data/projects/ik-project

## 未來升級

Phase 1：
本機 SQLite。

Phase 2：
Firebase Firestore 同步文字記憶。

Phase 3：
向量資料庫，支援語意搜尋與 AI 長期記憶。
