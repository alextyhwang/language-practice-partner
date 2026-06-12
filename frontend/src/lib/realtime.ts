// Browser realtime client for the Language Practice Partner backend.
//
// The browser connects only to the local backend at `/realtime` (proxied by
// Vite to the Node backend, which owns the OpenAI key). This client captures
// push-to-talk microphone audio as 24 kHz PCM16, streams it up, plays back the
// agent's audio, and surfaces the backend's raw + `lpp.*` events via handlers.

const PCM_RATE = 24000;

export interface SessionConfig {
  language: string;
  level: string;
  scenario: string;
}

export interface RealtimeHandlers {
  onStatus?: (status: string, model?: string) => void;
  onError?: (message: string) => void;
  onSession?: (session: unknown) => void;
  onResponseStarted?: () => void;
  onResponseDone?: () => void;
  onPartnerTranscriptDelta?: (delta: string, responseId: string) => void;
  onUserTranscript?: (text: string) => void;
  onCorrection?: (correction: Record<string, unknown>) => void;
  onScore?: (score: Record<string, unknown>) => void;
  onGoal?: (goal: Record<string, unknown>) => void;
  onTranslation?: (translation: Record<string, unknown>) => void;
  onHint?: (hint: Record<string, unknown>) => void;
}

export class RealtimeClient {
  private ws: WebSocket | null = null;
  private handlers: RealtimeHandlers;
  private closing = false;

  // Mic capture
  private micStream: MediaStream | null = null;
  private inputCtx: AudioContext | null = null;
  private source: MediaStreamAudioSourceNode | null = null;
  private processor: ScriptProcessorNode | null = null;
  private recording = false;

  // Playback
  private outputCtx: AudioContext | null = null;
  private nextPlayTime = 0;
  private activeSources: AudioBufferSourceNode[] = [];

  constructor(handlers: RealtimeHandlers = {}) {
    this.handlers = handlers;
  }

  connect(config: SessionConfig, options: { greet?: boolean } = {}): void {
    this.closing = false;
    const protocol = window.location.protocol === "https:" ? "wss" : "ws";
    this.ws = new WebSocket(`${protocol}://${window.location.host}/realtime`);

    this.ws.addEventListener("open", () => {
      this.send({
        type: "session.configure",
        config,
        turnDetection: "manual",
        greet: options.greet !== false,
      });
    });
    this.ws.addEventListener("message", (event) => this.handleMessage(event));
    // Socket-level errors/closes are noisy and expected during teardown
    // (e.g. React StrictMode double-mount). Don't surface them as user-facing
    // errors; only meaningful backend `lpp.error` events go to onError.
    this.ws.addEventListener("error", () => {
      if (!this.closing) console.warn("[realtime] socket error");
    });
    this.ws.addEventListener("close", () => {
      if (!this.closing) this.handlers.onStatus?.("closed");
    });
  }

  private handleMessage(event: MessageEvent): void {
    let data: any;
    try {
      data = JSON.parse(event.data);
    } catch {
      return;
    }

    switch (data.type) {
      case "lpp.status":
        this.handlers.onStatus?.(data.status, data.model);
        return;
      case "lpp.error":
        this.handlers.onError?.(data.message);
        return;
      case "lpp.session":
        this.handlers.onSession?.(data);
        return;
      case "lpp.correction":
        this.handlers.onCorrection?.(data.correction ?? {});
        return;
      case "lpp.score":
        this.handlers.onScore?.(data.score ?? {});
        return;
      case "lpp.goal":
        this.handlers.onGoal?.(data.goal ?? {});
        return;
      case "lpp.translation":
        this.handlers.onTranslation?.(data.translation ?? {});
        return;
      case "lpp.hint":
        this.handlers.onHint?.(data.hint ?? {});
        return;
      case "response.created":
        this.handlers.onResponseStarted?.();
        return;
      case "response.output_audio_transcript.delta":
        this.handlers.onPartnerTranscriptDelta?.(data.delta ?? "", data.response_id ?? "live");
        return;
      case "response.output_audio.delta":
        void this.playPcm16(data.delta);
        return;
      case "conversation.item.input_audio_transcription.completed":
        if (data.transcript) this.handlers.onUserTranscript?.(data.transcript);
        return;
      case "response.done":
        this.handlers.onResponseDone?.();
        return;
      default:
        return;
    }
  }

