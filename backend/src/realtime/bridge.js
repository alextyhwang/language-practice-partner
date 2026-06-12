import WebSocket from "ws";

import { config } from "../config.js";
import { resolveCoachingContext, buildOpeningPrompt } from "../coaching/instructions.js";
import {
  CORRECTION_TOOL_NAME,
  SCORE_TOOL_NAME,
  isCoachingTool,
} from "../coaching/tools.js";
import { buildSessionUpdate } from "./sessionConfig.js";

// Bridges one browser WebSocket to one OpenAI Realtime WebSocket.
// The browser never sees the OpenAI key; the backend owns the upstream socket,
// injects coaching session config, and translates coaching tool calls into
// structured `lpp.*` events.
export class RealtimeBridge {
  constructor(browserWs, { safetyIdentifier } = {}) {
    this.browserWs = browserWs;
    this.safetyIdentifier = safetyIdentifier || "lpp-anon";
    this.openaiWs = null;
    this.pendingUpstream = [];
    this.activeResponse = false;
    this.handledCalls = new Set();
    this.context = null;
    this.options = {};
    this.closed = false;
  }

  start() {
    this.sendClient({ type: "lpp.status", status: "awaiting_config" });

    this.browserWs.on("message", (raw) => this.handleClientMessage(raw));
    this.browserWs.on("close", () => this.dispose());
    this.browserWs.on("error", () => this.dispose());
  }

  // ---- Client (browser) -> backend ----------------------------------------

  handleClientMessage(raw) {
    let event;
    try {
      event = JSON.parse(raw.toString());
    } catch {
      this.sendClient({ type: "lpp.error", message: "Client sent invalid JSON." });
      return;
    }

    switch (event.type) {
      case "session.configure":
        this.configureSession(event);
        return;
      case "text":
        this.sendUserText(event.text);
        return;
      case "audio.start":
        this.beginUserAudio();
        return;
      case "audio.chunk":
        if (event.audio) this.sendUpstream({ type: "input_audio_buffer.append", audio: event.audio });
        return;
      case "audio.stop":
        this.commitUserAudio();
        return;
      case "response.cancel":
        if (this.activeResponse) this.sendUpstream({ type: "response.cancel" });
        return;
      default:
        this.sendClient({ type: "lpp.error", message: `Unknown client event: ${event.type}` });
    }
  }

  configureSession(event) {
    this.context = resolveCoachingContext(event.config || event);
    this.options = {
      voice: event.voice,
      reasoningEffort: event.reasoningEffort,
      turnDetection: event.turnDetection,
      greet: event.greet !== false,
    };

    this.sendClient({
      type: "lpp.session",
      model: config.model,
      language: this.context.language,
      level: this.context.level,
      mode: this.context.mode,
      scenario: this.context.scenario,
      baseLanguage: this.context.baseLanguage,
    });

    if (!this.openaiWs) {
      this.connectUpstream();
    } else {
      this.applySessionConfig();
    }
  }

  sendUserText(text) {
    const value = String(text || "").trim();
    if (!value) return;
    this.sendUpstream({
      type: "conversation.item.create",
      item: {
        type: "message",
        role: "user",
        content: [{ type: "input_text", text: value }],
      },
    });
    this.sendUpstream({ type: "response.create" });
  }

  beginUserAudio() {
    if (this.activeResponse) this.sendUpstream({ type: "response.cancel" });
    this.sendUpstream({ type: "input_audio_buffer.clear" });
  }

  commitUserAudio() {
    this.sendUpstream({ type: "input_audio_buffer.commit" });
    // With manual turn detection the client drives the response boundary.
    if (this.options.turnDetection === "manual") {
      this.sendUpstream({ type: "response.create" });
    }
  }

  // ---- Backend -> OpenAI ----------------------------------------------------

