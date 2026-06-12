import { allScenarios, playerStats } from "../data/mockData";
import type { Scenario } from "../types";

interface Props {
  onSelectScenario: (scenarioId: string) => void;
}

function StarDisplay({ earned, max = 3 }: { earned: number; max?: number }) {
  return (
    <span className="font-pixel-xs text-fire-bright" aria-label={`${earned} of ${max} stars`}>
      {Array.from({ length: max })
        .map((_, i) => (i < earned ? "★" : "☆"))
        .join("")}
    </span>
  );
}

const difficultyLabel = {
  easy: { text: "EASY", color: "text-accent" },
  medium: { text: "NORMAL", color: "text-fire-bright" },
  hard: { text: "HARD", color: "text-correction-pronunciation" },
};

function QuestEntry({
  scenario,
  index,
  onSelect,
}: {
  scenario: Scenario;
  index: number;
  onSelect: () => void;
}) {
  const diff = difficultyLabel[scenario.difficulty];

  return (
    <button
      type="button"
      onClick={onSelect}
      className="snes-menu-item group flex w-full items-center gap-3 px-3 py-3 text-left"
    >
      {/* Quest number */}
      <span className="flex h-8 w-8 shrink-0 items-center justify-center border-2 border-cream-dim bg-night font-pixel-xs text-fire-bright">
        {String(index + 1).padStart(2, "0")}
      </span>

      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <h2 className="truncate font-pixel-sm text-cream">{scenario.title}</h2>
          <StarDisplay earned={scenario.starsEarned} />
        </div>
        <p className="mt-0.5 truncate font-rpg-sm text-cream-dim">{scenario.description}</p>
        <div className="mt-1 flex items-center gap-3">
          <span className="font-pixel-xs text-cream-dim">{scenario.locationBadge}</span>
          <span className={`font-pixel-xs ${diff.color}`}>{diff.text}</span>
          <span className="font-rpg-sm text-cream-dim opacity-60">
            vs {scenario.npc.nameChinese}
          </span>
        </div>
      </div>

      <span className="shrink-0 font-pixel-xs text-fire opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100">
        ▶
      </span>
    </button>
  );
}

export function MissionSelect({ onSelectScenario }: Props) {
  const xpPercent = Math.round((playerStats.xp / playerStats.xpToNext) * 100);

  return (
    <div className="snes-crt game-bg world-map-bg relative mx-auto flex h-full max-w-lg flex-col overflow-hidden">
      {/* Top status bar — SNES RPG HUD */}
      <header className="snes-panel-dark mx-3 mt-3 px-3 py-2">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-pixel-xs text-fire-bright">▶ QUEST BOARD</p>
            <h1 className="mt-1 font-pixel-sm text-cream">Language Quest</h1>
          </div>
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1 border-2 border-cream-dim bg-night px-2 py-1">
              <span className="font-pixel-xs text-fire">♨</span>
              <span className="font-pixel-xs text-cream">{playerStats.streak}</span>
            </span>
            <span className="flex items-center gap-1 border-2 border-cream-dim bg-night px-2 py-1">
              <span className="font-pixel-xs text-fire-bright">G</span>
              <span className="font-pixel-xs text-cream">{playerStats.coins}</span>
            </span>
          </div>
        </div>

        {/* XP bar */}
        <div className="mt-2 flex items-center gap-2">
          <span className="font-pixel-xs text-cream-dim">LV{playerStats.level}</span>
          <div className="snes-xp-bar flex-1">
            <div className="snes-xp-fill" style={{ width: `${xpPercent}%` }} />
          </div>
          <span className="font-pixel-xs text-cream-dim">
            {playerStats.xp}/{playerStats.xpToNext}
          </span>
        </div>
      </header>

      {/* Quest list */}
      <div className="flex-1 overflow-y-auto px-3 py-3 scrollbar-thin">
        <p className="mb-2 font-pixel-xs text-accent">— SELECT A QUEST —</p>
        <div className="flex flex-col gap-2">
          {allScenarios.map((scenario, i) => (
            <QuestEntry
              key={scenario.id}
              scenario={scenario}
              index={i}
              onSelect={() => onSelectScenario(scenario.id)}
            />
          ))}
        </div>
      </div>

      <footer className="border-t-2 border-cream-dim/20 px-3 py-2 text-center">
        <p className="font-pixel-xs text-cream-dim opacity-60">5 quests · Mandarin practice</p>
      </footer>
    </div>
  );
}
