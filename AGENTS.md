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
