const sendButton = document.querySelector('.composer button.primary');
const textarea = document.querySelector('.composer textarea');
const conversation = document.querySelector('.conversation');

function addMessage(text) {
  if (!text.trim()) return;
  const article = document.createElement('article');
  article.className = 'message user-message';
  article.innerHTML = `
    <div class="avatar">V</div>
    <div class="message-body">
      <div class="message-meta">
        <strong>You</strong>
        <time>Now</time>
      </div>
      <p>${text.replaceAll('<', '&lt;').replaceAll('>', '&gt;')}</p>
    </div>
  `;
  conversation.insertBefore(article, document.querySelector('.typing-row'));
  textarea.value = '';
}

sendButton?.addEventListener('click', () => addMessage(textarea.value));
