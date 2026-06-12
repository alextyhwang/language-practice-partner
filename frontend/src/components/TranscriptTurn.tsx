import type { TranscriptTurn as Turn } from "../types";

interface Props {
  turn: Turn;
  isLatest?: boolean;
}

export function TranscriptTurn({ turn, isLatest }: Props) {
  const isUser = turn.speaker === "user";

  return (
    <div
      className={`flex gap-2.5 sm:gap-3 ${isUser ? "flex-row-reverse" : ""} ${
        isLatest ? "animate-slide-up" : ""
      }`}
    >
      {/* Game-style character badge */}
      <div
        className={`flex h-9 w-9 shrink-0 flex-col items-center justify-center rounded-lg border-[3px] text-[8px] font-bold leading-none shadow-soft ${
          isUser
            ? "border-accent-dark bg-accent/20 text-accent-dark"
            : "border-sky-dark bg-sky/20 text-sky-dark"
        }`}
      >
        <span className="font-pixel-xs" style={{ fontSize: "6px" }}>
          {isUser ? "YOU" : "AI"}
        </span>
      </div>

      <div
        className={`relative max-w-[80%] rounded-xl border-[3px] px-3.5 py-2.5 sm:px-4 sm:py-3 ${
          isUser
            ? "rounded-tr-sm border-accent-dark/40 bg-accent/10 shadow-[0_3px_0_rgba(46,125,50,0.2)]"
            : "rounded-tl-sm border-sky-dark/40 bg-surface-raised shadow-[0_3px_0_rgba(0,119,182,0.15)]"
        } ${turn.isRetry ? "ring-2 ring-amber ring-offset-1" : ""}`}
      >
        {turn.isRetry && (
          <span className="mb-1.5 inline-flex items-center gap-1 rounded-md border-2 border-amber-dark/40 bg-amber/25 px-2 py-0.5 font-pixel-xs text-ink">
            ↻ Retry
          </span>
        )}

        <p className="text-[15px] font-medium leading-relaxed text-ink">{turn.text}</p>

        {turn.translation && (
          <p className="mt-1.5 border-t border-ink/8 pt-1.5 text-xs leading-relaxed text-ink-faint">
            {turn.translation}
          </p>
        )}
      </div>
    </div>
  );
}
