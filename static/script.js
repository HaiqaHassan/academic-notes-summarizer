const form = document.getElementById("summaryForm");
const fileInput = document.getElementById("pdf");
const fileName = document.getElementById("fileName");
const alertBox = document.getElementById("alertBox");
const loading = document.getElementById("loading");
const generateBtn = document.getElementById("generateBtn");
const results = document.getElementById("results");
const resultCards = document.getElementById("resultCards");
let latestResult = null;

fileInput.addEventListener("change", () => {
  const file = fileInput.files[0];
  if (!file) { fileName.textContent = ""; return; }
  if (!file.name.toLowerCase().endsWith(".pdf")) {
    fileInput.value = "";
    fileName.textContent = "";
    showError("Please choose a PDF file.");
    return;
  }
  if (file.size > 12 * 1024 * 1024) {
    fileInput.value = "";
    fileName.textContent = "";
    showError("The PDF is larger than 12 MB.");
    return;
  }
  fileName.textContent = `Selected: ${file.name}`;
  hideError();
});

function showError(message) {
  alertBox.textContent = message;
  alertBox.hidden = false;
}
function hideError() {
  alertBox.hidden = true;
  alertBox.textContent = "";
}
function safeText(value) {
  return String(value ?? "");
}
function escapeHTML(value) {
  return safeText(value).replace(/[&<>"']/g, char => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
  }[char]));
}
function listHTML(items, ordered = false) {
  const tag = ordered ? "ol" : "ul";
  const list = Array.isArray(items) ? items : [];
  return `<${tag}>${list.map(item => `<li>${escapeHTML(item)}</li>`).join("")}</${tag}>`;
}
function card(title, kicker, content, wide = false) {
  return `<article class="result-card ${wide ? "wide" : ""}"><div class="card-kicker">${kicker}</div><h3>${title}</h3>${content}</article>`;
}
function renderResult(data) {
  const questions = data.exam_questions || {};
  const definitions = Array.isArray(data.important_definitions) ? data.important_definitions : [];
  const defsHTML = definitions.length
    ? definitions.map(item => `<div class="definition"><strong>${escapeHTML(item.term)}</strong><span>${escapeHTML(item.definition)}</span></div>`).join("")
    : "<p>Not available in the provided material.</p>";
  const questionHTML = [
    ["Short-answer questions", questions.short_answer],
    ["Conceptual questions", questions.conceptual],
    ["Long-answer questions", questions.long_answer]
  ].map(([heading, items]) => `<div class="question-group"><h4>${heading}</h4>${listHTML(items, true)}</div>`).join("");
  resultCards.innerHTML = [
    card("Main Summary", "THE BIG PICTURE", `<p>${escapeHTML(data.main_summary)}</p>`, true),
    card("Key Concepts", "CORE IDEAS", listHTML(data.key_concepts)),
    card("Important Definitions", "TERMS TO KNOW", defsHTML),
    card("Important Points", "REMEMBER THESE", listHTML(data.important_points)),
    card("Exam Questions", "TEST YOUR UNDERSTANDING", questionHTML, true),
    card("Quick Revision Notes", "LAST-MINUTE REVIEW", listHTML(data.quick_revision_notes)),
    card("Key Takeaways", "WHAT MATTERS MOST", listHTML(data.key_takeaways))
  ].join("");
  results.hidden = false;
}
function makePlainText(data) {
  const q = data.exam_questions || {};
  const lines = [
    "ACADEMIC NOTES SUMMARIZER", "",
    "MAIN SUMMARY", safeText(data.main_summary), "",
    "KEY CONCEPTS", ...(data.key_concepts || []).map(x => `• ${x}`), "",
    "IMPORTANT DEFINITIONS", ...(data.important_definitions || []).map(x => `${x.term}: ${x.definition}`), "",
    "IMPORTANT POINTS", ...(data.important_points || []).map(x => `• ${x}`), "",
    "EXAM QUESTIONS",
    "Short-answer:", ...(q.short_answer || []).map((x, i) => `${i + 1}. ${x}`),
    "Conceptual:", ...(q.conceptual || []).map((x, i) => `${i + 1}. ${x}`),
    "Long-answer:", ...(q.long_answer || []).map((x, i) => `${i + 1}. ${x}`), "",
    "QUICK REVISION NOTES", ...(data.quick_revision_notes || []).map(x => `• ${x}`), "",
    "KEY TAKEAWAYS", ...(data.key_takeaways || []).map(x => `• ${x}`)
  ];
  return lines.join("\n");
}
form.addEventListener("submit", async event => {
  event.preventDefault();
  hideError();
  const notes = document.getElementById("notes").value.trim();
  const file = fileInput.files[0];
  if (!notes && !file) { showError("Please paste your notes or upload a PDF first."); return; }
  const body = new FormData(form);
  loading.hidden = false;
  generateBtn.disabled = true;
  generateBtn.textContent = "Generating…";
  try {
    const response = await fetch("/api/summarize", { method: "POST", body });
    const payload = await response.json();
    if (!response.ok) throw new Error(payload.error || "Unable to generate summary.");
    latestResult = payload.result;
    renderResult(latestResult);
    results.scrollIntoView({ behavior: "smooth", block: "start" });
  } catch (error) {
    showError(error.message || "Something went wrong. Please try again.");
  } finally {
    loading.hidden = true;
    generateBtn.disabled = false;
    generateBtn.innerHTML = 'Generate Summary <span>↗</span>';
  }
});

document.getElementById("copyBtn").addEventListener("click", async () => {
  if (!latestResult) return;
  try {
    await navigator.clipboard.writeText(makePlainText(latestResult));
    document.getElementById("copyBtn").textContent = "Copied ✓";
    setTimeout(() => document.getElementById("copyBtn").textContent = "Copy Summary", 1800);
  } catch { showError("Clipboard access was blocked by your browser. You can still download the summary."); }
});
document.getElementById("downloadBtn").addEventListener("click", () => {
  if (!latestResult) return;
  const blob = new Blob([makePlainText(latestResult)], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "academic-study-summary.txt";
  link.click();
  URL.revokeObjectURL(url);
});
document.getElementById("againBtn").addEventListener("click", () => {
  form.scrollIntoView({ behavior: "smooth", block: "start" });
  document.getElementById("generateBtn").focus();
});
document.getElementById("clearBtn").addEventListener("click", () => {
  form.reset();
  fileName.textContent = "";
  results.hidden = true;
  resultCards.innerHTML = "";
  latestResult = null;
  hideError();
  document.getElementById("notes").focus();
});
