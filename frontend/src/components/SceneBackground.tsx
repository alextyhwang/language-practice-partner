import type { SceneType } from "../types";

interface Props {
  scene: SceneType;
  children?: React.ReactNode;
}

const sceneClass: Record<SceneType, string> = {
  tavern: "scene-tavern",
  street: "scene-street",
  shop: "scene-shop",
  "hotel-desk": "scene-hotel-desk",
  "hotel-concierge": "scene-hotel-concierge",
};

/** Decorative pixel props layered on the scene */
function SceneProps({ scene }: { scene: SceneType }) {
  if (scene === "tavern") {
    return (
      <>
        {/* Table left */}
        <div
          className="absolute bottom-[28%] left-[8%] h-3 w-8 border-2 border-[#5a3010] bg-[#4a2810]"
          aria-hidden="true"
        />
        {/* Table right */}
        <div
          className="absolute bottom-[28%] right-[10%] h-3 w-6 border-2 border-[#5a3010] bg-[#4a2810]"
          aria-hidden="true"
        />
        {/* Lantern glow on floor */}
        <div
          className="absolute bottom-[20%] left-1/2 h-16 w-24 -translate-x-1/2 dither-glow opacity-40"
          aria-hidden="true"
        />
      </>
    );
  }

  if (scene === "street") {
    return (
      <>
        {/* Building silhouettes */}
        <div className="absolute top-[10%] left-[5%] h-24 w-16 bg-[#0a0a1a] border-l-2 border-t-2 border-[#2a2a4a]" aria-hidden="true" />
        <div className="absolute top-[5%] right-[8%] h-32 w-20 bg-[#0a0a1a] border-r-2 border-t-2 border-[#2a2a4a]" aria-hidden="true" />
        {/* Street lamp glow */}
        <div
          className="absolute top-[25%] right-[22%] h-12 w-12 rounded-full bg-[#ffcc00] opacity-20 blur-sm"
          aria-hidden="true"
        />
      </>
    );
  }

  if (scene === "shop") {
    return (
      <>
        {/* Counter */}
        <div
          className="absolute bottom-[30%] left-[5%] right-[5%] h-4 border-t-2 border-[#8a6850] bg-[#5a4030]"
          aria-hidden="true"
        />
        {/* Products on shelf */}
        <div className="absolute top-[20%] left-[15%] h-4 w-3 bg-[#cc4422]" aria-hidden="true" />
        <div className="absolute top-[20%] left-[25%] h-4 w-3 bg-[#44aa44]" aria-hidden="true" />
        <div className="absolute top-[20%] right-[20%] h-4 w-3 bg-[#4488cc]" aria-hidden="true" />
      </>
    );
  }

  if (scene === "hotel-desk") {
    return (
      <>
        {/* Bell on desk */}
        <div
          className="absolute bottom-[38%] left-1/2 h-3 w-3 -translate-x-1/2 rounded-full border border-[#ffcc00] bg-[#cc9900]"
          aria-hidden="true"
        />
        {/* Pillar left */}
        <div className="absolute bottom-0 left-[12%] h-[45%] w-3 bg-[#3a2848]" aria-hidden="true" />
        <div className="absolute bottom-0 right-[12%] h-[45%] w-3 bg-[#3a2848]" aria-hidden="true" />
      </>
    );
  }

  if (scene === "hotel-concierge") {
    return (
      <>
        {/* Red carpet */}
        <div
          className="absolute bottom-0 left-1/2 h-[25%] w-[60%] -translate-x-1/2 bg-[#661122] opacity-60"
          aria-hidden="true"
        />
        {/* Chandelier */}
        <div className="absolute top-[3%] left-1/2 -translate-x-1/2" aria-hidden="true">
          <div className="mx-auto h-2 w-8 bg-[#ccaa44]" />
          <div className="mx-auto h-1 w-1 bg-[#888]" />
        </div>
      </>
    );
  }

  return null;
}

export function SceneBackground({ scene, children }: Props) {
  return (
    <div className={`scene-stage relative flex-1 min-h-[180px] ${sceneClass[scene]}`}>
      <SceneProps scene={scene} />
      {/* Atmospheric vignette */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background: "radial-gradient(ellipse at 50% 60%, transparent 30%, rgba(0,0,0,0.5) 100%)",
        }}
        aria-hidden="true"
      />
      <div className="relative z-10 flex h-full items-end justify-center gap-6 px-4 pb-4">
        {children}
      </div>
    </div>
  );
}
