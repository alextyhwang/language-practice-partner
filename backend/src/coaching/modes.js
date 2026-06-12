// Coaching modes control the FEEDBACK style only — how often and how firmly the
// agent corrects the learner. They do NOT change who the agent is: the agent
// always stays in character as the scenario's counterpart (see instructions.js).
// `behavior` lines are injected verbatim into the Realtime system instructions.
export const COACHING_MODES = [
  {
    id: "strict_teacher",
    label: "Strict teacher",
    summary: "Frequent corrections, pronunciation drills, repeat-until-clear practice.",
    correctionDensity: "high",
    behavior: [
      "Hold a high bar: log corrections frequently, as soon as mistakes happen.",
      "When pronunciation is unclear, ask the learner to repeat the word or phrase until it is clear — you can do this in character.",
      "Don't let important grammar or word-choice mistakes slide.",
    ],
  },
  {
    id: "travel_buddy",
    label: "Friendly travel buddy",
    summary: "Natural roleplay with gentle feedback and confidence-building.",
    correctionDensity: "low",
    behavior: [
      "Keep the conversation flowing; only react to mistakes that block understanding.",
      "Model the better phrasing naturally in your own reply rather than stopping to correct.",
      "Be encouraging and save minor corrections for the telemetry, not the dialogue.",
    ],
  },
  {
    id: "interviewer",
    label: "Interviewer",
    summary: "Feedback focused on clarity, structure, and fluency.",
    correctionDensity: "medium",
    behavior: [
      "Give feedback on clarity, structure, and fluency, not only grammar.",
      "Keep your own turns concise so the learner does most of the speaking.",
      "Track recurring issues and log them at natural checkpoints.",
    ],
  },
];

const MODE_BY_ID = new Map(COACHING_MODES.map((mode) => [mode.id, mode]));

export const DEFAULT_MODE_ID = "travel_buddy";

export const getMode = (id) => MODE_BY_ID.get(id) || MODE_BY_ID.get(DEFAULT_MODE_ID);
