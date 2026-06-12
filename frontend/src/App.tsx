import { useState } from "react";
import { LiveSession } from "./pages/LiveSession";
import { MissionSelect } from "./pages/MissionSelect";

type AppView = "select" | "session";

export default function App() {
  const [view, setView] = useState<AppView>("select");
  const [activeScenarioId, setActiveScenarioId] = useState<string | null>(null);

  const startMission = (scenarioId: string) => {
    setActiveScenarioId(scenarioId);
    setView("session");
  };

  const exitMission = () => {
    setView("select");
    setActiveScenarioId(null);
  };

  if (view === "session" && activeScenarioId) {
    return <LiveSession scenarioId={activeScenarioId} onExit={exitMission} />;
  }

  return <MissionSelect onSelectScenario={startMission} />;
}
