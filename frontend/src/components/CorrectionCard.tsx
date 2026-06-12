import { correctionTypeMeta } from "../data/mockData";
import type { Correction } from "../types";

interface Props {
  correction: Correction;
  onDismiss: () => void;
  onRetry: () => void;
}

const typeAccent: Record<string, { border: string; header: string }> = {
  pronunciation: { border: "border-primary-dark", header: "bg-primary/15 text-primary" },
  grammar: { border: "border-amber-dark", header: "bg-amber/25 text-ink" },
  vocabulary: { border: "border-sky-dark", header: "bg-sky/20 text-sky-dark" },
  fluency: { border: "border-correction-fluency", header: "bg-correction-fluency/15 text-correction-fluency" },
};

export function CorrectionCard({ correction, onDismiss, onRetry }: Props) {
  const meta = correctionTypeMeta[correction.type];
  const accent = typeAccent[correction.type] ?? typeAccent.pronunciation;

  return (
    <div
      className={`animate-slide-in-right relative overflow-hidden rounded-xl border-[3px] ${accent.border} bg-surface-raised p-4 shadow-lift`}
      role="alert"
    >
      {/* Tutorial popup pointer */}
      <div
        className={`absolute -top-2 left-8 h-4 w-4 rotate-45 border-l-[3px] border-t-[3px] ${accent.border} bg-surface-raised`}
        aria-hidden="true"
      />

      {/* Pixel dot overlay */}
      <div
        className="pointer-events-none absolute inset-0 opacity-30"
        style={{
          backgroundImage:
            "radial-gradient(circle, rgba(45,27,14,0.05) 1px, transparent 1px)",
          backgroundSize: "6px 6px",
        }}
        aria-hidden="true"
      />

      <div className="relative mb-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span
            className={`flex h-8 w-8 items-center justify-center rounded-lg border-2 border-ink/15 text-base ${accent.header}`}
          >
            {meta.icon}
          </span>
          <span className="font-pixel-xs text-ink">{meta.label}</span>
        </div>
        <button
          type="button"
          onClick={onDismiss}
          className="game-btn game-btn-ghost flex h-7 w-7 items-center justify-center rounded-lg text-xs"
          aria-label="Dismiss correction"
        >
          ✕
        </button>
      </div>

      <div className="relative mb-3 flex flex-wrap items-center gap-2 text-sm">
        <span className="rounded-lg border-2 border-primary/30 bg-primary/10 px-2.5 py-1 font-medium text-primary line-through decoration-primary/60">
          {correction.original}
        </span>
        <span className="font-pixel-xs text-ink-faint">→</span>
        <span className="rounded-lg border-2 border-accent-dark/30 bg-accent/15 px-2.5 py-1 font-semibold text-accent-dark">
          {correction.suggestion}
        </span>
      </div>

      <p className="relative mb-4 text-sm leading-relaxed text-ink-muted">
        {correction.explanation}
      </p>

      <div className="relative flex gap-2">
        <button
          type="button"
          onClick={onRetry}
          className="game-btn game-btn-red flex-1 rounded-xl py-2.5 font-display text-sm font-bold"
        >
          Try Again!
        </button>
        <button
          type="button"
          onClick={onDismiss}
          className="game-btn game-btn-ghost rounded-xl px-4 py-2.5 font-display text-sm font-bold"
        >
          Got it
        </button>
      </div>
    </div>
  );
}
