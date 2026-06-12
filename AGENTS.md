# Agent guidelines

## ⛔ Do NOT modify the backend

The `backend/` directory is **off-limits to AI agents**. It is owned and
maintained separately and is considered locked.

Agents (Cursor, Claude, Codex, Copilot, or any other automated tool) must **not**:

- create, edit, move, rename, or delete any file under `backend/`
- refactor, reformat, or "clean up" backend code
- change backend dependencies (`backend/package.json`, lockfile) or config
- run, restart, or otherwise manage the backend service

If a task seems to require a backend change, **stop and ask a human first**.
Make your changes in the appropriate non-backend part of the repo instead.

The only exception is an explicit, direct instruction from a human maintainer
that names `backend/` and clearly authorizes the specific change.

## Layout

- `backend/` — Realtime voice coaching service (LOCKED — see above).
- Everything else — open for normal work.

## Frontend handoff: realtime subtitle translations

The backend exposes UI-only translations for assistant speech so the frontend
can show English subtitles under target-language replies without asking the
Realtime roleplay model to speak English in-character.

Frontend agents should treat this as a backend contract and consume it from
non-backend code:

- Realtime socket event: listen for `lpp.translation`.
- Payload shape: `{ translation: { text, sourceText, sourceLanguage, targetLanguage, model, responseId } }`.
- Render `translation.text` as secondary subtitle text attached to the assistant
  message matching `responseId`.
- The original assistant transcript still arrives from
  `response.output_audio_transcript.delta`; keep that as the primary transcript.
- REST fallback for future UI flows: `POST /api/translate` with `text`,
  `sourceLanguage`, and optional `targetLanguage`.
- Keep translations optional or revealable where possible so learners do not
  become dependent on English subtitles during practice.

Do not edit `backend/` to change this behavior unless a human explicitly
authorizes backend work. If the frontend needs a different contract, document
the request and ask a maintainer.
