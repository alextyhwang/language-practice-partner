import type { NpcMood } from "../types";

export type SpriteType =
  | "server"
  | "passerby"
  | "clerk"
  | "receptionist"
  | "concierge"
  | "player";

interface Props {
  type: SpriteType;
  imageSrc?: string;
  imageAlt?: string;
  mood?: NpcMood;
  speaking?: boolean;
  facing?: "left" | "right";
  scale?: number;
  label?: string;
}

/** 16×16 pixel grid rendered as SVG, scaled with pixelated crisp edges */
function SpriteSvg({
  type,
  mood = "neutral",
  speaking = false,
}: {
  type: SpriteType;
  mood?: NpcMood;
  speaking?: boolean;
}) {
  const palettes: Record<SpriteType, { skin: string; hair: string; body: string; accent: string }> = {
    server: { skin: "#f0c090", hair: "#402010", body: "#cc4422", accent: "#ffffff" },
    passerby: { skin: "#d0a070", hair: "#808080", body: "#4466aa", accent: "#333333" },
    clerk: { skin: "#e0b080", hair: "#201010", body: "#228844", accent: "#ffffff" },
    receptionist: { skin: "#f0c0a0", hair: "#101010", body: "#663388", accent: "#ffcc00" },
    concierge: { skin: "#d0a880", hair: "#302010", body: "#1a1a4e", accent: "#ffcc00" },
    player: { skin: "#c0a070", hair: "#603020", body: "#2060c0", accent: "#ff9933" },
  };

  const p = palettes[type];
  const eyeOpen = mood !== "thinking";
  const mouthY = speaking ? 9 : mood === "happy" || mood === "welcoming" ? 9 : 8;
  const mouthW = speaking ? 3 : mood === "happy" ? 2 : 1;

  return (
    <svg
      viewBox="0 0 16 16"
      width="64"
      height="64"
      style={{ imageRendering: "pixelated" }}
      aria-hidden="true"
    >
      {/* Hair */}
      <rect x="5" y="1" width="6" height="2" fill={p.hair} />
      <rect x="4" y="3" width="8" height="2" fill={p.hair} />
      {/* Face */}
      <rect x="5" y="5" width="6" height="4" fill={p.skin} />
      {/* Eyes */}
      {eyeOpen ? (
        <>
          <rect x="6" y="6" width="1" height="2" fill="#101010" />
          <rect x="9" y="6" width="1" height="2" fill="#101010" />
        </>
      ) : (
        <>
          <rect x="6" y="7" width="2" height="1" fill="#101010" />
          <rect x="8" y="7" width="2" height="1" fill="#101010" />
        </>
      )}
      {/* Mouth */}
      <rect x={8 - Math.floor(mouthW / 2)} y={mouthY} width={mouthW} height="1" fill="#804040" />
      {/* Body */}
      <rect x="4" y="9" width="8" height="4" fill={p.body} />
      <rect x="5" y="10" width="2" height="2" fill={p.accent} opacity="0.5" />
      {/* Legs */}
      <rect x="5" y="13" width="2" height="2" fill="#303030" />
      <rect x="9" y="13" width="2" height="2" fill="#303030" />
      {/* Arms */}
      <rect x="3" y="9" width="1" height="3" fill={p.skin} />
      <rect x="12" y="9" width="1" height="3" fill={p.skin} />
      {/* Server apron */}
      {type === "server" && <rect x="6" y="9" width="4" height="3" fill={p.accent} />}
      {/* Concierge bow tie */}
      {type === "concierge" && (
        <>
          <rect x="7" y="9" width="2" height="1" fill={p.accent} />
          <rect x="6" y="10" width="1" height="1" fill={p.accent} />
          <rect x="9" y="10" width="1" height="1" fill={p.accent} />
        </>
      )}
    </svg>
  );
}

export function PixelSprite({
  type,
  imageSrc,
  imageAlt,
  mood = "neutral",
  speaking = false,
  facing = "right",
  scale = 1,
  label,
}: Props) {
  const shouldFlip = facing === "left" && !imageSrc;

  return (
    <div
      className={`flex flex-col items-center ${speaking ? "animate-sprite-bob" : ""}`}
      style={{
        transform: `${shouldFlip ? "scaleX(-1)" : ""} scale(${scale})`,
        transformOrigin: "bottom center",
      }}
    >
      {imageSrc ? (
        <img
          src={imageSrc}
          alt={imageAlt ?? label ?? `${type} character`}
          className="h-28 w-20 object-contain drop-shadow-[0_4px_0_rgba(0,0,0,0.35)]"
          draggable={false}
        />
      ) : (
        <SpriteSvg type={type} mood={mood} speaking={speaking} />
      )}
      {label && (
        <span className="mt-1 font-pixel-xs text-cream" style={{ transform: shouldFlip ? "scaleX(-1)" : undefined }}>
          {label}
        </span>
      )}
    </div>
  );
}
