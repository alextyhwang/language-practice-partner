import type { SessionPhase } from "../types";

interface Props {
  isMicActive: boolean;
  phase: SessionPhase;
  onToggleMic: () => void;
  onExit: () => void;
}

export function GameActionBar({ isMicActive, phase, onToggleMic, onExit }: Props) {
  const canSpeak = phase === "idle" || phase === "speaking";
  const isDisabled = !canSpeak && !isMicActive;

  const actionLabel = isMicActive ? "STOP" : isDisabled ? "WAIT" : "SPEAK";

  return (
    <div className="border-t-2 border-cream-dim/20 px-3 py-3">
      <div className="flex items-center justify-center gap-6">
        <button
          type="button"
          className="snes-btn snes-btn-ghost flex h-10 w-10 items-center justify-center"
          aria-label="Quick phrases"
        >
          <span className="font-pixel-xs">TIP</span>
        </button>

        <div className="flex flex-col items-center gap-1">
          <button
            type="button"
            onClick={onToggleMic}
            disabled={isDisabled}
            className={`snes-btn relative flex h-14 w-14 items-center justify-center ${
              isMicActive
                ? "snes-btn-orange"
                : isDisabled
                  ? "cursor-not-allowed border-cream-dim/30 bg-night text-cream-dim opacity-50"
                  : "snes-btn-green"
            }`}
            aria-label={isMicActive ? "Stop speaking" : "Start speaking"}
          >
            {isMicActive ? (
              <span className="font-pixel-xs">■</span>
            ) : (
              <span className="text-lg">🎤</span>
            )}
          </button>
          <span
            className={`font-pixel-xs ${isMicActive ? "text-fire-bright" : "text-cream-dim"}`}
          >
            {actionLabel}
          </span>
        </div>

        <button
          type="button"
          onClick={onExit}
          className="snes-btn snes-btn-ghost flex h-10 w-10 flex-col items-center justify-center text-correction-pronunciation"
          aria-label="Leave quest"
        >
          <span className="font-pixel-xs">EXIT</span>
        </button>
      </div>
    </div>
  );
}
