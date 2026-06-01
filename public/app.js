const sendButton = document.getElementById("send");
const questionInput = document.getElementById("question");
const conversation = document.getElementById("conversation");

function addMessage(type, html) {
  const message = document.createElement("div");
  message.className = `message ${type}-message`;
  message.innerHTML = `<div class="bubble">${html}</div>`;
  conversation.appendChild(message);
  conversation.scrollTop = conversation.scrollHeight;
}

function escapeHtml(text) {
  return String(text).replace(/[&<>"']/g, char => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;"
  }[char]));
}

async function runTask() {
  const task = questionInput.value.trim();
  if (!task) return;

  addMessage("user", `<strong>你</strong><p>${escapeHtml(task)}</p>`);
  questionInput.value = "";

  addMessage("ai", "<strong>智策中心</strong><p>任務執行中，請稍候...</p>");

  try {
    const response = await fetch("/api/task", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ task })
    });

    const data = await response.json();

    if (!data.ok) throw new Error(data.error);

    addMessage("ai", `<strong>任務完成</strong><pre>${escapeHtml(data.output)}</pre>`);
  } catch (error) {
    addMessage("ai", `<strong>錯誤</strong><p>${escapeHtml(error.message)}</p>`);
  }
}

async function showLatestReport() {
  addMessage("ai", "<strong>智策中心</strong><p>正在讀取最新報告...</p>");

  try {
    const response = await fetch("/api/latest-report");
    const data = await response.json();
    if (!data.ok) throw new Error(data.error);
    addMessage("ai", `<strong>最新報告</strong><pre>${escapeHtml(data.output)}</pre>`);
  } catch (error) {
    addMessage("ai", `<strong>錯誤</strong><p>${escapeHtml(error.message)}</p>`);
  }
}

async function runHealthCheck() {
  addMessage("ai", "<strong>智策中心</strong><p>正在執行健康檢查...</p>");

  try {
    const response = await fetch("/api/health");
    const data = await response.json();
    if (!data.ok) throw new Error(data.error);
    addMessage("ai", `<strong>健康檢查完成</strong><pre>${escapeHtml(data.output)}</pre>`);
  } catch (error) {
    addMessage("ai", `<strong>錯誤</strong><p>${escapeHtml(error.message)}</p>`);
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
