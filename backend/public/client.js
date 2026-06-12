const els = {
  status: document.querySelector("#status"),
  statusText: document.querySelector("#statusText"),
  language: document.querySelector("#language"),
  level: document.querySelector("#level"),
  scenario: document.querySelector("#scenario"),
  startButton: document.querySelector("#startButton"),
  transcript: document.querySelector("#transcript"),
  composer: document.querySelector("#composer"),
  textInput: document.querySelector("#textInput"),
  talkButton: document.querySelector("#talkButton"),
  talkLabel: document.querySelector("#talkLabel"),
  corrections: document.querySelector("#corrections"),
  scores: document.querySelector("#scores"),
};

const PCM_RATE = 24000;

let ws;
let currentAssistant;
let assistantMessagesByResponse = new Map();
let inputContext;
let processor;
let source;
let micStream;
let isRecording = false;
let outputContext;
let nextPlayTime = 0;
let activeSources = [];

init();

async function init() {
  try {
    const catalog = await fetch("/api/catalog").then((res) => res.json());
    fillSelect(els.language, catalog.languages, "label", catalog.defaults.language);
    fillSelect(els.level, catalog.levels, (l) => `${l.id} — ${l.label}`, catalog.defaults.level);
    fillScenarioSelect(els.scenario, catalog.scenarios, catalog.difficulties, catalog.defaults.scenario);
  } catch {
    setStatus("Failed to load catalog", false);
  }

  els.startButton.addEventListener("click", startSession);
  els.composer.addEventListener("submit", onSubmitText);
  els.talkButton.addEventListener("pointerdown", startRecording);
  els.talkButton.addEventListener("pointerup", stopRecording);
  els.talkButton.addEventListener("pointerleave", () => isRecording && stopRecording());
}

function fillSelect(select, items, labelKey, selectedId) {
  select.innerHTML = "";
  for (const item of items) {
    const option = document.createElement("option");
    option.value = item.id;
    option.textContent = typeof labelKey === "function" ? labelKey(item) : item[labelKey];
    if (item.id === selectedId) option.selected = true;
    select.append(option);
  }
}

// Missions are grouped by their intrinsic difficulty (easy / medium / hard).
function fillScenarioSelect(select, scenarios, difficulties, selectedId) {
  select.innerHTML = "";
  for (const difficulty of difficulties) {
    const group = document.createElement("optgroup");
    group.label = difficulty.label;
    for (const scenario of scenarios.filter((s) => s.difficulty === difficulty.id)) {
      const option = document.createElement("option");
      option.value = scenario.id;
      option.textContent = scenario.label;
      if (scenario.id === selectedId) option.selected = true;
      group.append(option);
    }
    if (group.children.length > 0) select.append(group);
  }
}

function startSession() {
  if (ws) ws.close();
  els.transcript.innerHTML = "";
  els.corrections.innerHTML = "";
  els.scores.innerHTML = "";
  assistantMessagesByResponse = new Map();

  const protocol = window.location.protocol === "https:" ? "wss" : "ws";
  ws = new WebSocket(`${protocol}://${window.location.host}/realtime`);

  ws.addEventListener("open", () => {
    setStatus("Configuring", false);
    ws.send(
      JSON.stringify({
        type: "session.configure",
        config: {
          language: els.language.value,
          level: els.level.value,
          scenario: els.scenario.value,
        },
        turnDetection: "manual",
        greet: true,
      }),
    );
    els.talkButton.disabled = false;
  });

  ws.addEventListener("close", () => {
    setStatus("Disconnected", false);
    els.talkButton.disabled = true;
  });
  ws.addEventListener("error", () => setStatus("Socket error", false));
  ws.addEventListener("message", handleServerEvent);
}

