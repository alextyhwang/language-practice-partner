import { coachingModeLabels } from "../data/mockData";
import type { CoachingMode } from "../types";

interface Props {
  mode: CoachingMode;
}

export function CoachingModeBadge({ mode }: Props) {
  const meta = coachingModeLabels[mode];

  return (
    <span
      className={`inline-flex items-center gap-1 border-2 px-2 py-0.5 font-pixel-xs ${meta.color}`}
    >
      <span className="text-[8px]">{meta.emoji}</span>
      <span className="hidden sm:inline">{meta.label}</span>
    </span>
  );
}
