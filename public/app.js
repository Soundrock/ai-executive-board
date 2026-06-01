const sendButton = document.getElementById("send");
const questionInput = document.getElementById("question");
const conversation = document.getElementById("conversation");
let pendingFiles = [];
window.modelOptions = {};

function escapeHtml(text) {
  return String(text).replace(/[&<>"']/g, char => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;"
  }[char]));
}

function renderPendingFiles() {
  if (!pendingFiles.length) return "";
  return `<div class="file-preview-list">${pendingFiles.map(file => `
    <div class="file-preview">
      ${file.type.startsWith("image/") ? `<img src="${file.preview}" alt="${escapeHtml(file.name)}">` : ""}
      <span>${escapeHtml(file.name)}</span>
    </div>
  `).join("")}</div>`;
}

function addMessage(type, html) {
  const message = document.createElement("div");
  message.className = `message ${type}-message`;
  message.innerHTML = `<div class="bubble">${html}</div>`;
  conversation.appendChild(message);
  requestAnimationFrame(() => {
    conversation.scrollTop = conversation.scrollHeight;
  });
}

function renderMeta(data) {
  const source = data.source || "未知";
  const mode = data.mode || data.intent || "未知";
  const inactive = Array.isArray(data.inactiveAis) && data.inactiveAis.length
    ? `｜未參與：${data.inactiveAis.map(x => `${x.ai} (${x.error})`).join("、")}`
    : "";
  return `<div class="answer-meta">來源：${escapeHtml(source)}｜模式：${escapeHtml(mode)}${escapeHtml(inactive)}</div>`;
}

function renderAiResponses(data) {
  if (!Array.isArray(data.aiResponses)) return "";

  return `<details class="ai-responses">
    <summary>查看 AI 原始回答</summary>
    ${data.aiResponses.map(item => `
      <section class="ai-response-card">
        <h4>${escapeHtml(item.ai)} ${item.ok ? "✅" : "❌"}</h4>
        <pre>${escapeHtml(item.answer || item.error || "沒有回覆")}</pre>
      </section>
    `).join("")}
  </details>`;
}

function renderAiStatus(aiStatus = {}) {
  const items = Object.entries(aiStatus).map(([id, ai]) => {
    const cls = ai.connected ? "online" : "offline";
    const label = ai.connected ? "已連線" : "未連線";
    const model = ai.model ? ` / ${ai.model}` : "";
    const time = ai.responseTimeMs ? ` / ${ai.responseTimeMs}ms` : "";
    const error = ai.error ? ` / ${ai.error}` : "";
    return `<div class="ai-status-row" data-ai="${id}" title="${escapeHtml(error)}">
      <span class="status-dot ${cls}"></span>
      <span>${escapeHtml(ai.name)}<small>${escapeHtml(model)}</small></span>
      <small>${label}${escapeHtml(time)}</small>
    </div>`;
  }).join("");

  const target = document.getElementById("ai-status-box");
  if (target) target.innerHTML = items;
  enhanceAiPanels(aiStatus);
}

function enhanceAiPanels(aiStatus = {}) {
  const panels = [...document.querySelectorAll(".panel")];

  for (const panel of panels) {
    const title = panel.querySelector("h3")?.textContent || "";
    if (!["主控 AI", "參與 AI"].includes(title)) continue;

    const labels = [...panel.querySelectorAll("label, .card")];

    for (const label of labels) {
      if (label.dataset.enhanced === "true") continue;

      const text = label.textContent || "";
      let provider = "";
      if (text.includes("ChatGPT")) provider = "openai";
      if (text.includes("Gemini")) provider = "gemini";
      if (text.includes("DeepSeek")) provider = "deepseek";

      if (!provider) continue;

      label.dataset.enhanced = "true";
      label.classList.add("ai-choice-row");

      const statusKey = provider === "openai" ? "chatgpt" : provider;
      const status = aiStatus[statusKey];
      const dot = document.createElement("span");
      dot.className = `status-dot ${status?.connected ? "online" : "offline"}`;
      label.prepend(dot);

      const select = document.createElement("select");
      select.className = "ai-model-select";
      select.dataset.provider = provider;

      const options = window.modelOptions[provider] || [];
      for (const opt of options) {
        const option = document.createElement("option");
        option.value = opt.id;
        option.textContent = opt.label;
        if (status?.model === opt.id) option.selected = true;
        select.appendChild(option);
      }

      label.appendChild(select);
    }
  }
}

