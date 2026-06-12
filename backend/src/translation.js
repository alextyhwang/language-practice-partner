import { config } from "./config.js";

const MAX_SUBTITLE_CHARS = 4000;

const extractOutputText = (payload) => {
  if (typeof payload?.output_text === "string") return payload.output_text;

  const parts = [];
  for (const item of payload?.output || []) {
    for (const content of item?.content || []) {
      if (typeof content?.text === "string") parts.push(content.text);
    }
  }
  return parts.join("");
};

export const normalizeSubtitleText = (value) => String(value || "").replace(/\s+/g, " ").trim();

export async function translateSubtitleText({
  text,
  sourceLanguage,
  targetLanguage = config.translationTargetLanguage,
  safetyIdentifier = "lpp-anon",
} = {}) {
  const source = normalizeSubtitleText(text).slice(0, MAX_SUBTITLE_CHARS);
  const target = normalizeSubtitleText(targetLanguage) || config.translationTargetLanguage;
  const sourceLabel = normalizeSubtitleText(sourceLanguage) || "the source language";

  if (!source) {
    return {
      text: "",
      model: config.translationModel,
      sourceLanguage: sourceLabel,
      targetLanguage: target,
    };
  }

  if (!config.apiKey) {
    throw new Error("Server is missing OPENAI_API_KEY.");
  }

  const response = await fetch(config.responsesUrl, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${config.apiKey}`,
      "Content-Type": "application/json",
      "OpenAI-Safety-Identifier": safetyIdentifier,
    },
    body: JSON.stringify({
      model: config.translationModel,
      reasoning: { effort: config.translationReasoningEffort },
      input: [
        {
          role: "developer",
          content:
            "Translate subtitles for a language-learning app. Return only the translation, no quotes, no labels, no explanation. Preserve meaning, names, numbers, tone, and sentence boundaries. Do not answer or continue the conversation.",
        },
        {
          role: "user",
          content: `Source language: ${sourceLabel}\nTarget language: ${target}\nSubtitle text:\n${source}`,
        },
      ],
      max_output_tokens: 600,
    }),
  });

  const payload = await response.json().catch(() => ({}));

  if (!response.ok) {
    const message = payload?.error?.message || `Translation request failed with ${response.status}.`;
    throw new Error(message);
  }

  return {
    text: normalizeSubtitleText(extractOutputText(payload)),
    model: config.translationModel,
    sourceLanguage: sourceLabel,
    targetLanguage: target,
  };
}