  sendText(text: string): void {
    const value = text.trim();
    if (!value) return;
    this.stopPlayback();
    this.send({ type: "text", text: value });
  }

  isOpen(): boolean {
    return this.ws?.readyState === WebSocket.OPEN;
  }

  async startMic(): Promise<boolean> {
    if (this.recording || !this.isOpen()) return false;

    try {
      if (!this.micStream) {
        this.micStream = await navigator.mediaDevices.getUserMedia({
          audio: {
            channelCount: 1,
            echoCancellation: true,
            noiseSuppression: true,
            autoGainControl: true,
          },
        });
      }
    } catch {
      this.handlers.onError?.("Microphone permission is required to speak.");
      return false;
    }

    if (!this.inputCtx) this.inputCtx = new AudioContext();
    await this.inputCtx.resume();

    this.recording = true;
    this.stopPlayback();
    this.send({ type: "audio.start" });

    this.source = this.inputCtx.createMediaStreamSource(this.micStream);
    this.processor = this.inputCtx.createScriptProcessor(4096, 1, 1);
    this.processor.onaudioprocess = (e) => {
      if (!this.recording || !this.isOpen()) return;
      const input = e.inputBuffer.getChannelData(0);
      const resampled = resample(input, this.inputCtx!.sampleRate, PCM_RATE);
      this.send({ type: "audio.chunk", audio: pcm16ToBase64(resampled) });
    };
    this.source.connect(this.processor);
    this.processor.connect(this.inputCtx.destination);
    return true;
  }

  stopMic(): void {
    if (!this.recording) return;
    this.recording = false;

    if (this.processor) {
      this.processor.disconnect();
      this.processor.onaudioprocess = null;
      this.processor = null;
    }
    if (this.source) {
      this.source.disconnect();
      this.source = null;
    }
    if (this.isOpen()) this.send({ type: "audio.stop" });
  }

  close(): void {
    this.closing = true;
    this.stopMic();
    this.stopPlayback();
    this.micStream?.getTracks().forEach((t) => t.stop());
    this.micStream = null;
    void this.inputCtx?.close();
    this.inputCtx = null;
    void this.outputCtx?.close();
    this.outputCtx = null;
    if (this.ws && (this.ws.readyState === WebSocket.OPEN || this.ws.readyState === WebSocket.CONNECTING)) {
      this.ws.close();
    }
    this.ws = null;
  }

  private send(payload: unknown): void {
    if (this.isOpen()) this.ws!.send(JSON.stringify(payload));
  }

  private async playPcm16(base64Audio: string): Promise<void> {
    if (!base64Audio) return;
    if (!this.outputCtx) this.outputCtx = new AudioContext({ sampleRate: PCM_RATE });
    await this.outputCtx.resume();

    const bytes = Uint8Array.from(atob(base64Audio), (c) => c.charCodeAt(0));
    const samples = new Float32Array(bytes.length / 2);
    const view = new DataView(bytes.buffer);
    for (let i = 0; i < samples.length; i += 1) {
      samples[i] = view.getInt16(i * 2, true) / 0x8000;
    }

    const buffer = this.outputCtx.createBuffer(1, samples.length, PCM_RATE);
    buffer.copyToChannel(samples, 0);
    const playback = this.outputCtx.createBufferSource();
    playback.buffer = buffer;
    playback.connect(this.outputCtx.destination);

    const startAt = Math.max(this.outputCtx.currentTime, this.nextPlayTime);
    playback.start(startAt);
    this.nextPlayTime = startAt + buffer.duration;
    this.activeSources.push(playback);
    playback.onended = () => {
      this.activeSources = this.activeSources.filter((s) => s !== playback);
    };
  }

  private stopPlayback(): void {
    for (const node of this.activeSources) {
      try {
        node.stop();
      } catch {
        // already stopped
      }
    }
    this.activeSources = [];
    if (this.outputCtx) this.nextPlayTime = this.outputCtx.currentTime;
  }
}

function resample(input: Float32Array, fromRate: number, toRate: number): Float32Array {
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

function pcm16ToBase64(float32Array: Float32Array): string {
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
