const sendButton = document.getElementById("send");
const questionInput = document.getElementById("question");
const conversation = document.getElementById("conversation");

function getSelectedRadio(name) {
  return document.querySelector(`input[name="${name}"]:checked`)?.value;
}

function getParticipants() {
  return [...document.querySelectorAll('.panel input[type="checkbox"]:checked')].map(i => i.value);
}

function addMessage(type, html) {
  const message = document.createElement("div");
  message.className = `message ${type}-message`;
  message.innerHTML = `<div class="bubble">${html}</div>`;
  conversation.appendChild(message);
  conversation.scrollTop = conversation.scrollHeight;
}

sendButton.addEventListener("click", async () => {
  const question = questionInput.value.trim();
  if (!question) return;

  addMessage("user", `<strong>你</strong><p>${question}</p>`);
  questionInput.value = "";

  const payload = {
    question,
    controllerId: getSelectedRadio("controller"),
    participantIds: getParticipants(),
    researchLevel: getSelectedRadio("research")
  };

  addMessage("ai", "<strong>智策中心</strong><p>正在進行多 AI 討論...</p>");

  try {
    const response = await fetch("/api/discuss", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    const data = await response.json();

    addMessage("ai", `<strong>${data.controller || "主控 AI"}</strong><pre>${JSON.stringify(data, null, 2)}</pre>`);
  } catch (error) {
    addMessage("ai", `<strong>錯誤</strong><p>${error.message}</p>`);
  }
});
