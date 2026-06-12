import "dotenv/config";

const parseOrigins = (raw) => {
  if (!raw || raw.trim() === "" || raw.trim() === "*") return "*";
  return raw
    .split(",")
    .map((value) => value.trim())
    .filter(Boolean);
};

export const config = {
  port: Number(process.env.PORT || 8787),
  apiKey: process.env.OPENAI_API_KEY || "",
  model: process.env.OPENAI_REALTIME_MODEL || "gpt-realtime-2",
  realtimeUrl: process.env.OPENAI_REALTIME_URL || "wss://api.openai.com/v1/realtime",
  responsesUrl: process.env.OPENAI_RESPONSES_URL || "https://api.openai.com/v1/responses",
  translationModel: process.env.OPENAI_TRANSLATION_MODEL || "gpt-5.4-nano",
  translationReasoningEffort: process.env.OPENAI_TRANSLATION_REASONING_EFFORT || "low",
  translationTargetLanguage: process.env.TRANSLATION_TARGET_LANGUAGE || "English",
  translationEnabled: process.env.ENABLE_TRANSLATION !== "false",
  allowedOrigins: parseOrigins(process.env.ALLOWED_ORIGINS),
  defaultVoice: process.env.DEFAULT_VOICE || "marin",
};

export const hasApiKey = () => Boolean(config.apiKey);

export const isOriginAllowed = (origin) => {
  if (config.allowedOrigins === "*") return true;
  if (!origin) return false;
  return config.allowedOrigins.includes(origin);
};
