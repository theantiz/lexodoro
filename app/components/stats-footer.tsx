import type { CSSProperties } from "react";
import type { TimerMode } from "../data/timer-config";

type StatsFooterProps = {
  mode: TimerMode;
  completedCycles: number;
  focusMinutes: number;
};

export default function StatsFooter({ mode, completedCycles, focusMinutes }: StatsFooterProps) {
  return (
    <footer className="reveal mt-3 pb-1 text-center md:mt-4 md:pb-0" data-gsap="reveal" style={{ "--reveal-delay": "360ms" } as CSSProperties}>
      <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-1 text-[11px] font-mono text-zinc-600">
        <div>
          <span className="text-neon-cyan">session</span>
          <span className="ml-2 text-zinc-400">{mode === "pomodoro" ? "COMPILING" : "BREAKING"}</span>
        </div>
        <div>
          <span className="text-neon-cyan">cycles</span>
          <span className="ml-2 text-zinc-400">{completedCycles}</span>
        </div>
        <div>
          <span className="text-neon-cyan">focus_min</span>
          <span className="ml-2 text-zinc-400">{focusMinutes}</span>
        </div>
      </div>
    </footer>
  );
}
