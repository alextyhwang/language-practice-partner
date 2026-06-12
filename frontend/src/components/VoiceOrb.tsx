import type { SessionPhase } from "../types";

interface Props {
  phase: SessionPhase;
  partnerSpeaking: boolean;
  isMicActive: boolean;
}

const BAR_COUNT = 12;

function WaveBars({ active, color }: { active: boolean; color: string }) {
  return (
    <div className="flex h-8 items-end justify-center gap-[3px]">
      {Array.from({ length: BAR_COUNT }).map((_, i) => (
        <div
          key={i}
          className={`w-[3px] rounded-sm ${color} ${
            active ? "animate-wave-bar" : "opacity-30"
          }`}
          style={{
            height: active ? `${12 + Math.sin(i * 0.8) * 10}px` : "8px",
            animationDelay: active ? `${i * 0.07}s` : undefined,
          }}
        />
      ))}
    </div>
  );
}

export function VoiceOrb({ phase, partnerSpeaking: _partnerSpeaking, isMicActive }: Props) {
  const isListening = phase === "listening";
  const isSpeaking = phase === "speaking" && isMicActive;
  const isProcessing = phase === "processing";
  const isCorrecting = phase === "correcting";

  let statusLabel = "Ready!";
  let statusColor = "text-ink-muted";
  let frameBorder = "border-sky-dark";
  let frameBg = "from-sky/25 to-surface-raised";
  let accentColor = "bg-sky";

  if (isListening) {
    statusLabel = "Partner speaking…";
    statusColor = "text-sky-dark";
    frameBorder = "border-sky-dark";
    frameBg = "from-sky/35 to-sky/10";
    accentColor = "bg-sky";
  } else if (isSpeaking) {
    statusLabel = "You're speaking!";
    statusColor = "text-accent-dark";
    frameBorder = "border-accent-dark";
    frameBg = "from-accent/35 to-accent/10";
    accentColor = "bg-accent";
  } else if (isProcessing) {
    statusLabel = "Processing…";
    statusColor = "text-amber-dark";
    frameBorder = "border-amber-dark";
    frameBg = "from-amber/30 to-amber/10";
    accentColor = "bg-amber";
  } else if (isCorrecting) {
    statusLabel = "Review tip!";
    statusColor = "text-primary";
    frameBorder = "border-primary-dark";
    frameBg = "from-primary/25 to-primary/10";
    accentColor = "bg-primary";
  } else if (phase === "idle") {
    statusLabel = "Your turn — tap mic!";
    statusColor = "text-ink-muted";
  }

  return (
    <div className="flex flex-col items-center gap-2 py-2">
      <div className="relative animate-speech-bounce">
        {/* Speech bubble tail */}
        <div
          className={`absolute -bottom-2 left-1/2 h-4 w-4 -translate-x-1/2 rotate-45 border-b-[3px] border-r-[3px] border-ink bg-gradient-to-br ${frameBg}`}
          aria-hidden="true"
        />

        {(isListening || isSpeaking) && (
          <div
            className={`absolute inset-0 rounded-2xl border-[3px] ${frameBorder} animate-orb-pulse opacity-60`}
            style={{ margin: "-10px" }}
          />
        )}

        {isProcessing && (
          <div
            className="absolute inset-0 rounded-2xl border-[3px] border-dashed border-amber-dark/50"
            style={{
              margin: "-8px",
              animation: "ring-spin 3s linear infinite",
            }}
          />
        )}

        {/* Portrait frame — rounded square like a character select box */}
        <div
          className={`relative flex h-28 w-28 items-center justify-center rounded-2xl border-[3px] border-ink bg-gradient-to-br ${frameBg} shadow-lift transition-all duration-500`}
        >
          {/* Corner pixel accents */}
          <span className="absolute left-1.5 top-1.5 h-2 w-2 bg-amber/70" aria-hidden="true" />
          <span className="absolute right-1.5 top-1.5 h-2 w-2 bg-sky/70" aria-hidden="true" />
          <span className="absolute bottom-1.5 left-1.5 h-2 w-2 bg-accent/70" aria-hidden="true" />
          <span className="absolute bottom-1.5 right-1.5 h-2 w-2 bg-primary/70" aria-hidden="true" />

          {isListening || isSpeaking ? (
            <WaveBars active color={accentColor} />
          ) : isProcessing ? (
            <div className="flex gap-1.5">
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className="h-2.5 w-2.5 rounded-sm bg-amber animate-orb-pulse"
                  style={{ animationDelay: `${i * 0.2}s` }}
                />
              ))}
            </div>
          ) : (
            <svg
              width="36"
              height="36"
              viewBox="0 0 36 36"
              fill="none"
              className="text-sky-dark"
            >
              <path
                d="M18 4C14.6863 4 12 6.68629 12 10V18C12 21.3137 14.6863 24 18 24C21.3137 24 24 21.3137 24 18V10C24 6.68629 21.3137 4 18 4Z"
                fill="currentColor"
              />
              <path
                d="M8 18H10C10 22.4183 13.5817 26 18 26C22.4183 26 26 22.4183 26 18H28C28 23.5228 23.5228 28 18 28V32H16V28C10.4772 28 6 23.5228 6 18H8Z"
                fill="currentColor"
              />
            </svg>
          )}
        </div>
      </div>

      <p className={`font-pixel-xs ${statusColor} transition-colors`}>{statusLabel}</p>
    </div>
  );
}
