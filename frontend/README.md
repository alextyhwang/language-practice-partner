# Language Practice Partner — Frontend

React + Vite + TypeScript + Tailwind v4 UI for the Live Practice Session screen.

Frontend only — all session data is mocked via `src/hooks/useSession.ts`.

## Run locally

```bash
cd frontend
npm install
npm run dev
```

Open **http://localhost:5173**

## What's built

- **Live Practice Session** — voice orb, transcript, correction cards, mission goal bar, mic controls
- Mock conversation flow simulates partner turns, user speech, and live corrections

## Project structure

```
src/
  components/   UI pieces (VoiceOrb, CorrectionCard, TranscriptTurn, etc.)
  data/         Mock scenarios, transcript, corrections
  hooks/        useSession — stubbed realtime session state
  pages/        LiveSession screen
  types.ts      Shared TypeScript types
```
