import { correctionTypeMeta } from "../data/mockData";
import type { Correction } from "../types";

interface Props {
  correction: Correction;
  onDismiss: () => void;
  onRetry: () => void;
}

const typeColors: Record<string, string> = {
  pronunciation: "border-correction-pronunciation text-correction-pronunciation",
  grammar: "border-fire-bright text-fire-bright",
  vocabulary: "border-correction-vocabulary text-correction-vocabulary",
  fluency: "border-correction-fluency text-correction-fluency",
};

export function CoachTipPopup({ correction, onDismiss, onRetry }: Props) {
  const meta = correctionTypeMeta[correction.type];
  const colorClass = typeColors[correction.type] ?? typeColors.pronunciation;

  return (
    <div
      className="animate-slide-in-right snes-panel-quest relative overflow-hidden"
      role="alert"
    >
      <div className="flex items-center gap-2 border-b-2 border-accent/30 px-3 py-2">
        <span className="font-pixel-xs text-fire-bright">!</span>
        <div className="min-w-0 flex-1">
          <p className="font-pixel-xs text-accent">COACH TIP</p>
          <p className="font-rpg-sm text-cream-dim">{meta.label}</p>
        </div>
        <button
          type="button"
          onClick={onDismiss}
          className="snes-btn snes-btn-ghost flex h-6 w-6 items-center justify-center font-pixel-xs"
          aria-label="Dismiss tip"
        >
          X
        </button>
      </div>

      <div className="p-3">
        <div className="mb-2 flex flex-wrap items-center gap-2 font-rpg">
          <span className={`border-2 px-2 py-0.5 line-through opacity-70 ${colorClass}`}>
            {correction.original}
          </span>
          <span className="font-pixel-xs text-cream-dim">→</span>
          <span className="border-2 border-accent px-2 py-0.5 text-accent">
            {correction.suggestion}
          </span>
        </div>

        <p className="mb-3 font-rpg-sm text-cream-dim">{correction.explanation}</p>

        <div className="flex gap-2">
          <button
            type="button"
            onClick={onRetry}
            className="snes-btn snes-btn-orange flex-1 py-2 font-pixel-xs"
          >
            RETRY
          </button>
          <button
            type="button"
            onClick={onDismiss}
            className="snes-btn snes-btn-ghost px-4 py-2 font-pixel-xs"
          >
            OK
          </button>
        </div>
      </div>
    </div>
  );
}
