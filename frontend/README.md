# Lingo — Frontend

React + Vite + TypeScript + Tailwind v4 UI for the Live Practice Session screen.

The live session connects to the Lingo backend over a WebSocket via
`src/hooks/useRealtimeSession.ts` (the realtime client lives in
`src/lib/realtime.ts`). Vite proxies `/api`, `/health`, and `/realtime` to the
backend on `:8787` (override with `VITE_BACKEND_URL`).

## Run locally

```bash
cd frontend
npm install
npm run dev
```

Open **http://localhost:5173**

> Requires the backend running on `:8787` (see `../backend`). Pick a quest,
> allow mic access, and use push-to-talk; the agent greets you in character.

## What's built

- **Mission Select** — 10 quests grouped by difficulty (easy / medium / hard), mirroring the backend scenarios
- **Live Practice Session** — voice orb, transcript, correction cards, mission goal bar, push-to-talk mic, all driven by the live backend realtime session

## Project structure

```
src/
  components/   UI pieces (VoiceOrb, CorrectionCard, TranscriptTurn, etc.)
  data/         Scenario catalog (presentation + backend session config)
  lib/          realtime.ts — backend WebSocket + mic capture/playback
  hooks/        useRealtimeSession — live session state from the backend
  pages/        MissionSelect, LiveSession screens
  types.ts      Shared TypeScript types
```