async function getBrowserLocation() {
  if (!navigator.geolocation) return null;

  return new Promise(resolve => {
    navigator.geolocation.getCurrentPosition(
      position => {
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          city: null
        });
      },
      () => resolve(null),
      { enableHighAccuracy: false, timeout: 5000, maximumAge: 600000 }
    );
  });
}

async function refreshAiStatus() {
  try {
    const response = await fetch("/api/ai-status");
    const data = await response.json();
    if (data.ok) renderAiStatus(data.aiStatus);
  } catch {
    const target = document.getElementById("ai-status-box");
    if (target) target.innerHTML = "AI 狀態讀取失敗";
  }
}

async function refreshUsage() {
  try {
    const response = await fetch("/api/usage");
    const data = await response.json();
    const target = document.getElementById("usage-box") || document.getElementById("left-usage-box");
    if (!target || !data.ok) return;

    const usage = data.usage;
    const rows = Object.entries(usage.byModel || {}).map(([model, item]) => `
      <div class="usage-row">
        <span>${escapeHtml(model)}</span>
        <small>${item.calls} 次 / 約 $${Number(item.estimatedCostUsd).toFixed(4)}</small>
      </div>
    `).join("");

    target.innerHTML = `
      <div class="usage-total">總次數：${usage.totalCalls}</div>
      <div class="usage-total">預估費用：約 $${usage.estimatedCostUsd}</div>
      ${rows || "<div class='usage-row'>尚無使用紀錄</div>"}
      <p class="usage-note">${escapeHtml(usage.note)}</p>
    `;
  } catch {
    const target = document.getElementById("usage-box") || document.getElementById("left-usage-box");
    if (target) target.innerHTML = "用量讀取失敗";
  }
}

async function refreshModelOptions() {
  try {
    const response = await fetch("/api/model-options");
    const data = await response.json();
    window.modelOptions = data.models || {};
  } catch {
    window.modelOptions = {};
  }
}

async function runTask() {
  const task = questionInput.value.trim();
  if (!task && !pendingFiles.length) return;

  addMessage("user", `<p>${escapeHtml(task)}</p>${renderPendingFiles()}`);
  questionInput.value = "";
  pendingFiles = [];
  renderInputFiles();

  const loading = document.createElement("div");
  loading.className = "message ai-message";
  loading.innerHTML = `<div class="bubble"><p>處理中...</p></div>`;
  conversation.appendChild(loading);
  conversation.scrollTop = conversation.scrollHeight;

  try {
    const response = await fetch("/api/task", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ task, location: await getBrowserLocation() })
    });

    const data = await response.json();

    if (!data.ok) throw new Error(data.error);

    loading.remove();
    if (data.aiStatus) renderAiStatus(data.aiStatus);

    const answer = data.answer || data.output || "沒有取得答案";
    addMessage("ai", `${renderMeta(data)}<pre>${escapeHtml(answer)}</pre>${renderAiResponses(data)}`);
    refreshUsage();
  } catch (error) {
    loading.remove();
    addMessage("ai", `<p>${escapeHtml(error.message)}</p>`);
  }
}

function renderInputFiles() {
  let box = document.getElementById("input-file-preview");
  if (!box) {
    box = document.createElement("div");
    box.id = "input-file-preview";
    questionInput.parentElement.insertBefore(box, document.querySelector(".composer-actions"));
  }

  box.innerHTML = pendingFiles.map(file => `
    <div class="file-preview">
      ${file.type.startsWith("image/") ? `<img src="${file.preview}" alt="${escapeHtml(file.name)}">` : ""}
      <span>${escapeHtml(file.name)}</span>
    </div>
  `).join("");
}

function addFiles(files) {
  for (const file of files) {
    const item = {
      name: file.name,
      type: file.type || "application/octet-stream",
      size: file.size,
      preview: ""
    };

    if (item.type.startsWith("image/")) {
      item.preview = URL.createObjectURL(file);
    }

    pendingFiles.push(item);
  }

  renderInputFiles();
}


