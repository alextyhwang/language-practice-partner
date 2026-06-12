interface Props {
  level: number;
  xp: number;
  xpToNext: number;
  coins: number;
  streak: number;
  missionProgress: number;
}

export function PlayerStatsBar({
  level,
  xp,
  xpToNext,
  coins,
  streak,
  missionProgress,
}: Props) {
  const xpPercent = Math.min(100, Math.round((xp / xpToNext) * 100));

  return (
    <div className="mx-3 flex items-center gap-2 py-1">
      <span className="font-pixel-xs text-fire-bright">LV{level}</span>

      <div className="snes-xp-bar min-w-0 flex-1">
        <div
          className="snes-xp-fill"
          style={{ width: `${Math.max(xpPercent, missionProgress * 0.3)}%` }}
        />
      </div>

      <span className="font-pixel-xs text-cream-dim">{missionProgress}%</span>

      <span className="font-pixel-xs text-fire" title="Streak">
        ♨{streak}
      </span>
      <span className="font-pixel-xs text-fire-bright" title="Gold">
        G{coins}
      </span>
    </div>
  );
}
