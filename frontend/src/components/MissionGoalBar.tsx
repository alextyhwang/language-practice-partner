import type { Scenario } from "../types";

interface Props {
  scenario: Scenario;
  progress: number;
  currentGoalIndex: number;
}

export function MissionGoalBar({ scenario, progress, currentGoalIndex }: Props) {
  const currentGoal = scenario.goals[currentGoalIndex] ?? scenario.goals[scenario.goals.length - 1];

  return (
    <div className="quest-log mx-3 my-2 px-3 py-2">
      <div className="flex items-center justify-between">
        <span className="font-pixel-xs text-accent">QUEST</span>
        <span className="font-pixel-xs text-fire-bright">{progress}%</span>
      </div>

      <p className="mt-1 font-rpg text-cream">{currentGoal}</p>

      {/* Goal checkpoints */}
      <div className="mt-2 flex gap-1">
        {scenario.goals.map((goal, i) => (
          <div
            key={goal}
            className={`h-2 flex-1 border border-cream-dim/30 ${
              i <= currentGoalIndex ? "bg-accent" : "bg-night"
            }`}
            title={goal}
          />
        ))}
      </div>
    </div>
  );
}
