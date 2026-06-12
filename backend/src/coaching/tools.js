// Realtime function tools the coach uses to emit structured coaching data
// alongside its spoken reply. The backend captures these calls and forwards
// them to the client as `lpp.correction` / `lpp.score` events.

export const CORRECTION_TOOL_NAME = "record_correction";
export const SCORE_TOOL_NAME = "score_turn";
export const GOAL_TOOL_NAME = "goal_reached";

export const COACHING_TOOLS = [
  {
    type: "function",
    name: CORRECTION_TOOL_NAME,
    description:
      "Log a concrete correction whenever the learner makes a grammar, pronunciation, vocabulary, or fluency mistake. Call this in the same turn you speak the correction. Do not call it for flawless turns.",
    parameters: {
      type: "object",
      properties: {
        category: {
          type: "string",
          enum: ["pronunciation", "grammar", "vocabulary", "fluency"],
          description: "The kind of mistake.",
        },
        severity: {
          type: "string",
          enum: ["minor", "moderate", "major"],
          description: "How much the mistake affects being understood.",
        },
        original: {
          type: "string",
          description: "What the learner actually said (verbatim, in the target language).",
        },
        correction: {
          type: "string",
          description: "The corrected version in the target language.",
        },
        explanation: {
          type: "string",
          description: "A short explanation in the learner's base language (one sentence).",
        },
        drill: {
          type: "string",
          description: "An optional short phrase the learner should repeat to practice the fix.",
        },
      },
      required: ["category", "severity", "original", "correction", "explanation"],
    },
  },
  {
    type: "function",
    name: SCORE_TOOL_NAME,
    description:
      "Score the learner's performance. Call this at a natural checkpoint and again when the mission goal is reached, to drive progress, streaks, and the end-of-session recap.",
    parameters: {
      type: "object",
      properties: {
        scope: {
          type: "string",
          enum: ["turn", "checkpoint", "session"],
          description: "Whether this scores a single turn, a checkpoint, or the whole session.",
        },
        pronunciation: { type: "integer", minimum: 0, maximum: 100 },
        grammar: { type: "integer", minimum: 0, maximum: 100 },
        vocabulary: { type: "integer", minimum: 0, maximum: 100 },
        fluency: { type: "integer", minimum: 0, maximum: 100 },
        goalProgress: {
          type: "integer",
          minimum: 0,
          maximum: 100,
          description: "Percent of the mission goal the learner has accomplished.",
        },
        highlight: {
          type: "string",
          description: "One thing the learner did well, in their base language.",
        },
        focusNext: {
          type: "string",
          description: "The single most useful thing to practice next, in their base language.",
        },
      },
      required: ["scope", "pronunciation", "grammar", "vocabulary", "fluency", "goalProgress"],
    },
  },
  {
    type: "function",
    name: GOAL_TOOL_NAME,
    description:
      "Call this the MOMENT the learner has genuinely convinced you and the mission goal is truly met — and not a moment before. You are playing a character who does not give in easily, so only fire this once the learner has actually earned it. Never mention this tool or the goal to the learner.",
    parameters: {
      type: "object",
      properties: {
        summary: {
          type: "string",
          description: "One short sentence, in the learner's base language, on how they convinced you / achieved the goal.",
        },
        winningLine: {
          type: "string",
          description: "The specific thing the learner said that tipped you over, quoted in the target language.",
        },
      },
      required: ["summary"],
    },
  },
];

export const isCoachingTool = (name) =>
  name === CORRECTION_TOOL_NAME || name === SCORE_TOOL_NAME || name === GOAL_TOOL_NAME;
