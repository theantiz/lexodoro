import type { CSSProperties } from "react";
import { COMPILER_PHASES, type TimerMode } from "../data/timer-config";

type PhasesGridProps = {
  activePhaseIndex: number;
  mode: TimerMode;
};

export default function PhasesGrid({ activePhaseIndex, mode }: PhasesGridProps) {
  return (
    <section
      className="reveal grid w-full max-w-3xl grid-cols-2 gap-2 sm:gap-3 lg:grid-cols-4"
      data-gsap="reveal"
      style={{ "--reveal-delay": "280ms" } as CSSProperties}
    >
      {COMPILER_PHASES.map((phase, index) => {
        const isActive = index <= activePhaseIndex && mode === "pomodoro";
        const isCurrent = index === activePhaseIndex && mode === "pomodoro";

        return (
          <div
            key={phase.name}
            className={`terminal-card phase-card glass-lift p-3 pt-9 text-center transition-all duration-300 ${
              isActive ? phase.borderColor : "border-zinc-800"
            }`}
            style={{ borderColor: isActive ? undefined : "rgba(255,255,255,0.08)" }}
          >
            <div className={`mb-1 text-[11px] font-mono tracking-wide ${isActive ? phase.color : "text-zinc-600"}`}>PHASE {index + 1}</div>
            <div className={`text-lg font-bold font-mono leading-none ${isActive ? phase.color : "text-zinc-500"}`}>{phase.name}</div>
            <div className={`mt-2 text-[11px] font-mono tracking-wide ${isActive ? "text-zinc-400" : "text-zinc-600"}`}>{phase.fullName}</div>
            {isCurrent && (
              <div className="mt-3">
                <span className="phase-current inline-block h-2 w-2 rounded-full bg-neon-green opacity-80" />
              </div>
            )}
          </div>
        );
      })}
    </section>
  );
}
