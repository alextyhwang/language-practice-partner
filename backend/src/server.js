import http from "node:http";
import path from "node:path";
import crypto from "node:crypto";
import { fileURLToPath } from "node:url";

import cors from "cors";
import express from "express";
import { WebSocketServer } from "ws";

import { config, hasApiKey, isOriginAllowed } from "./config.js";
import { catalogRouter } from "./routes/catalog.js";
import { RealtimeBridge } from "./realtime/bridge.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const publicDir = path.join(__dirname, "..", "public");

const app = express();
const server = http.createServer(app);

app.use(
  cors({
    origin: config.allowedOrigins === "*" ? true : config.allowedOrigins,
  }),
);
app.use(express.json());

app.get("/health", (_req, res) => {
  res.json({
    ok: true,
    service: "language-practice-partner-backend",
    model: config.model,
    hasApiKey: hasApiKey(),
  });
});

app.use("/api", catalogRouter);
app.use(express.static(publicDir));

// Realtime coaching socket. The browser connects here; the bridge owns the
// upstream OpenAI connection.
const wss = new WebSocketServer({ noServer: true });

server.on("upgrade", (req, socket, head) => {
  if (req.url?.split("?")[0] !== "/realtime") {
    socket.destroy();
    return;
  }

  const origin = req.headers.origin;
  if (origin && !isOriginAllowed(origin)) {
    socket.write("HTTP/1.1 403 Forbidden\r\n\r\n");
    socket.destroy();
    return;
  }

  wss.handleUpgrade(req, socket, head, (browserWs) => {
    wss.emit("connection", browserWs, req);
  });
});

wss.on("connection", (browserWs, req) => {
  const bridge = new RealtimeBridge(browserWs, {
    safetyIdentifier: stableSafetyIdentifier(req),
  });
  bridge.start();
});

server.listen(config.port, () => {
  console.log(`Language Practice Partner backend on http://localhost:${config.port}`);
  console.log(`Realtime model: ${config.model} | API key present: ${hasApiKey()}`);
});

// Stable, privacy-preserving per-user identifier for the OpenAI safety header.
function stableSafetyIdentifier(req) {
  const forwarded = req.headers["x-forwarded-for"];
  const ip = Array.isArray(forwarded)
    ? forwarded[0]
    : forwarded?.split(",")[0] || req.socket.remoteAddress || "local";
  const hash = crypto.createHash("sha256").update(ip).digest("base64url").slice(0, 24);
  return `lpp-${hash}`;
}