function handleServerEvent(message) {
  const event = JSON.parse(message.data);

  switch (event.type) {
    case "lpp.status":
      setStatus(event.status === "connected" ? `Live · ${event.model}` : event.status, event.status === "connected");
      return;
    case "lpp.error":
      appendMessage("assistant", `[error] ${event.message}`);
      return;
    case "lpp.session":
      appendMessage("assistant", `Mission: ${event.scenario.label} · ${event.difficulty.label} · ${event.language.label}`);
      if (event.scenario.userGoal) {
        appendMessage("assistant", `🎯 Your goal: ${event.scenario.userGoal} (convince them!)`);
      }
      return;
    case "lpp.correction":
      renderCorrection(event.correction);
      return;
    case "lpp.score":
      renderScore(event.score);
      return;
    case "lpp.goal":
      renderGoal(event.goal);
      return;
    case "lpp.translation":
      renderTranslation(event.translation);
      return;
    case "lpp.translation.error":
      appendMessage("assistant", `[translation unavailable] ${event.message}`);
      return;
    case "error":
      appendMessage("assistant", event.error?.message || "Realtime API error.");
      return;
    case "response.created":
      currentAssistant ||= appendMessage("assistant", "");
      if (event.response?.id) assistantMessagesByResponse.set(event.response.id, currentAssistant);
      return;
    case "response.output_text.delta":
      currentAssistant = getAssistantMessage(event.response_id);
      currentAssistant.textContent += event.delta || "";
      scrollTranscript();
      return;
    case "response.output_audio_transcript.delta":
      currentAssistant = getAssistantMessage(event.response_id);
      currentAssistant.textContent += event.delta || "";
      scrollTranscript();
      return;
    case "response.output_audio.delta":
      playPcm16(event.delta);
      return;
    case "conversation.item.input_audio_transcription.completed":
      if (event.transcript) appendMessage("user", event.transcript);
      return;
    case "response.done":
      currentAssistant = null;
      return;
    default:
      return;
  }
}

function onSubmitText(event) {
  event.preventDefault();
  const text = els.textInput.value.trim();
  if (!text || !isSocketReady()) return;
  appendMessage("user", text);
  els.textInput.value = "";
  currentAssistant = appendMessage("assistant", "");
  stopPlayback();
  ws.send(JSON.stringify({ type: "text", text }));
}

// ---- Coaching cards ---------------------------------------------------------

function renderCorrection(c) {
  const card = document.createElement("div");
  card.className = "card";
  card.innerHTML = `
    <span class="tag ${c.severity || "minor"}">${c.category || "note"} · ${c.severity || "minor"}</span>
    <div><span class="original">${escapeHtml(c.original || "")}</span> → <span class="correction">${escapeHtml(c.correction || "")}</span></div>
    <div class="explain">${escapeHtml(c.explanation || "")}</div>
    ${c.drill ? `<div class="explain">Drill: “${escapeHtml(c.drill)}”</div>` : ""}
  `;
  els.corrections.prepend(card);
}

function renderGoal(g) {
  setStatus("🎯 Goal reached!", true);
  const banner = document.createElement("article");
  banner.className = "message assistant goal";
  banner.innerHTML = `<strong>🎯 GOAL REACHED</strong><br>${escapeHtml(g.summary || "")}${
    g.winningLine ? `<div class="explain">Winning line: “${escapeHtml(g.winningLine)}”</div>` : ""
  }`;
  els.transcript.append(banner);
  scrollTranscript();
}

function renderScore(s) {
  const card = document.createElement("div");
  card.className = "card";
  card.innerHTML = `
    <span class="tag moderate">${s.scope || "turn"} · goal ${s.goalProgress ?? 0}%</span>
    <div class="score-grid">
      <span>Pronunciation <b>${s.pronunciation ?? "-"}</b></span>
      <span>Grammar <b>${s.grammar ?? "-"}</b></span>
      <span>Vocabulary <b>${s.vocabulary ?? "-"}</b></span>
      <span>Fluency <b>${s.fluency ?? "-"}</b></span>
    </div>
    ${s.highlight ? `<div class="explain">👍 ${escapeHtml(s.highlight)}</div>` : ""}
    ${s.focusNext ? `<div class="explain">Next: ${escapeHtml(s.focusNext)}</div>` : ""}
  `;
  els.scores.prepend(card);
}

function renderTranslation(t) {
  const target = assistantMessagesByResponse.get(t.responseId);
  if (!target || !t.text) return;

  const subtitle = document.createElement("div");
  subtitle.className = "translation";
  subtitle.textContent = t.text;
  target.append(subtitle);
  scrollTranscript();
}

// ---- Microphone (push-to-talk) ---------------------------------------------

async function startRecording() {
  if (isRecording || !isSocketReady()) return;
  try {
    micStream ||= await navigator.mediaDevices.getUserMedia({
      audio: { channelCount: 1, echoCancellation: true, noiseSuppression: true, autoGainControl: true },
    });
  } catch {
    appendMessage("assistant", "Microphone permission needed. Text input still works.");
    return;
  }

  inputContext ||= new AudioContext();
  await inputContext.resume();

  isRecording = true;
  els.talkButton.classList.add("recording");
  els.talkLabel.textContent = "Listening";
  stopPlayback();
  ws.send(JSON.stringify({ type: "audio.start" }));

  source = inputContext.createMediaStreamSource(micStream);
  processor = inputContext.createScriptProcessor(4096, 1, 1);
  processor.onaudioprocess = (event) => {
    if (!isRecording || !isSocketReady()) return;
    const input = event.inputBuffer.getChannelData(0);
    const resampled = resample(input, inputContext.sampleRate, PCM_RATE);
    ws.send(JSON.stringify({ type: "audio.chunk", audio: pcm16ToBase64(resampled) }));
  };
  source.connect(processor);
  processor.connect(inputContext.destination);
}

