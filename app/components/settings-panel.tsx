type SettingsPanelProps = {
  draftPomodoroMinutes: string;
  draftBreakMinutes: string;
  showButtonIcons: boolean;
  setDraftPomodoroMinutes: (value: string) => void;
  setDraftBreakMinutes: (value: string) => void;
  setShowButtonIcons: (checked: boolean) => void;
  onApply: () => void;
  onClose: () => void;
};

export default function SettingsPanel({
  draftPomodoroMinutes,
  draftBreakMinutes,
  showButtonIcons,
  setDraftPomodoroMinutes,
  setDraftBreakMinutes,
  setShowButtonIcons,
  onApply,
  onClose,
}: SettingsPanelProps) {
  return (
    <section
      data-gsap="reveal"
      className="reveal fixed bottom-[calc(4.25rem+env(safe-area-inset-bottom))] left-4 right-4 z-30 rounded border border-zinc-700 bg-zinc-900/95 p-3 font-mono text-xs text-zinc-300 shadow-xl sm:bottom-20 sm:left-auto sm:right-4 sm:w-72"
    >
      <div className="mb-3 text-[10px] tracking-[0.14em] text-zinc-500">SETTINGS</div>
      <label className="mb-2 block">
        <span className="mb-1 block text-[10px] tracking-wide text-zinc-500">FOCUS MINUTES</span>
        <input
          value={draftPomodoroMinutes}
          onChange={(event) => setDraftPomodoroMinutes(event.target.value)}
          inputMode="numeric"
          className="w-full rounded border border-zinc-700 bg-zinc-950 px-2 py-1.5 text-zinc-200 outline-none focus:border-neon-cyan/60"
        />
      </label>
      <label className="mb-2 block">
        <span className="mb-1 block text-[10px] tracking-wide text-zinc-500">BREAK MINUTES</span>
        <input
          value={draftBreakMinutes}
          onChange={(event) => setDraftBreakMinutes(event.target.value)}
          inputMode="numeric"
          className="w-full rounded border border-zinc-700 bg-zinc-950 px-2 py-1.5 text-zinc-200 outline-none focus:border-neon-cyan/60"
        />
      </label>
      <label className="mb-3 flex items-center gap-2 text-[11px] text-zinc-300">
        <input
          type="checkbox"
          checked={showButtonIcons}
          onChange={(event) => setShowButtonIcons(event.target.checked)}
          className="h-3.5 w-3.5 accent-blue-500"
        />
        show button icons
      </label>
      <div className="flex gap-2">
        <button
          onClick={onApply}
          className="btn-neon flex-1 rounded border border-neon-cyan/40 bg-neon-cyan/15 px-2 py-1.5 text-[10px] tracking-[0.14em] text-neon-cyan"
        >
          APPLY
        </button>
        <button
          onClick={onClose}
          className="btn-neon rounded border border-zinc-700 bg-zinc-800/50 px-2 py-1.5 text-[10px] tracking-[0.14em] text-zinc-300"
        >
          CLOSE
        </button>
      </div>
    </section>
  );
}
