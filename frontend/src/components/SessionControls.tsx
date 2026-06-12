import type { SessionPhase } from "../types";

interface Props {
  isMicActive: boolean;
  phase: SessionPhase;
  onToggleMic: () => void;
}

export function SessionControls({ isMicActive, phase, onToggleMic }: Props) {
  const canSpeak = phase === "idle" || phase === "speaking";
  const isDisabled = !canSpeak && !isMicActive;

  return (
    <div className="flex items-center justify-center gap-5 px-4 py-4 sm:gap-6 sm:px-5 sm:py-5">
      <button
        type="button"
        className="game-btn game-btn-ghost flex h-12 w-12 items-center justify-center rounded-xl"
        aria-label="Session settings"
      >
        <svg width="20" height="20" viewBox="0 0 22 22" fill="none">
          <path
            d="M11 14C12.6569 14 14 12.6569 14 11C14 9.34315 12.6569 8 11 8C9.34315 8 8 9.34315 8 11C8 12.6569 9.34315 14 11 14Z"
            stroke="currentColor"
            strokeWidth="1.5"
          />
          <path
            d="M17.727 13.09C17.606 13.298 17.57 13.55 17.627 13.787L17.727 14.09C17.78 14.256 17.78 14.434 17.727 14.6L16.727 17.4C16.674 17.566 16.574 17.712 16.44 17.82C16.306 17.928 16.144 17.992 15.974 18.004L13.174 18.204C12.944 18.22 12.72 18.304 12.534 18.444L12.274 18.644C12.088 18.784 11.948 18.974 11.874 19.194L11.674 19.794C11.6 20.014 11.454 20.204 11.26 20.334C11.066 20.464 10.834 20.526 10.6 20.51L7.8 20.31C7.57 20.294 7.346 20.21 7.16 20.07L6.9 19.87C6.714 19.73 6.574 19.54 6.5 19.32L6.3 18.72C6.226 18.5 6.08 18.31 5.886 18.18C5.692 18.05 5.46 17.988 5.226 18.004L2.426 18.204C2.256 18.216 2.094 18.152 1.96 18.044C1.826 17.936 1.726 17.79 1.673 17.624L0.673 14.824C0.62 14.658 0.62 14.48 0.673 14.314L0.773 14.014C0.83 13.777 0.794 13.525 0.673 13.317L0.573 13.014C0.52 12.848 0.52 12.67 0.573 12.504L1.573 9.704C1.626 9.538 1.726 9.392 1.86 9.284C1.994 9.176 2.156 9.112 2.326 9.1L5.126 8.9C5.356 8.884 5.58 8.8 5.766 8.66L6.026 8.46C6.212 8.32 6.352 8.13 6.426 7.91L6.626 7.31C6.7 7.09 6.846 6.9 7.04 6.77C7.234 6.64 7.466 6.578 7.7 6.594L10.5 6.794C10.73 6.81 10.954 6.894 11.14 7.034L11.4 7.234C11.586 7.374 11.726 7.564 11.8 7.784L12 8.384C12.074 8.604 12.22 8.794 12.414 8.924C12.608 9.054 12.84 9.116 13.074 9.1L15.874 8.9C16.044 8.888 16.206 8.952 16.34 9.06C16.474 9.168 16.574 9.314 16.627 9.48L17.627 12.28C17.68 12.446 17.68 12.624 17.627 12.79L17.527 13.09H17.727Z"
            stroke="currentColor"
            strokeWidth="1.2"
          />
        </svg>
      </button>

      <button
        type="button"
        onClick={onToggleMic}
        disabled={isDisabled}
        className={`game-btn relative flex h-[72px] w-[72px] items-center justify-center rounded-2xl border-[3px] border-ink transition-all duration-200 ${
          isMicActive
            ? "game-btn-red rounded-2xl"
            : isDisabled
              ? "cursor-not-allowed border-ink/20 bg-surface-sunken text-ink-faint shadow-none"
              : "game-btn-green rounded-2xl"
        }`}
        aria-label={isMicActive ? "Stop speaking" : "Start speaking"}
      >
        {isMicActive ? (
          <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
            <rect x="6" y="6" width="16" height="16" rx="2" fill="currentColor" />
          </svg>
        ) : (
          <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
            <path
              d="M14 4C11.2386 4 9 6.23858 9 9V14C9 16.7614 11.2386 19 14 19C16.7614 19 19 16.7614 19 14V9C19 6.23858 16.7614 4 14 4Z"
              fill="currentColor"
            />
            <path
              d="M6 14H8C8 17.866 11.134 21 15 21C18.866 21 22 17.866 22 14H24C24 19.0751 19.8505 23.1651 14.9 23.49V27H15.1V23.49C10.1495 23.1651 6 19.0751 6 14Z"
              fill="currentColor"
            />
          </svg>
        )}

        {isMicActive && (
          <span className="absolute inset-0 rounded-2xl border-2 border-primary/40 animate-orb-pulse" />
        )}
      </button>

      <button
        type="button"
        className="game-btn game-btn-ghost flex h-12 w-12 items-center justify-center rounded-xl text-primary"
        aria-label="End session"
      >
        <svg width="20" height="20" viewBox="0 0 22 22" fill="none">
          <path
            d="M7 7L15 15M15 7L7 15"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
        </svg>
      </button>
    </div>
  );
}
