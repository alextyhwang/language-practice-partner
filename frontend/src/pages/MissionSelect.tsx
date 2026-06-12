import { useEffect, useState } from "react";
import { allScenarios, playerStats } from "../data/mockData";
import type { Scenario } from "../types";

interface CatalogLanguage {
  id: string;
  label: string;
}

interface Props {
  onSelectScenario: (scenarioId: string) => void;
  language: string;
  onLanguageChange: (languageId: string) => void;
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
  medium: { text: "MEDIUM", color: "text-fire-bright" },
  hard: { text: "HARD", color: "text-correction-pronunciation" },
};

const difficultyOrder: Scenario["difficulty"][] = ["easy", "medium", "hard"];
const difficultyHeading = { easy: "— EASY —", medium: "— MEDIUM —", hard: "— HARD —" };

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
            vs {scenario.npc.name}
          </span>
        </div>
      </div>

      <span className="shrink-0 font-pixel-xs text-fire opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100">
        ▶
      </span>
    </button>
  );
}

export function MissionSelect({ onSelectScenario, language, onLanguageChange }: Props) {
  const xpPercent = Math.round((playerStats.xp / playerStats.xpToNext) * 100);
  const [languages, setLanguages] = useState<CatalogLanguage[]>([]);
  // Quest the player tapped, held until they confirm they want to begin.
  const [confirmScenario, setConfirmScenario] = useState<Scenario | null>(null);

  // Language list comes from the backend catalog so it always matches what the
  // realtime backend supports.
  useEffect(() => {
    let cancelled = false;
    fetch("/api/catalog")
      .then((res) => res.json())
      .then((data) => {
        if (!cancelled && Array.isArray(data.languages)) setLanguages(data.languages);
      })
      .catch(() => {
        /* backend not reachable yet; selector falls back to current value */
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const selectedLabel = languages.find((l) => l.id === language)?.label ?? "Mandarin";

  return (
    <div className="snes-crt game-bg world-map-bg relative mx-auto flex h-full max-w-lg flex-col overflow-hidden">
      {/* Top status bar — SNES RPG HUD */}
      <header className="snes-panel-dark mx-3 mt-3 px-3 py-2">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-pixel-xs text-fire-bright">▶ QUEST BOARD</p>
            <h1 className="mt-1 font-pixel-sm text-cream">Lingo</h1>
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

        {/* Target language selector (sourced from the backend catalog) */}
        <div className="mt-2 flex items-center gap-2">
          <label htmlFor="language" className="font-pixel-xs text-cream-dim">
            LANG
          </label>
          <select
            id="language"
            value={language}
            onChange={(e) => onLanguageChange(e.target.value)}
            className="flex-1 border-2 border-cream-dim bg-night px-2 py-1 font-pixel-xs text-cream"
          >
            {languages.length === 0 && <option value={language}>{selectedLabel}</option>}
            {languages.map((l) => (
              <option key={l.id} value={l.id}>
                {l.label}
              </option>
            ))}
          </select>
        </div>
      </header>

      {/* Quest list, grouped by difficulty */}
      <div className="flex-1 overflow-y-auto px-3 py-3 scrollbar-thin">
        <p className="mb-2 font-pixel-xs text-accent">— SELECT A QUEST —</p>
        <div className="flex flex-col gap-4">
          {difficultyOrder.map((tier) => {
            const quests = allScenarios.filter((s) => s.difficulty === tier);
            if (quests.length === 0) return null;
            return (
              <div key={tier} className="flex flex-col gap-2">
                <p className={`font-pixel-xs ${difficultyLabel[tier].color}`}>
                  {difficultyHeading[tier]}
                </p>
                {quests.map((scenario) => (
                  <QuestEntry
                    key={scenario.id}
                    scenario={scenario}
                    index={allScenarios.indexOf(scenario)}
                    onSelect={() => setConfirmScenario(scenario)}
                  />
                ))}
              </div>
            );
          })}
        </div>
      </div>

      <footer className="border-t-2 border-cream-dim/20 px-3 py-2 text-center">
        <p className="font-pixel-xs text-cream-dim opacity-60">
          {allScenarios.length} quests · {selectedLabel} practice
        </p>
      </footer>

      {/* Confirmation step before a quest actually starts a live session */}
      {confirmScenario && (
        <div
          className="absolute inset-0 z-20 flex items-center justify-center bg-night/80 px-4"
          role="dialog"
          aria-modal="true"
        >
          <div className="snes-panel-dark w-full max-w-sm px-4 py-4">
            <p className="font-pixel-xs text-fire-bright">▶ START QUEST?</p>
            <h2 className="mt-2 font-pixel-sm text-cream">{confirmScenario.title}</h2>
            <p className="mt-1 font-rpg-sm text-cream-dim">{confirmScenario.description}</p>

            <div className="mt-3 flex flex-col gap-1 border-y-2 border-cream-dim/20 py-2">
              <div className="flex items-center justify-between">
                <span className="font-pixel-xs text-cream-dim">TALKING TO</span>
                <span className="font-rpg-sm text-cream">
                  {confirmScenario.npc.name} · {confirmScenario.npc.role}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-pixel-xs text-cream-dim">LANGUAGE</span>
                <span className="font-rpg-sm text-cream">{selectedLabel}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-pixel-xs text-cream-dim">DIFFICULTY</span>
                <span className={`font-pixel-xs ${difficultyLabel[confirmScenario.difficulty].color}`}>
                  {difficultyLabel[confirmScenario.difficulty].text}
                </span>
              </div>
            </div>

            <p className="mt-3 font-pixel-xs text-accent">— YOUR GOALS —</p>
            <ul className="mt-1 flex flex-col gap-1">
              {confirmScenario.goals.map((goal) => (
                <li key={goal} className="font-rpg-sm text-cream-dim">
                  • {goal}
                </li>
              ))}
            </ul>

            <div className="mt-4 flex gap-2">
              <button
                type="button"
                onClick={() => setConfirmScenario(null)}
                className="snes-menu-item flex-1 px-3 py-2 font-pixel-xs text-cream-dim"
              >
                ✕ BACK
              </button>
              <button
                type="button"
                onClick={() => onSelectScenario(confirmScenario.id)}
                className="snes-menu-item flex-1 border-2 border-fire-bright px-3 py-2 font-pixel-xs text-fire-bright"
              >
                ▶ BEGIN
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
