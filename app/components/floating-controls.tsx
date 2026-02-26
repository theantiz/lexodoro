import type { CSSProperties } from "react";
import { FiMaximize2, FiMinimize2, FiSettings } from "react-icons/fi";

type FloatingControlsProps = {
  isSettingsOpen: boolean;
  isFullscreen: boolean;
  onToggleSettings: () => void;
  onToggleFullscreen: () => void;
};

export default function FloatingControls({
  isSettingsOpen,
  isFullscreen,
  onToggleSettings,
  onToggleFullscreen,
}: FloatingControlsProps) {
  return (
    <div
      className="reveal fixed bottom-[calc(0.75rem+env(safe-area-inset-bottom))] right-4 z-20 flex items-center gap-2 rounded border border-zinc-800 bg-zinc-950/60 p-1 md:bottom-6 md:right-6"
      data-gsap="reveal"
      style={{ "--reveal-delay": "440ms" } as CSSProperties}
    >
      <button
        onClick={onToggleSettings}
        aria-label="Toggle settings"
        title="Settings"
        className={`btn-neon rounded border px-2.5 py-1.5 font-mono text-[13px] tracking-[0.14em] sm:px-3 sm:py-2 sm:text-[14px] ${
          isSettingsOpen ? "border-neon-green/40 bg-neon-green/15 text-neon-green" : "border-zinc-700 bg-zinc-900/70 text-zinc-300"
        }`}
      >
        <FiSettings size={14} aria-hidden />
      </button>
      <button
        onClick={onToggleFullscreen}
        aria-label={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
        title={isFullscreen ? "Exit fullscreen (F)" : "Enter fullscreen (F)"}
        className={`btn-neon rounded border px-2.5 py-1.5 font-mono text-[13px] tracking-[0.14em] sm:px-3 sm:py-2 sm:text-[14px] ${
          isFullscreen ? "border-neon-cyan/40 bg-neon-cyan/15 text-neon-cyan" : "border-zinc-700 bg-zinc-900/70 text-zinc-300"
        }`}
      >
        {isFullscreen ? <FiMinimize2 size={14} aria-hidden /> : <FiMaximize2 size={14} aria-hidden />}
      </button>
    </div>
  );
}