function setupFileButtons() {
  const actions = document.querySelector(".composer-actions");
  const composer = document.querySelector(".composer");

  if (!actions || !composer) return;

  let fileInput = document.getElementById("real-file-input");
  let imageInput = document.getElementById("real-image-input");

  if (!fileInput) {
    fileInput = document.createElement("input");
    fileInput.id = "real-file-input";
    fileInput.type = "file";
    fileInput.multiple = true;
    fileInput.accept = ".png,.jpg,.jpeg,.webp,.gif,.bmp,.tiff,.pdf,.doc,.docx,.xls,.xlsx,.csv,.ppt,.pptx,.txt,.eml,.msg,.zip,image/*";
    fileInput.style.display = "none";
    document.body.appendChild(fileInput);
  }

  if (!imageInput) {
    imageInput = document.createElement("input");
    imageInput.id = "real-image-input";
    imageInput.type = "file";
    imageInput.accept = "image/*,.png,.jpg,.jpeg,.webp,.gif,.bmp,.tiff";
    imageInput.multiple = true;
    imageInput.style.display = "none";
    document.body.appendChild(imageInput);
  }

  document.querySelectorAll(".upload-action-btn").forEach(btn => btn.remove());

  const imageButton = document.createElement("button");
  imageButton.type = "button";
  imageButton.className = "upload-action-btn";
  imageButton.textContent = "圖片";
  imageButton.onclick = event => {
    event.preventDefault();
    imageInput.click();
  };

  const fileButton = document.createElement("button");
  fileButton.type = "button";
  fileButton.className = "upload-action-btn";
  fileButton.textContent = "附件";
  fileButton.onclick = event => {
    event.preventDefault();
    fileInput.click();
  };

  actions.insertBefore(imageButton, actions.firstChild);
  actions.insertBefore(fileButton, actions.firstChild);

  fileInput.onchange = () => addFiles(fileInput.files);
  imageInput.onchange = () => addFiles(imageInput.files);

  questionInput.addEventListener("paste", event => {
    const files = event.clipboardData?.files;
    if (files && files.length) addFiles(files);
  });

  composer.addEventListener("dragover", event => {
    event.preventDefault();
    composer.classList.add("drag-over");
  });

  composer.addEventListener("dragleave", () => {
    composer.classList.remove("drag-over");
  });

  composer.addEventListener("drop", event => {
    event.preventDefault();
    composer.classList.remove("drag-over");
    addFiles(event.dataTransfer.files);
  });
}


async function showLatestReport() {
  addMessage("ai", "<p>正在讀取最新報告...</p>");

  try {
    const response = await fetch("/api/latest-report");
    const data = await response.json();
    if (!data.ok) throw new Error(data.error);
    addMessage("ai", `<pre>${escapeHtml(data.output)}</pre>`);
  } catch (error) {
    addMessage("ai", `<p>${escapeHtml(error.message)}</p>`);
  }
}

async function runHealthCheck() {
  addMessage("ai", "<p>正在執行健康檢查...</p>");

  try {
    const response = await fetch("/api/health");
    const data = await response.json();
    if (!data.ok) throw new Error(data.error);
    addMessage("ai", `<pre>${escapeHtml(data.output)}</pre>`);
  } catch (error) {
    addMessage("ai", `<p>${escapeHtml(error.message)}</p>`);
  }
}

sendButton.addEventListener("click", runTask);

questionInput.addEventListener("keydown", event => {
  if (event.key === "Enter" && event.metaKey) {
    runTask();
  }
});

const latestButton = document.createElement("button");
latestButton.textContent = "最新報告";
latestButton.addEventListener("click", showLatestReport);

const healthButton = document.createElement("button");
healthButton.textContent = "健康檢查";
healthButton.addEventListener("click", runHealthCheck);

document.querySelector(".composer-actions").insertBefore(latestButton, sendButton);
document.querySelector(".composer-actions").insertBefore(healthButton, sendButton);

setupFileButtons();
await refreshModelOptions();
refreshAiStatus();
refreshUsage();
setInterval(refreshAiStatus, 30000);
setInterval(refreshUsage, 30000);