function stopRecording() {
  if (!isRecording) return;
  isRecording = false;
  els.talkButton.classList.remove("recording");
  els.talkLabel.textContent = "Hold to talk";

  if (processor) {
    processor.disconnect();
    processor.onaudioprocess = null;
    processor = null;
  }
  if (source) {
    source.disconnect();
    source = null;
  }
  if (isSocketReady()) {
    currentAssistant = appendMessage("assistant", "");
    ws.send(JSON.stringify({ type: "audio.stop" }));
  }
}

// ---- Rendering + audio helpers ---------------------------------------------

function appendMessage(role, text) {
  const article = document.createElement("article");
  article.className = `message ${role}`;
  article.textContent = text;
  els.transcript.append(article);
  scrollTranscript();
  return article;
}

function getAssistantMessage(responseId) {
  if (responseId && assistantMessagesByResponse.has(responseId)) {
    return assistantMessagesByResponse.get(responseId);
  }

  currentAssistant ||= appendMessage("assistant", "");
  if (responseId) assistantMessagesByResponse.set(responseId, currentAssistant);
  return currentAssistant;
}

function scrollTranscript() {
  els.transcript.scrollTop = els.transcript.scrollHeight;
}

function setStatus(text, live) {
  els.statusText.textContent = text;
  els.status.classList.toggle("is-live", live);
}

function isSocketReady() {
  return ws?.readyState === WebSocket.OPEN;
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (ch) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
  })[ch]);
}

function resample(input, fromRate, toRate) {
  if (fromRate === toRate) return input;
  const ratio = fromRate / toRate;
  const length = Math.round(input.length / ratio);
  const output = new Float32Array(length);
  for (let i = 0; i < length; i += 1) {
    const start = Math.floor(i * ratio);
    const end = Math.min(Math.floor((i + 1) * ratio), input.length);
    let sum = 0;
    for (let j = start; j < end; j += 1) sum += input[j];
    output[i] = sum / Math.max(1, end - start);
  }
  return output;
}

function pcm16ToBase64(float32Array) {
  const buffer = new ArrayBuffer(float32Array.length * 2);
  const view = new DataView(buffer);
  for (let i = 0; i < float32Array.length; i += 1) {
    const sample = Math.max(-1, Math.min(1, float32Array[i]));
    view.setInt16(i * 2, sample < 0 ? sample * 0x8000 : sample * 0x7fff, true);
  }
  const bytes = new Uint8Array(buffer);
  let binary = "";
  const chunkSize = 0x8000;
  for (let i = 0; i < bytes.length; i += chunkSize) {
    binary += String.fromCharCode(...bytes.subarray(i, i + chunkSize));
  }
  return btoa(binary);
}

async function playPcm16(base64Audio) {
  outputContext ||= new AudioContext({ sampleRate: PCM_RATE });
  await outputContext.resume();

  const bytes = Uint8Array.from(atob(base64Audio), (char) => char.charCodeAt(0));
  const samples = new Float32Array(bytes.length / 2);
  const view = new DataView(bytes.buffer);
  for (let i = 0; i < samples.length; i += 1) {
    samples[i] = view.getInt16(i * 2, true) / 0x8000;
  }

  const buffer = outputContext.createBuffer(1, samples.length, PCM_RATE);
  buffer.copyToChannel(samples, 0);
  const playback = outputContext.createBufferSource();
  playback.buffer = buffer;
  playback.connect(outputContext.destination);

  const startAt = Math.max(outputContext.currentTime, nextPlayTime);
  playback.start(startAt);
  nextPlayTime = startAt + buffer.duration;
  activeSources.push(playback);
  playback.onended = () => {
    activeSources = activeSources.filter((node) => node !== playback);
  };
}

function stopPlayback() {
  for (const node of activeSources) {
    try {
      node.stop();
    } catch {
      // already stopped
    }
  }
  activeSources = [];
  if (outputContext) nextPlayTime = outputContext.currentTime;
}
