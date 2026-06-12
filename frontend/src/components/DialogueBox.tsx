import type { SessionPhase } from "../types";

interface Props {
  speakerName: string;
  speakerLabel: string;
  text: string;
  translation?: string;
  phase: SessionPhase;
  partnerSpeaking: boolean;
  isEmpty?: boolean;
}

export function DialogueBox({
  speakerName,
  speakerLabel,
  text,
  translation,
  phase,
  partnerSpeaking,
  isEmpty,
}: Props) {
  const showPrompt = phase === "idle" && !partnerSpeaking && !isEmpty;
  const showTyping = partnerSpeaking;
  const showProcessing = phase === "processing";

  return (
    <div className="jrpg-dialogue relative mx-3 mb-1 px-4 py-3 sm:mx-4">
      {/* Name plate — SNES style tab */}
      <div className="absolute -top-3 left-4">
        <div className="jrpg-nameplate px-3 py-0.5">
          <span className="font-pixel-xs text-cream">{speakerName}</span>
          <span className="ml-2 font-pixel-xs text-cream-dim opacity-70">{speakerLabel}</span>
        </div>
      </div>

      <div className="min-h-[5rem] pt-2">
        {showTyping ? (
          <div className="flex items-center gap-2 py-2">
            <span className="font-rpg text-cream-dim">{speakerName} speaks</span>
            <span className="flex gap-1">
              {[0, 1, 2].map((i) => (
                <span
                  key={i}
                  className="inline-block h-2 w-2 bg-cream animate-orb-pulse"
                  style={{ animationDelay: `${i * 0.2}s` }}
                />
              ))}
            </span>
          </div>
        ) : showProcessing ? (
          <p className="font-rpg text-fire-bright">Processing response...</p>
        ) : isEmpty ? (
          <p className="font-rpg text-cream-dim italic">The encounter begins...</p>
        ) : (
          <>
            <p className="font-rpg text-lg leading-relaxed text-cream">{text}</p>
            {translation && (
              <p className="mt-2 border-t border-dashed border-white/20 pt-2 font-rpg-sm text-cream-dim">
                {translation}
              </p>
            )}
          </>
        )}
      </div>

      {showPrompt && (
        <div className="mt-1 flex items-center justify-end gap-1">
          <span className="font-pixel-xs text-fire-bright animate-blink">▼</span>
          <span className="font-pixel-xs text-cream-dim">Press SPEAK</span>
        </div>
      )}
    </div>
  );
}
