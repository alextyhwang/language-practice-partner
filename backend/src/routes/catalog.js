import { Router } from "express";

import {
  LANGUAGES,
  PROFICIENCY_LEVELS,
  DEFAULT_LANGUAGE_ID,
  DEFAULT_LEVEL_ID,
  DEFAULT_BASE_LANGUAGE,
} from "../coaching/languages.js";
import { COACHING_MODES, DEFAULT_MODE_ID } from "../coaching/modes.js";
import { SCENARIOS, DEFAULT_SCENARIO_ID } from "../coaching/scenarios.js";

// Exposes the coaching catalog so the client can render selectors without
// hardcoding the domain.
export const catalogRouter = Router();

catalogRouter.get("/catalog", (_req, res) => {
  res.json({
    languages: LANGUAGES,
    levels: PROFICIENCY_LEVELS,
    modes: COACHING_MODES,
    scenarios: SCENARIOS,
    defaults: {
      language: DEFAULT_LANGUAGE_ID,
      level: DEFAULT_LEVEL_ID,
      mode: DEFAULT_MODE_ID,
      scenario: DEFAULT_SCENARIO_ID,
      baseLanguage: DEFAULT_BASE_LANGUAGE,
    },
  });
});
