// Difficulty is an intrinsic property of each scenario (not a user choice). It
// scales how challenging the agent makes the interaction. Feedback intensity is
// constant across the app (see instructions.js); difficulty is the axis that
// varies, per mission.
export const DIFFICULTIES = [
  {
    id: "easy",
    label: "Easy",
    description: "Short, predictable exchanges with common phrases and clear goals.",
    guidance:
      "Keep the exchange short and predictable. Use common, high-frequency phrases, stay on a clear path, and let the learner reach the goal in a few well-formed turns. Apply only light friction.",
  },
  {
    id: "medium",
    label: "Medium",
    description: "Multi-turn conversations that require improvisation or persuasion.",
    guidance:
      "Make this a multi-turn conversation that requires real improvisation or persuasion. Introduce a complication and don't concede the goal until the learner adapts and convinces you.",
  },
  {
    id: "hard",
    label: "Hard",
    description:
      "High-stakes or open-ended situations with formal language, nuance, or problem-solving under pressure.",
    guidance:
      "Make this high-stakes and open-ended. Use more formal language and nuance, raise problems that demand problem-solving under pressure, and hold a high bar before the goal is reached.",
  },
];

const DIFFICULTY_BY_ID = new Map(DIFFICULTIES.map((difficulty) => [difficulty.id, difficulty]));

export const DEFAULT_DIFFICULTY_ID = "easy";

export const getDifficulty = (id) =>
  DIFFICULTY_BY_ID.get(id) || DIFFICULTY_BY_ID.get(DEFAULT_DIFFICULTY_ID);
