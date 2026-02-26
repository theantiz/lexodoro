import type { CSSProperties } from "react";

type TimerHeaderProps = {
  statusText: string;
};

export default function TimerHeader({ statusText }: TimerHeaderProps) {
  return (
    <header className="reveal mb-4 text-center md:mb-5" data-gsap="reveal" style={{ "--reveal-delay": "80ms" } as CSSProperties}>
      <h1 className="mb-2 text-3xl font-bold font-mono leading-tight tracking-tight sm:text-4xl md:text-5xl">
        {"<"}
        <span className="text-white">Lexo</span>
        <span className="text-neon-green">doro</span>
        {"/>"}
      </h1>
      <p className="mx-auto max-w-md text-[11px] font-mono tracking-[0.14em] text-zinc-500 sm:text-xs">{statusText}</p>
    </header>
  );
}
