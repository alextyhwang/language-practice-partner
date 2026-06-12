import { useRealtimeSession } from "../hooks/useRealtimeSession";
import type { CoachingMode } from "../types";
import { CharacterStage } from "../components/CharacterStage";
import { CoachTipPopup } from "../components/CoachTipPopup";
import { DialogueBox } from "../components/DialogueBox";
import { DialogueLog } from "../components/DialogueLog";
import { GameActionBar } from "../components/GameActionBar";
import { MissionGoalBar } from "../components/MissionGoalBar";
import { PlayerStatsBar } from "../components/PlayerStatsBar";
import { SessionHeader } from "../components/SessionHeader";

interface Props {
  scenarioId: string;
  coachingMode?: CoachingMode;
  language?: string;
  onExit: () => void;
}

export function LiveSession({ scenarioId, coachingMode = "friendly", language, onExit }: Props) {
  const session = useRealtimeSession({ scenarioId, coachingMode, language });

  return (
    <div className="snes-crt game-bg game-bg-night relative mx-auto flex h-full max-w-lg flex-col overflow-hidden">
      <SessionHeader
        scenario={session.scenario}
        coachingMode={session.coachingMode}
        formattedTime={session.formattedTime}
        onBack={onExit}
      />

      <PlayerStatsBar
        level={session.playerStats.level}
        xp={session.playerStats.xp}
        xpToNext={session.playerStats.xpToNext}
        coins={session.playerStats.coins}
        streak={session.playerStats.streak}
        missionProgress={session.goalProgress}
      />

      {/* Scene stage — the RPG world */}
      <CharacterStage
        npc={session.scenario.npc}
        mood={session.npcMood}
        partnerSpeaking={session.partnerSpeaking}
        phase={session.phase}
        locationBadge={session.scenario.locationBadge}
      />

      {/* Quest objective sidebar strip */}
      <MissionGoalBar
        scenario={session.scenario}
        progress={session.goalProgress}
        currentGoalIndex={session.currentGoalIndex}
      />

      {/* Coach tip overlay */}
      {session.activeCorrection && (
        <div className="px-3">
          <CoachTipPopup
            correction={session.activeCorrection}
            onDismiss={session.dismissCorrection}
            onRetry={session.retryPhrase}
          />
        </div>
      )}

      {/* JRPG dialogue box — NOT chat bubbles */}
      <DialogueBox
        speakerName={
          session.currentLine?.speaker === "user" ? "You" : session.scenario.npc.name
        }
        speakerLabel={
          session.currentLine?.speaker === "user" ? "YOU" : session.scenario.npc.role
        }
        text={session.currentLine?.text ?? ""}
        translation={session.currentLine?.translation}
        phase={session.phase}
        partnerSpeaking={session.partnerSpeaking}
        isEmpty={!session.currentLine}
      />

      <DialogueLog transcript={session.transcript} npcName={session.scenario.npc.name} />

      <GameActionBar
        isMicActive={session.isMicActive}
        phase={session.phase}
        onToggleMic={session.toggleMic}
        onExit={onExit}
      />
    </div>
  );
}
