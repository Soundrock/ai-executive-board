const sendButton = document.getElementById("send");
const questionInput = document.getElementById("question");
const conversation = document.getElementById("conversation");

function addMessage(type, html) {
  const message = document.createElement("div");
  message.className = `message ${type}-message`;
  message.innerHTML = `<div class="bubble">${html}</div>`;
  conversation.appendChild(message);
  requestAnimationFrame(() => {
    conversation.scrollTop = conversation.scrollHeight;
  });
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

function extractAnswer(output) {
  try {
    const match = output.match(/\{[\s\S]*\}$/);
    if (!match) return output;

    const data = JSON.parse(match[0]);

    if (data.final) return data.final;
    if (data.outputFile) return `任務已完成，報告已儲存：${data.outputFile}`;
    return JSON.stringify(data, null, 2);
  } catch {
    return output;
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

async function runTask() {
  const task = questionInput.value.trim();
  if (!task) return;

  addMessage("user", `<strong>你</strong><p>${escapeHtml(task)}</p>`);
  questionInput.value = "";

  const loading = document.createElement("div");
  loading.className = "message ai-message";
  loading.innerHTML = `<div class="bubble"><strong>智策中心</strong><p>任務執行中，請稍候...</p></div>`;
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
    const answer = data.answer || extractAnswer(data.output);
    addMessage("ai", `<strong>任務完成</strong><pre>${escapeHtml(answer)}</pre>`);
  } catch (error) {
    loading.remove();
    addMessage("ai", `<strong>錯誤</strong><p>${escapeHtml(error.message)}</p>`);
  }
}

async function showLatestReport() {
  addMessage("ai", "<strong>智策中心</strong><p>正在讀取最新報告...</p>");

  try {
    const response = await fetch("/api/latest-report");
    const data = await response.json();
    if (!data.ok) throw new Error(data.error);
    addMessage("ai", `<strong>最新報告</strong><pre>${escapeHtml(extractAnswer(data.output))}</pre>`);
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
