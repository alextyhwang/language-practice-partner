import { CoachingModeBadge } from "./CoachingModeBadge";
import type { CoachingMode, Scenario } from "../types";

interface Props {
  scenario: Scenario;
  coachingMode: CoachingMode;
  formattedTime: string;
  onBack?: () => void;
}

export function SessionHeader({ scenario, coachingMode, formattedTime, onBack }: Props) {
  return (
    <header className="flex items-center justify-between gap-2 px-3 py-2">
      <div className="flex min-w-0 items-center gap-2">
        <button
          type="button"
          onClick={onBack}
          className="snes-btn snes-btn-ghost flex h-8 w-8 shrink-0 items-center justify-center"
          aria-label="Back to quest board"
        >
          ◀
        </button>

        <div className="min-w-0">
          <h1 className="truncate font-pixel-sm text-cream">{scenario.title}</h1>
          <p className="truncate font-rpg-sm text-cream-dim">{scenario.location}</p>
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-2">
        <CoachingModeBadge mode={coachingMode} />
        <span className="border-2 border-cream-dim bg-night px-2 py-0.5 font-pixel-xs text-cream-dim tabular-nums">
          {formattedTime}
        </span>
      </div>
    </header>
  );
}
