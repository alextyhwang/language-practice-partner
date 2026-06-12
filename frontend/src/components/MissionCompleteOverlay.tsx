import { useEffect } from "react";
import type { Scenario } from "../types";

interface Props {
  scenario: Scenario;
  formattedTime: string;
  onFinished: () => void;
}

export function MissionCompleteOverlay({ scenario, formattedTime, onFinished }: Props) {
  useEffect(() => {
    const timer = window.setTimeout(onFinished, 2600);
    return () => window.clearTimeout(timer);
  }, [onFinished]);

  return (
    <div
      className="absolute inset-0 z-30 flex items-center justify-center bg-night/90 px-4"
      role="dialog"
      aria-modal="true"
      aria-label="Quest complete"
    >
      <div className="animate-slide-up snes-panel-dark w-full max-w-sm px-5 py-6 text-center">
        <p className="font-pixel-xs text-fire-bright animate-blink">★ QUEST COMPLETE ★</p>
        <h2 className="mt-3 font-pixel-sm text-cream">{scenario.title}</h2>
        <p className="mt-1 font-rpg-sm text-cream-dim">{scenario.location}</p>

        <div className="mt-4 flex items-center justify-center gap-2">
          {Array.from({ length: 3 }).map((_, i) => (
            <span
              key={i}
              className="font-pixel-sm text-fire-bright animate-slide-up"
              style={{ animationDelay: `${0.15 + i * 0.12}s` }}
            >
              ★
            </span>
          ))}
        </div>

        <p className="mt-4 font-pixel-xs text-accent">GOAL ACHIEVED</p>
        <p className="mt-2 font-rpg-sm text-cream-dim">Time: {formattedTime}</p>
      </div>
    </div>
  );
}
