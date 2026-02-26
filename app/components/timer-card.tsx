import type { CSSProperties, RefObject } from "react";
import { FiPlay, FiRotateCcw, FiSkipForward, FiSquare } from "react-icons/fi";

type TimerCardProps = {
  mode: "pomodoro" | "break";
  modeAccentClass: string;
  modeSoftBgClass: string;
  currentPhaseName: string;
  timeLabel: string;
  currentPhaseDescription: string;
  isRunning: boolean;
  showButtonIcons: boolean;
  progressBarRef: RefObject<HTMLDivElement | null>;
  onStartPause: () => void;
  onReset: () => void;
  onSkip: () => void;
};

export default function TimerCard({
  mode,
  modeAccentClass,
  modeSoftBgClass,
  currentPhaseName,
  timeLabel,
  currentPhaseDescription,
  isRunning,
  showButtonIcons,
  progressBarRef,
  onStartPause,
  onReset,
  onSkip,
}: TimerCardProps) {
  return (
    <section
      className="terminal-card glass-lift reveal mb-4 w-full max-w-3xl p-4 pt-11 sm:p-5 sm:pt-11 md:mb-5 md:p-6 md:pt-12"
      data-gsap="reveal"
      style={{ "--reveal-delay": "180ms" } as CSSProperties}
    >
      <div className="mb-4 flex items-center justify-between gap-4">
        <div className={`text-[11px] font-mono tracking-wide md:text-xs ${modeAccentClass}`}>
          <span className="inline-flex items-center gap-1">
            <FiPlay size={10} aria-hidden />
            {mode === "pomodoro" ? "COMPILE_MODE" : "BREAK_MODE"}
          </span>
        </div>
        <div className="text-[11px] font-mono tracking-wide text-zinc-500">PHASE: {currentPhaseName}</div>
      </div>

      <div className="mb-5 text-center">
        <div className={`text-5xl font-bold font-mono leading-none tracking-[0.05em] sm:text-6xl lg:text-7xl ${modeAccentClass} ${isRunning ? "timer-live" : ""}`}>
          {timeLabel}
          <span className="cursor-blink">_</span>
        </div>
        <div className="mt-2 text-xs font-mono tracking-wide text-zinc-500">{currentPhaseDescription}</div>
      </div>

      <div className="mb-5 h-1.5 w-full overflow-hidden rounded-full bg-zinc-800">
        <div ref={progressBarRef} className="h-full progress-bar" style={{ width: "0%", backgroundColor: "#58a6ff" }} />
      </div>

      <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
        <button
          onClick={onStartPause}
          className={`rounded px-5 py-2.5 font-mono text-xs font-bold tracking-wide btn-neon ${
            isRunning ? "border border-zinc-600 bg-zinc-800/70 text-zinc-100" : `${modeSoftBgClass} ${modeAccentClass} border`
          }`}
        >
          <span className="inline-flex items-center gap-1.5">
            {showButtonIcons ? (isRunning ? <FiSquare size={12} aria-hidden /> : <FiPlay size={12} aria-hidden />) : null}
            {isRunning ? "PAUSE" : "RUN"}
          </span>
        </button>

        <button
          onClick={onReset}
          className="btn-neon rounded border border-zinc-700 bg-zinc-800/50 px-5 py-2.5 font-mono text-xs font-bold tracking-wide text-zinc-300"
        >
          <span className="inline-flex items-center gap-1.5">
            {showButtonIcons ? <FiRotateCcw size={12} aria-hidden /> : null}
            RESET
          </span>
        </button>

        <button
          onClick={onSkip}
          className="btn-neon rounded border border-zinc-700 bg-zinc-800/50 px-5 py-2.5 font-mono text-xs font-bold tracking-wide text-zinc-300"
        >
          <span className="inline-flex items-center gap-1.5">
            {showButtonIcons ? <FiSkipForward size={12} aria-hidden /> : null}
            SKIP
          </span>
        </button>
      </div>

      <div className="mt-3 hidden flex-wrap items-center justify-center gap-x-4 gap-y-1 text-[10px] font-mono tracking-wide text-zinc-500 xl:flex">
        <span>
          <span className="text-zinc-300">SPACE</span> start/pause
        </span>
        <span>
          <span className="text-zinc-300">R</span> reset
        </span>
        <span>
          <span className="text-zinc-300">S</span> skip mode
        </span>
      </div>
    </section>
  );
}
