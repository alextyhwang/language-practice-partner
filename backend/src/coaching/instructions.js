import { DEFAULT_BASE_LANGUAGE, getLanguage, getLevel } from "./languages.js";
import { getMode } from "./modes.js";
import { getScenario } from "./scenarios.js";
import { CORRECTION_TOOL_NAME, SCORE_TOOL_NAME } from "./tools.js";

// Resolve a raw client request into a fully-validated coaching context.
export const resolveCoachingContext = (request = {}) => {
  const language = getLanguage(request.language);
  const level = getLevel(request.level);
  const mode = getMode(request.mode);
  const scenario = getScenario(request.scenario);
  const baseLanguage =
    typeof request.baseLanguage === "string" && request.baseLanguage.trim()
      ? request.baseLanguage.trim()
      : DEFAULT_BASE_LANGUAGE;

  return { language, level, mode, scenario, baseLanguage };
};

// Compose the Realtime system instructions for a coaching session.
export const buildInstructions = (context) => {
  const { language, level, mode, scenario, baseLanguage } = context;

  return [
    `You are the Language Practice Partner, a live speaking coach helping a learner practice ${language.label} (${language.nativeName}).`,
    `The learner's base language is ${baseLanguage}. Speak ${language.label} by default with a ${language.coachVoiceHint} accent; only use ${baseLanguage} for brief, essential explanations.`,
    `The learner's level is ${level.id} (${level.label}). ${level.guidance}`,
    "",
    `# Coaching mode: ${mode.label}`,
    ...mode.behavior.map((line) => `- ${line}`),
    "",
    `# Mission: ${scenario.label}`,
    `- Setting: ${scenario.setting}`,
    `- You play the role of ${scenario.coachRole}. Stay in character.`,
    `- The learner's goal: ${scenario.goal}`,
    `- ${scenario.starter}`,
    "",
    "# How to coach",
    "- Keep your spoken turns short so the learner does most of the talking.",
    "- Stay in the roleplay, but you are also their coach: weave in corrections naturally.",
    `- Whenever the learner makes a mistake, call the ${CORRECTION_TOOL_NAME} tool in the same turn to log a structured correction card. Do not log corrections for flawless turns.`,
    `- Call the ${SCORE_TOOL_NAME} tool at natural checkpoints and once when the mission goal is reached, so the app can show progress and an end-of-session recap.`,
    "- Tool calls are silent telemetry for the app UI; never read tool arguments aloud or mention the tools to the learner.",
    "- If the learner is silent or stuck, gently prompt them with an easier question.",
    "- If audio is unclear, ask them to repeat rather than guessing.",
  ].join("\n");
};

// Short greeting prompt used to kick off the session with the coach speaking first.
export const buildOpeningPrompt = (context) =>
  `Begin the mission now. In ${context.language.label}, ${context.scenario.starter} Keep it to one or two sentences.`;
