import { useState } from "react";
import { LiveSession } from "./pages/LiveSession";
import { MissionSelect } from "./pages/MissionSelect";

type AppView = "select" | "session";

export default function App() {
  const [view, setView] = useState<AppView>("select");
  const [activeScenarioId, setActiveScenarioId] = useState<string | null>(null);
  // Target language (backend language id) chosen on the mission screen.
  const [language, setLanguage] = useState("zh");

  const startMission = (scenarioId: string) => {
    setActiveScenarioId(scenarioId);
    setView("session");
  };

  const exitMission = () => {
    setView("select");
    setActiveScenarioId(null);
  };

  if (view === "session" && activeScenarioId) {
    return <LiveSession scenarioId={activeScenarioId} language={language} onExit={exitMission} />;
  }

  return (
    <MissionSelect
      onSelectScenario={startMission}
      language={language}
      onLanguageChange={setLanguage}
    />
  );
}