  connectUpstream() {
    if (!config.apiKey) {
      this.sendClient({
        type: "lpp.error",
        message: "Server is missing OPENAI_API_KEY.",
      });
      this.browserWs.close(1011, "Missing OPENAI_API_KEY");
      return;
    }

    const url = `${config.realtimeUrl}?model=${encodeURIComponent(config.model)}`;
    this.openaiWs = new WebSocket(url, {
      headers: {
        Authorization: `Bearer ${config.apiKey}`,
        "OpenAI-Safety-Identifier": this.safetyIdentifier,
      },
    });

    this.openaiWs.on("open", () => {
      this.sendClient({ type: "lpp.status", status: "connected", model: config.model });
      this.applySessionConfig();
      this.flushPending();
    });

    this.openaiWs.on("message", (message) => this.handleUpstreamMessage(message));

    this.openaiWs.on("error", (error) => {
      this.sendClient({ type: "lpp.error", message: `Realtime connection error: ${error.message}` });
    });

    this.openaiWs.on("close", (code, reason) => {
      this.sendClient({
        type: "lpp.status",
        status: "closed",
        code,
        reason: reason?.toString() || "",
      });
      if (this.browserWs.readyState === WebSocket.OPEN) this.browserWs.close();
    });
  }

  applySessionConfig() {
    if (!this.context) return;
    this.sendUpstream(buildSessionUpdate(this.context, this.options));
    if (this.options.greet) {
      this.sendUpstream({
        type: "response.create",
        response: { instructions: buildOpeningPrompt(this.context) },
      });
    }
  }

  sendUpstream(event) {
    const payload = JSON.stringify(event);
    if (this.openaiWs && this.openaiWs.readyState === WebSocket.OPEN) {
      this.openaiWs.send(payload);
    } else {
      this.pendingUpstream.push(payload);
    }
  }

  flushPending() {
    while (this.pendingUpstream.length > 0) {
      this.openaiWs.send(this.pendingUpstream.shift());
    }
  }

  // ---- OpenAI -> backend -> client -----------------------------------------

  handleUpstreamMessage(message) {
    const text = message.toString();
    let event;
    try {
      event = JSON.parse(text);
    } catch {
      // Forward anything non-JSON verbatim.
      this.forwardRaw(text);
      return;
    }

    if (event.type === "response.created") this.activeResponse = true;
    if (
      event.type === "response.done" ||
      event.type === "response.cancelled" ||
      event.type === "response.failed"
    ) {
      this.activeResponse = false;
    }

    if (event.type === "response.done") {
      this.handleCompletedResponse(event.response);
    }

    // Forward the raw Realtime event so the client can render transcripts/audio.
    this.forwardRaw(text);
  }

  handleCompletedResponse(response) {
    const output = response?.output;
    if (!Array.isArray(output)) return;

    for (const item of output) {
      if (item?.type !== "function_call") continue;
      if (this.handledCalls.has(item.call_id)) continue;
      this.handledCalls.add(item.call_id);
      this.handleToolCall(item);
    }
  }

  handleToolCall(item) {
    if (!isCoachingTool(item.name)) return;

    let args = {};
    try {
      args = item.arguments ? JSON.parse(item.arguments) : {};
    } catch {
      args = {};
    }

    if (item.name === CORRECTION_TOOL_NAME) {
      this.sendClient({ type: "lpp.correction", correction: args });
    } else if (item.name === SCORE_TOOL_NAME) {
      this.sendClient({ type: "lpp.score", score: args });
    }

    // Acknowledge the tool call so the conversation item is resolved. These
    // tools are telemetry only, so we do not trigger a follow-up response.
    this.sendUpstream({
      type: "conversation.item.create",
      item: {
        type: "function_call_output",
        call_id: item.call_id,
        output: JSON.stringify({ ok: true }),
      },
    });
  }

  // ---- Helpers --------------------------------------------------------------

  forwardRaw(text) {
    if (this.browserWs.readyState === WebSocket.OPEN) this.browserWs.send(text);
  }

  sendClient(data) {
    if (this.browserWs.readyState === WebSocket.OPEN) {
      this.browserWs.send(JSON.stringify(data));
    }
  }

  dispose() {
    if (this.closed) return;
    this.closed = true;
    if (
      this.openaiWs &&
      (this.openaiWs.readyState === WebSocket.OPEN ||
        this.openaiWs.readyState === WebSocket.CONNECTING)
    ) {
      this.openaiWs.close();
    }
  }
}
