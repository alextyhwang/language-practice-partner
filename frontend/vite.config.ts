import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// The backend (Language Practice Partner Realtime service) runs on :8787.
// Proxy REST + the realtime WebSocket so the browser talks to the Vite origin
// only and we avoid CORS / hardcoded ports. Override the target with
// VITE_BACKEND_URL if the backend runs elsewhere.
const backend = process.env.VITE_BACKEND_URL || "http://localhost:8787";
const backendWs = backend.replace(/^http/, "ws");

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      "/api": { target: backend, changeOrigin: true },
      "/health": { target: backend, changeOrigin: true },
      "/realtime": { target: backendWs, ws: true, changeOrigin: true },
    },
  },
});
