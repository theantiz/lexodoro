"use client";

import { useState, useEffect, useCallback } from "react";

// Compiler phase configurations
const COMPILER_PHASES = [
  { name: "LEX", fullName: "Lexer", color: "text-neon-green", borderColor: "border-neon-green", description: "Tokenizing source code" },
  { name: "PARSE", fullName: "Parser", color: "text-neon-cyan", borderColor: "border-neon-cyan", description: "Building abstract syntax tree" },
  { name: "OPT", fullName: "Optimizer", color: "text-neon-purple", borderColor: "border-neon-purple", description: "Optimizing intermediate code" },
  { name: "GEN", fullName: "Code Generator", color: "text-neon-orange", borderColor: "border-neon-orange", description: "Generating target machine code" },
];

const DEFAULT_POMODORO_MINUTES = 25;
const DEFAULT_BREAK_MINUTES = 5;

type TimerMode = "pomodoro" | "break";

export default function Home() {
  const [pomodoroMinutes, setPomodoroMinutes] = useState(DEFAULT_POMODORO_MINUTES);
  const [breakMinutes, setBreakMinutes] = useState(DEFAULT_BREAK_MINUTES);
  const [timeLeft, setTimeLeft] = useState(DEFAULT_POMODORO_MINUTES * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [mode, setMode] = useState<TimerMode>("pomodoro");
  const [completedCycles, setCompletedCycles] = useState(0);
  const [totalFocusSeconds, setTotalFocusSeconds] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [showButtonIcons, setShowButtonIcons] = useState(true);
  const [draftPomodoroMinutes, setDraftPomodoroMinutes] = useState(String(DEFAULT_POMODORO_MINUTES));
  const [draftBreakMinutes, setDraftBreakMinutes] = useState(String(DEFAULT_BREAK_MINUTES));

  const pomodoroTime = pomodoroMinutes * 60;
  const breakTime = breakMinutes * 60;
  const totalTime = mode === "pomodoro" ? pomodoroTime : breakTime;
  const progress = ((totalTime - timeLeft) / totalTime) * 100;
  
  const activePhaseIndex = Math.min(
    Math.floor(progress / 25), 
    COMPILER_PHASES.length - 1
  );

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const currentPhaseInfo = COMPILER_PHASES[activePhaseIndex];
  const modeAccentClass = mode === "pomodoro" ? "text-neon-green" : "text-neon-cyan";
  const modeSoftBgClass = mode === "pomodoro" ? "bg-neon-green/15 border-neon-green/40" : "bg-neon-cyan/15 border-neon-cyan/40";
  const focusMinutes = Math.floor(totalFocusSeconds / 60);
  const statusText =
    mode === "break"
      ? "BREAK MODE ACTIVE..."
      : isRunning
        ? "COMPILING FOCUS..."
        : "READY TO COMPILE...";

  const switchMode = useCallback((nextMode: TimerMode) => {
    setMode(nextMode);
    setTimeLeft(nextMode === "pomodoro" ? pomodoroTime : breakTime);
  }, [pomodoroTime, breakTime]);
  const handleFullscreenToggle = useCallback(async () => {
    if (!document.fullscreenElement) {
      await document.documentElement.requestFullscreen();
    } else {
      await document.exitFullscreen();
    }
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    let modeSwitchTimeout: NodeJS.Timeout | null = null;

    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      const nextMode = mode === "pomodoro" ? "break" : "pomodoro";
      modeSwitchTimeout = setTimeout(() => {
        if (mode === "pomodoro") {
          setCompletedCycles((prev) => prev + 1);
          setTotalFocusSeconds((prev) => prev + pomodoroTime);
        }
        setIsRunning(false);
        switchMode(nextMode);
      }, 0);
    }

    return () => {
      if (interval) clearInterval(interval);
      if (modeSwitchTimeout) clearTimeout(modeSwitchTimeout);
    };
  }, [isRunning, timeLeft, mode, pomodoroTime, breakTime, switchMode]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.repeat) return;
      if (event.code === "Space") {
        event.preventDefault();
        setIsRunning((prev) => !prev);
        return;
      }
      const key = event.key.toLowerCase();
      if (key === "r") {
        setIsRunning(false);
        setTimeLeft(mode === "pomodoro" ? pomodoroTime : breakTime);
      }
      if (key === "s") {
        setIsRunning(false);
        switchMode(mode === "pomodoro" ? "break" : "pomodoro");
      }
      if (key === "f") {
        void handleFullscreenToggle();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [mode, pomodoroTime, breakTime, switchMode, handleFullscreenToggle]);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(Boolean(document.fullscreenElement));
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, []);

  const handleStartPause = () => setIsRunning(!isRunning);
  const handleReset = () => {
    setIsRunning(false);
    setTimeLeft(mode === "pomodoro" ? pomodoroTime : breakTime);
  };
  const handleSkip = () => {
    setIsRunning(false);
    switchMode(mode === "pomodoro" ? "break" : "pomodoro");
  };
  const handleApplySettings = () => {
    const nextPomodoro = Math.max(1, Math.min(180, Number.parseInt(draftPomodoroMinutes, 10) || DEFAULT_POMODORO_MINUTES));
    const nextBreak = Math.max(1, Math.min(90, Number.parseInt(draftBreakMinutes, 10) || DEFAULT_BREAK_MINUTES));
    setPomodoroMinutes(nextPomodoro);
    setBreakMinutes(nextBreak);
    setIsRunning(false);
    setTimeLeft(mode === "pomodoro" ? nextPomodoro * 60 : nextBreak * 60);
    setIsSettingsOpen(false);
  };

  return (
    <main className="relative mx-auto flex h-dvh w-full max-w-6xl flex-col items-center justify-center overflow-hidden px-4 py-4 md:px-8 md:py-6">
      {/* Header */}
      <header className="mb-3 text-center md:mb-4">
        <h1 className="mb-2 text-3xl font-bold font-mono leading-tight tracking-tight sm:text-4xl md:text-5xl">
          {`<`}
          <span className="text-white">Lexo</span>
          <span className="text-neon-green">doro</span>
          {`/>`}
        </h1>
        <p className="mx-auto max-w-md text-[11px] text-zinc-500 font-mono tracking-[0.14em] sm:text-xs">
          {statusText}
        </p>
      </header>

      {/* Main Timer Card */}
      <section className="terminal-card mb-3 w-full max-w-3xl p-4 pt-11 sm:p-5 sm:pt-11 md:mb-4 md:p-6 md:pt-12">
        {/* Phase indicator */}
        <div className="mb-4 flex items-center justify-between gap-4">
          <div className={`text-[11px] md:text-xs font-mono tracking-wide ${modeAccentClass}`}>
            {mode === "pomodoro" ? "▶ COMPILE_MODE" : "▶ BREAK_MODE"}
          </div>
          <div className="text-[11px] text-zinc-500 font-mono tracking-wide">
            PHASE: {currentPhaseInfo.name}
          </div>
        </div>

        {/* Timer Display */}
        <div className="mb-5 text-center">
          <div className={`text-5xl font-bold font-mono leading-none tracking-[0.05em] sm:text-6xl md:text-7xl ${modeAccentClass}`}>
            {formatTime(timeLeft)}
            <span className="cursor-blink">_</span>
          </div>
          <div className="mt-2 text-zinc-500 text-xs font-mono tracking-wide">
            {currentPhaseInfo.description}
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-5 h-1.5 w-full overflow-hidden rounded-full bg-zinc-800">
          <div 
            className="h-full progress-bar"
            style={{ 
              width: `${progress}%`,
              backgroundColor: mode === "pomodoro" ? '#3fb950' : '#58a6ff'
            }}
          ></div>
        </div>

        {/* Controls */}
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
          <button
            onClick={handleStartPause}
            className={`rounded px-5 py-2.5 font-mono text-xs font-bold tracking-wide btn-neon ${
              isRunning 
                ? "bg-zinc-800/70 text-zinc-100 border border-zinc-600"
                : `${modeSoftBgClass} ${modeAccentClass} border`
            }`}
          >
            {isRunning ? `${showButtonIcons ? "■ " : ""}PAUSE` : `${showButtonIcons ? "▶ " : ""}RUN`}
          </button>
          
          <button
            onClick={handleReset}
            className="rounded border border-zinc-700 bg-zinc-800/50 px-5 py-2.5 font-mono text-xs font-bold tracking-wide text-zinc-300 btn-neon"
          >
            {showButtonIcons ? "↺ " : ""}RESET
          </button>

          <button
            onClick={handleSkip}
            className="rounded border border-zinc-700 bg-zinc-800/50 px-5 py-2.5 font-mono text-xs font-bold tracking-wide text-zinc-300 btn-neon"
          >
            {showButtonIcons ? "⏭ " : ""}SKIP
          </button>
        </div>

        <div className="mt-3 flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-[10px] font-mono text-zinc-500 tracking-wide">
          <span><span className="text-zinc-300">SPACE</span> start/pause</span>
          <span><span className="text-zinc-300">R</span> reset</span>
          <span><span className="text-zinc-300">S</span> skip mode</span>
        </div>
      </section>

      {/* Compiler Phases Grid */}
      <section className="grid w-full max-w-3xl grid-cols-2 gap-2 md:grid-cols-4 md:gap-3">
        {COMPILER_PHASES.map((phase, index) => {
          const isActive = index <= activePhaseIndex && mode === "pomodoro";
          const isCurrent = index === activePhaseIndex && mode === "pomodoro";
          
          return (
            <div
              key={phase.name}
              className={`terminal-card p-3 pt-9 text-center transition-all duration-300 ${
                isActive ? phase.borderColor : "border-zinc-800"
              }`}
              style={{ 
                borderColor: isActive ? undefined : 'rgba(255,255,255,0.08)',
              }}
            >
              <div className={`mb-1 text-[11px] font-mono tracking-wide ${isActive ? phase.color : "text-zinc-600"}`}>
                PHASE {index + 1}
              </div>
              <div className={`text-lg font-bold font-mono leading-none ${isActive ? phase.color : "text-zinc-500"}`}>
                {phase.name}
              </div>
              <div className={`mt-2 text-[11px] font-mono tracking-wide ${isActive ? "text-zinc-400" : "text-zinc-600"}`}>
                {phase.fullName}
              </div>
              {isCurrent && (
                <div className="mt-3">
                  <span className="inline-block w-2 h-2 bg-neon-green rounded-full opacity-80"></span>
                </div>
              )}
            </div>
          );
        })}
      </section>

      {/* Stats Footer */}
      <footer className="mt-3 text-center md:mt-4">
        <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-1 text-[11px] font-mono text-zinc-600">
          <div>
            <span className="text-neon-purple">session</span>
            <span className="text-zinc-600 ml-2">{mode === "pomodoro" ? "COMPILING" : "BREAKING"}</span>
          </div>
          <div>
            <span className="text-neon-cyan">cycles</span>
            <span className="text-zinc-400 ml-2">{completedCycles}</span>
          </div>
          <div>
            <span className="text-neon-green">focus_min</span>
            <span className="text-zinc-400 ml-2">{focusMinutes}</span>
          </div>
        </div>
      </footer>

      {/* Corner brackets */}
      {isSettingsOpen && (
        <section className="fixed bottom-20 right-6 z-30 w-64 rounded border border-zinc-700 bg-zinc-900/95 p-3 font-mono text-xs text-zinc-300 shadow-xl">
          <div className="mb-3 text-[10px] tracking-[0.14em] text-zinc-500">SETTINGS</div>
          <label className="mb-2 block">
            <span className="mb-1 block text-[10px] tracking-wide text-zinc-500">FOCUS MINUTES</span>
            <input
              value={draftPomodoroMinutes}
              onChange={(event) => setDraftPomodoroMinutes(event.target.value)}
              inputMode="numeric"
              className="w-full rounded border border-zinc-700 bg-zinc-950 px-2 py-1.5 text-zinc-200 outline-none focus:border-neon-green/60"
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
              className="h-3.5 w-3.5 accent-green-500"
            />
            show button icons
          </label>
          <div className="flex gap-2">
            <button
              onClick={handleApplySettings}
              className="flex-1 rounded border border-neon-green/40 bg-neon-green/15 px-2 py-1.5 text-[10px] tracking-[0.14em] text-neon-green btn-neon"
            >
              APPLY
            </button>
            <button
              onClick={() => setIsSettingsOpen(false)}
              className="rounded border border-zinc-700 bg-zinc-800/50 px-2 py-1.5 text-[10px] tracking-[0.14em] text-zinc-300 btn-neon"
            >
              CLOSE
            </button>
          </div>
        </section>
      )}
      <div className="fixed bottom-6 right-6 z-20 flex items-center gap-2 rounded border border-zinc-800 bg-zinc-950/60 p-1">
        <button
          onClick={() => setIsSettingsOpen((prev) => !prev)}
          aria-label="Toggle settings"
          title="Settings"
          className={`rounded border px-3 py-2 font-mono text-[14px] tracking-[0.14em] btn-neon ${
            isSettingsOpen
              ? "border-neon-green/40 bg-neon-green/15 text-neon-green"
              : "border-zinc-700 bg-zinc-900/70 text-zinc-300"
          }`}
        >
          ⚙
        </button>
        <button
          onClick={handleFullscreenToggle}
          aria-label={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
          title={isFullscreen ? "Exit fullscreen (F)" : "Enter fullscreen (F)"}
          className={`rounded border px-3 py-2 font-mono text-[14px] tracking-[0.14em] btn-neon ${
            isFullscreen
              ? "border-neon-cyan/40 bg-neon-cyan/15 text-neon-cyan"
              : "border-zinc-700 bg-zinc-900/70 text-zinc-300"
          }`}
        >
          {isFullscreen ? "⤡" : "⤢"}
        </button>
      </div>
      <div className="fixed top-4 left-4 text-zinc-700 text-xl font-mono">┌</div>
      <div className="fixed top-4 right-4 text-zinc-700 text-xl font-mono">┐</div>
      <div className="fixed bottom-4 left-4 text-zinc-700 text-xl font-mono">└</div>
      <div className="fixed bottom-4 right-4 text-zinc-700 text-xl font-mono">┘</div>
    </main>
  );
}
