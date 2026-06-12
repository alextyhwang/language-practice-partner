import { useState } from "react";
import type { TranscriptTurn } from "../types";

interface Props {
  transcript: TranscriptTurn[];
  npcName: string;
}

export function DialogueLog({ transcript, npcName }: Props) {
  const [open, setOpen] = useState(false);

  if (transcript.length === 0) return null;

  return (
    <div className="mx-3 mb-1 border-2 border-cream-dim/30 bg-night/80">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between px-3 py-1.5 font-pixel-xs text-cream-dim hover:text-cream"
        aria-expanded={open}
      >
        <span>LOG ({transcript.length})</span>
        <span aria-hidden="true">{open ? "▲" : "▼"}</span>
      </button>

      {open && (
        <div className="max-h-24 overflow-y-auto border-t border-cream-dim/20 px-3 py-2 scrollbar-thin">
          {transcript.map((turn) => (
            <div key={turn.id} className="mb-1.5 last:mb-0">
              <span
                className={`font-pixel-xs ${
                  turn.speaker === "user" ? "text-accent" : "text-dialogue-light"
                }`}
              >
                {turn.speaker === "user" ? "YOU" : npcName}:
              </span>
              <p className="font-rpg-sm text-cream-dim">{turn.text}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
