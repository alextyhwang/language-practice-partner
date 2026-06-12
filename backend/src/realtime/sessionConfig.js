import { config } from "../config.js";
import { buildInstructions } from "../coaching/instructions.js";
import { COACHING_TOOLS } from "../coaching/tools.js";

const PCM_RATE = 24000;
const VALID_VOICES = new Set(["marin", "cedar", "alloy", "echo", "shimmer", "verse"]);
const VALID_EFFORT = new Set(["low", "medium", "high"]);

const resolveVoice = (requested) =>
  requested && VALID_VOICES.has(requested) ? requested : config.defaultVoice;

const resolveEffort = (requested) =>
  requested && VALID_EFFORT.has(requested) ? requested : "low";

// Build the `session.update` payload for a GA Realtime voice-agent session,
// tuned for the resolved coaching context.
export const buildSessionUpdate = (context, options = {}) => {
  const voice = resolveVoice(options.voice);
  const reasoningEffort = resolveEffort(options.reasoningEffort);

  // Server-side VAD lets the coach detect turn boundaries automatically; the
  // client can disable it for explicit push-to-talk.
  const turnDetection =
    options.turnDetection === "manual"
      ? null
      : { type: "semantic_vad" };

  return {
    type: "session.update",
    session: {
      type: "realtime",
      model: config.model,
      output_modalities: ["audio", "text"],
      instructions: buildInstructions(context),
      reasoning: { effort: reasoningEffort },
      tools: COACHING_TOOLS,
      tool_choice: "auto",
      audio: {
        input: {
          format: { type: "audio/pcm", rate: PCM_RATE },
          turn_detection: turnDetection,
          transcription: { model: "gpt-realtime-whisper" },
        },
        output: {
          format: { type: "audio/pcm", rate: PCM_RATE },
          voice,
        },
      },
    },
  };
};

export const PCM_SAMPLE_RATE = PCM_RATE;
