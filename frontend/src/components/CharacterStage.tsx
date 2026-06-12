import { PixelSprite } from "./PixelSprite";
import { SceneBackground } from "./SceneBackground";
import type { NpcCharacter, NpcMood, SessionPhase } from "../types";

interface Props {
  npc: NpcCharacter;
  mood: NpcMood;
  partnerSpeaking: boolean;
  phase: SessionPhase;
  locationBadge: string;
}

const moodIndicator: Record<NpcMood, { icon: string; text: string }> = {
  neutral: { icon: "●", text: "..." },
  happy: { icon: "♪", text: "!" },
  thinking: { icon: "?", text: "?" },
  surprised: { icon: "!", text: "!!" },
  welcoming: { icon: "★", text: "♪" },
};

export function CharacterStage({
  npc,
  mood,
  partnerSpeaking,
  phase,
  locationBadge,
}: Props) {
  const isNpcActive = partnerSpeaking || phase === "listening";
  const isPlayerActive = phase === "speaking";
  const moodInfo = moodIndicator[mood];

  return (
    <div className="relative flex flex-col overflow-hidden">
      {/* Location banner */}
      <div className="absolute left-2 top-2 z-20">
        <span className="jrpg-nameplate px-2 py-0.5 font-pixel-xs text-cream">
          {locationBadge}
        </span>
      </div>

      <SceneBackground scene={npc.scene}>
        {/* Player sprite (left) */}
        <div className="relative flex flex-col items-center">
          {isPlayerActive && (
            <div
              className="absolute -top-4 left-1/2 -translate-x-1/2 font-pixel-xs text-fire animate-blink"
              aria-hidden="true"
            >
              ▼
            </div>
          )}
          <PixelSprite
            type="player"
            mood={isPlayerActive ? "happy" : "neutral"}
            speaking={isPlayerActive}
            facing="right"
            label="YOU"
          />
        </div>

        {/* NPC sprite (right) */}
        <div className="relative flex flex-col items-center">
          {isNpcActive && (
            <div
              className="absolute -top-4 left-1/2 -translate-x-1/2 font-pixel-xs text-fire-bright animate-blink"
              aria-hidden="true"
            >
              ▼
            </div>
          )}
          {/* Mood bubble */}
          {mood !== "neutral" && (
            <div
              className="absolute -right-1 -top-2 z-10 flex h-5 w-5 items-center justify-center border-2 border-white bg-dialogue-dark font-pixel-xs text-fire-bright"
              aria-label={`Mood: ${mood}`}
            >
              {moodInfo.icon}
            </div>
          )}
          <PixelSprite
            type={npc.sprite}
            mood={mood}
            speaking={partnerSpeaking}
            facing="left"
            label={npc.nameChinese}
          />
        </div>
      </SceneBackground>
    </div>
  );
}
