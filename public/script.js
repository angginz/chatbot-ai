const form = document.getElementById("chat-form");
const input = document.getElementById("user-input");
const chatBox = document.getElementById("chat-box");
const submitButton = form.querySelector('button[type="submit"]');
const themeToggle = document.getElementById("theme-toggle");
const themeIcon = themeToggle.querySelector("span");
const themeLabel = themeToggle.querySelector(".theme-label");

const conversation = [];

applyTheme(localStorage.getItem("chat-theme") || "light");

themeToggle.addEventListener("click", () => {
  const nextTheme = document.body.dataset.theme === "dark" ? "light" : "dark";
  applyTheme(nextTheme);
  localStorage.setItem("chat-theme", nextTheme);
});

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  const userMessage = input.value.trim();
  if (!userMessage) return;

  appendMessage("user", userMessage);
  conversation.push({ role: "user", text: userMessage });
  input.value = "";
  setLoading(true);

  const thinkingMessage = appendMessage("bot", "", true);

  try {
    const response = await fetch("/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ conversation }),
    });

    if (!response.ok) {
      throw new Error(`Request failed with status ${response.status}`);
    }

    const data = await response.json();
    const result = typeof data.result === "string" ? data.result.trim() : "";

    if (!result) {
      setMessageText(thinkingMessage, "Sorry, no response received.");
      return;
    }

    setMessageContent(thinkingMessage, result);
    conversation.push({ role: "model", text: result });
  } catch (error) {
    console.error("Chat request failed:", error);
    setMessageText(thinkingMessage, "Failed to get response from server.");
  } finally {
    setLoading(false);
    input.focus();
  }
});

function appendMessage(sender, text, isThinking = false) {
  const message = document.createElement("div");
  message.classList.add("message", sender);

  if (isThinking) {
    message.classList.add("thinking");
    message.setAttribute("aria-label", "Chatbot sedang berpikir");
    message.innerHTML = "<span></span><span></span><span></span>";
  } else {
    message.textContent = text;
  }

  chatBox.appendChild(message);
  chatBox.scrollTop = chatBox.scrollHeight;
  return message;
}

function setMessageText(message, text) {
  message.classList.remove("thinking");
  message.removeAttribute("aria-label");
  message.textContent = text;
}

function setMessageContent(message, markdown) {
  message.classList.remove("thinking");
  message.removeAttribute("aria-label");
  message.innerHTML = renderMarkdown(markdown);
}

function renderMarkdown(markdown) {
  let html = escapeHtml(markdown);

  html = html.replace(
    /```(?:[a-zA-Z0-9_-]+)?\n?([\s\S]*?)```/g,
    (_, code) => `<pre><code>${code.trim()}</code></pre>`,
  );
  html = html.replace(/^### (.+)$/gm, "<h4>$1</h4>");
  html = html.replace(/^## (.+)$/gm, "<h3>$1</h3>");
  html = html.replace(/^# (.+)$/gm, "<h2>$1</h2>");
  html = html.replace(/^[-*] (.+)$/gm, "<li>$1</li>");
  html = html.replace(/(<li>.*<\/li>\n?)+/g, (list) => `<ul>${list}</ul>`);
  html = html.replace(/`([^`\n]+)`/g, "<code>$1</code>");
  html = html.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
  html = html.replace(/\*([^*\n]+)\*/g, "<em>$1</em>");
  html = html.replace(/\n{2,}/g, "</p><p>");
  html = html.replace(/\n/g, "<br>");

  return `<p>${html}</p>`
    .replace(/<p>(<h[234]>)/g, "$1")
    .replace(/(<\/h[234]>)<\/p>/g, "$1")
    .replace(/<p>(<pre>)/g, "$1")
    .replace(/(<\/pre>)<\/p>/g, "$1")
    .replace(/<p>(<ul>)/g, "$1")
    .replace(/(<\/ul>)<\/p>/g, "$1");
}

function escapeHtml(value) {
  const element = document.createElement("div");
  element.textContent = value;
  return element.innerHTML;
}

function setLoading(isLoading) {
  input.disabled = isLoading;
  submitButton.disabled = isLoading;
}

function applyTheme(theme) {
  const isDark = theme === "dark";
  document.body.dataset.theme = isDark ? "dark" : "light";
  themeIcon.textContent = isDark ? "☀️" : "🌙";
  themeLabel.textContent = isDark ? "Light mode" : "Dark mode";
  themeToggle.setAttribute(
    "aria-label",
    isDark ? "Aktifkan light mode" : "Aktifkan dark mode",
  );
}
