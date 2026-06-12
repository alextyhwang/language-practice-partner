import { Router } from "express";

import { config } from "../config.js";
import { translateSubtitleText } from "../translation.js";

export const translateRouter = Router();

const firstHeaderValue = (value) => (Array.isArray(value) ? value[0] : value);

translateRouter.post("/translate", async (req, res) => {
  if (!config.translationEnabled) {
    res.status(503).json({ error: "Translation subtitles are disabled." });
    return;
  }

  try {
    const result = await translateSubtitleText({
      text: req.body?.text,
      sourceLanguage: req.body?.sourceLanguage,
      targetLanguage: req.body?.targetLanguage,
      safetyIdentifier: firstHeaderValue(req.headers["openai-safety-identifier"]) || "lpp-translate-http",
    });

    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message || "Translation failed." });
  }
});
