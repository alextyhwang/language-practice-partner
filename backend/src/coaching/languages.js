// Target languages a learner can practice. `nativeName` is shown in-product;
// `coachVoiceHint` nudges the Realtime voice toward a natural accent.
export const LANGUAGES = [
  { id: "es", label: "Spanish", nativeName: "Español", locale: "es-ES", coachVoiceHint: "Castilian or neutral Latin American Spanish" },
  { id: "fr", label: "French", nativeName: "Français", locale: "fr-FR", coachVoiceHint: "standard metropolitan French" },
  { id: "de", label: "German", nativeName: "Deutsch", locale: "de-DE", coachVoiceHint: "standard High German" },
  { id: "it", label: "Italian", nativeName: "Italiano", locale: "it-IT", coachVoiceHint: "standard Italian" },
  { id: "pt", label: "Portuguese", nativeName: "Português", locale: "pt-BR", coachVoiceHint: "Brazilian Portuguese" },
  { id: "ja", label: "Japanese", nativeName: "日本語", locale: "ja-JP", coachVoiceHint: "standard Tokyo Japanese" },
  { id: "ko", label: "Korean", nativeName: "한국어", locale: "ko-KR", coachVoiceHint: "standard Seoul Korean" },
  { id: "zh", label: "Mandarin Chinese", nativeName: "中文", locale: "zh-CN", coachVoiceHint: "standard Mainland Mandarin" },
  { id: "en", label: "English", nativeName: "English", locale: "en-US", coachVoiceHint: "neutral North American English" },
];

const LANGUAGE_BY_ID = new Map(LANGUAGES.map((language) => [language.id, language]));

export const DEFAULT_LANGUAGE_ID = "es";
export const DEFAULT_BASE_LANGUAGE = "English";

export const getLanguage = (id) => LANGUAGE_BY_ID.get(id) || LANGUAGE_BY_ID.get(DEFAULT_LANGUAGE_ID);

// CEFR-aligned proficiency levels used to scale vocabulary and pace.
export const PROFICIENCY_LEVELS = [
  { id: "A1", label: "Beginner", guidance: "Use only the most common words and very short sentences of a few words. Speak slowly, one simple idea at a time. Avoid idioms, slang, and rare vocabulary." },
  { id: "A2", label: "Elementary", guidance: "Use simple everyday vocabulary and short connected sentences." },
  { id: "B1", label: "Intermediate", guidance: "Use common vocabulary and natural sentences at a relaxed pace." },
  { id: "B2", label: "Upper-Intermediate", guidance: "Use varied vocabulary and idioms at a near-natural pace." },
  { id: "C1", label: "Advanced", guidance: "Use rich, nuanced, natural language at full conversational pace." },
];

const LEVEL_BY_ID = new Map(PROFICIENCY_LEVELS.map((level) => [level.id, level]));

export const DEFAULT_LEVEL_ID = "A1";

export const getLevel = (id) => LEVEL_BY_ID.get(id) || LEVEL_BY_ID.get(DEFAULT_LEVEL_ID);
