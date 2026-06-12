export type CoachingMode = "strict" | "friendly" | "interviewer";

export type CorrectionType =
  | "pronunciation"
  | "grammar"
  | "vocabulary"
  | "fluency";

export type Speaker = "user" | "partner";

export type SessionPhase =
  | "listening"
  | "speaking"
  | "processing"
  | "correcting"
  | "idle";

export type NpcMood = "neutral" | "happy" | "thinking" | "surprised" | "welcoming";

export type SceneType = "tavern" | "street" | "shop" | "hotel-desk" | "hotel-concierge";

export type SpriteType = "server" | "passerby" | "clerk" | "receptionist" | "concierge" | "player";

export interface NpcCharacter {
  name: string;
  nameChinese: string;
  role: string;
  emoji: string;
  sprite: SpriteType;
  imageSrc?: string;
  scene: SceneType;
  /** @deprecated use sprite/scene instead */
  frameFrom: string;
  /** @deprecated use sprite/scene instead */
  frameTo: string;
  /** @deprecated use sprite/scene instead */
  accent: string;
}

/** Maps a presentation scenario to the backend coaching session config. */
export interface BackendSessionConfig {
  /** Backend scenario id (see backend/src/coaching/scenarios.js). */
  scenario: string;
  /** Backend language id (see backend/src/coaching/languages.js). */
  language: string;
  /** Backend CEFR level id (A1–C1). */
  level: string;
}

export interface Scenario {
  id: string;
  title: string;
  description: string;
  icon: string;
  language: string;
  location: string;
  locationBadge: string;
  goals: string[];
  npc: NpcCharacter;
  /** Stars earned out of 3 (mock) */
  starsEarned: number;
  difficulty: "easy" | "medium" | "hard";
  /** Backend realtime session config this mission maps to. */
  backend: BackendSessionConfig;
}

export interface TranscriptTurn {
  id: string;
  speaker: Speaker;
  text: string;
  translation?: string;
  timestamp: number;
  isRetry?: boolean;
}

export interface Correction {
  id: string;
  type: CorrectionType;
  original: string;
  suggestion: string;
  explanation: string;
  turnId: string;
}

export interface PlayerStats {
  level: number;
  xp: number;
  xpToNext: number;
  coins: number;
  streak: number;
}

export interface SessionState {
  scenario: Scenario;
  coachingMode: CoachingMode;
  phase: SessionPhase;
  elapsedSeconds: number;
  goalProgress: number;
  currentGoalIndex: number;
  transcript: TranscriptTurn[];
  corrections: Correction[];
  activeCorrectionId: string | null;
  isMicActive: boolean;
  partnerSpeaking: boolean;
}
