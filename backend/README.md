# Language Practice Partner — Backend

Node/Express backend that owns the OpenAI **Realtime** voice session for the
speaking coach. The browser never sees the OpenAI key: it connects to this
backend over a WebSocket, and the backend bridges to
`wss://api.openai.com/v1/realtime` with a server-side key.

On top of the raw Realtime stream, the backend adds the coaching domain:
target languages, CEFR levels, and scenario-based missions. In each mission the
agent plays the in-world counterpart character (the waiter, the airline agent,
the person being asked out, …) and is instructed to create realistic friction so
the learner has to genuinely convince them to reach the mission goal. Each
scenario has an intrinsic **difficulty** (easy / medium / hard) that scales the
challenge; feedback intensity is constant across the app.

The backend also defines Realtime **function tools** so the agent emits
structured correction cards, score cards, and a `goal_reached` signal that the
client renders live.

## Run

```bash
cd backend
npm install
cp .env.example .env   # add your OPENAI_API_KEY
npm run dev
```

Open http://localhost:8787 for the built-in test harness.

## Model

Defaults to `gpt-realtime-2` (the GA voice-agent model) via
`OPENAI_REALTIME_MODEL`. The dedicated translation model
`gpt-realtime-translate` uses a different endpoint (`/v1/realtime/translations`)
and is intentionally out of scope for the coaching session here.

## HTTP API

| Method | Path           | Purpose                                                  |
| ------ | -------------- | -------------------------------------------------------- |
| GET    | `/health`      | Liveness + whether an API key is configured.             |
| GET    | `/api/catalog` | Languages, levels, difficulties, scenarios + defaults.   |

## Realtime WebSocket protocol (`/realtime`)

### Client → backend

| Event              | Payload                                                                 |
| ------------------ | ----------------------------------------------------------------------- |
| `session.configure`| `{ config: { language, level, scenario, baseLanguage }, voice?, reasoningEffort?, turnDetection?: "manual"\|"auto", greet? }` |
| `text`             | `{ text }` — a typed learner turn.                                      |
| `audio.start`      | Begin a push-to-talk turn (clears the input buffer).                    |
| `audio.chunk`      | `{ audio }` — base64 PCM16 @ 24 kHz.                                     |
| `audio.stop`       | Commit the audio turn.                                                   |
| `response.cancel`  | Cancel the in-flight response (barge-in).                               |

### Backend → client

The backend forwards all raw OpenAI Realtime server events (e.g.
`response.output_audio.delta`, `response.output_audio_transcript.delta`) and
adds these structured events:

| Event           | Payload                                              |
| --------------- | ---------------------------------------------------- |
| `lpp.status`    | `{ status, model? }` connection lifecycle.           |
| `lpp.session`   | Echo of the resolved coaching context.               |
| `lpp.correction`| A structured correction card (from `record_correction`). |
| `lpp.score`     | A structured score card (from `score_turn`).         |
| `lpp.goal`      | Mission goal achieved (from `goal_reached`) — your software-side hook. |
| `lpp.error`     | `{ message }`.                                        |

## Layout

```
backend/
├── src/
│   ├── server.js              # HTTP + WS bootstrap
│   ├── config.js              # env + origin allowlist
│   ├── routes/catalog.js      # GET /api/catalog
│   ├── coaching/
│   │   ├── languages.js       # languages + CEFR levels
│   │   ├── difficulty.js      # easy / medium / hard difficulty levels
│   │   ├── scenarios.js       # missions (each with role, goal, resistance, difficulty)
│   │   ├── tools.js           # record_correction / score_turn / goal_reached tools
│   │   └── instructions.js    # composes Realtime system instructions
│   └── realtime/
│       ├── sessionConfig.js   # session.update payload builder
│       └── bridge.js          # browser <-> OpenAI bridge + tool handling
└── public/                    # dev test harness (not the production client)
```

## Notes

- The `public/` harness is a developer tool for exercising the backend, not the
  final product UI.
- For production, add real user auth, per-user authorization and rate limits,
  stricter origin checks, and logging controls. OpenAI recommends WebRTC for
  browser-native voice; this backend uses the WebSocket transport because it
  owns the upstream connection server-side.
