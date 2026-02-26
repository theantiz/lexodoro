"use client";

import { useState, useEffect, useCallback, useRef, type CSSProperties } from "react";
import { gsap } from "gsap";
import CornerBrackets from "./components/corner-brackets";
import FloatingControls from "./components/floating-controls";
import PhasesGrid from "./components/phases-grid";
import SettingsPanel from "./components/settings-panel";
import StatsFooter from "./components/stats-footer";
import TimerCard from "./components/timer-card";
import TimerHeader from "./components/timer-header";
import {
  COMPILER_PHASES,
  DEFAULT_BREAK_MINUTES,
  DEFAULT_POMODORO_MINUTES,
  type TimerMode,
} from "./data/timer-config";
type WakeLockSentinelLike = {
  released: boolean;
  release: () => Promise<void>;
};
type NavigatorWithWakeLock = Navigator & {
  wakeLock?: {
    request: (type: "screen") => Promise<WakeLockSentinelLike>;
  };
};
type WebkitDocument = Document & {
  webkitExitFullscreen?: () => Promise<void> | void;
  webkitFullscreenElement?: Element | null;
};
type WebkitElement = HTMLElement & {
  webkitRequestFullscreen?: () => Promise<void> | void;
};

export default function Home() {
  const rootRef = useRef<HTMLElement | null>(null);
  const progressBarRef = useRef<HTMLDivElement | null>(null);
  const wakeLockRef = useRef<WakeLockSentinelLike | null>(null);
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
    const doc = document as WebkitDocument;
    const root = document.documentElement as WebkitElement;
    const isCurrentlyFullscreen = Boolean(doc.fullscreenElement ?? doc.webkitFullscreenElement);

    if (!isCurrentlyFullscreen) {
      if (root.requestFullscreen) {
        await root.requestFullscreen();
        return;
      }
      if (root.webkitRequestFullscreen) {
        await root.webkitRequestFullscreen();
      }
      return;
    }

    if (doc.exitFullscreen) {
      await doc.exitFullscreen();
      return;
    }
    if (doc.webkitExitFullscreen) {
      await doc.webkitExitFullscreen();
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
    const doc = document as WebkitDocument;
    const handleFullscreenChange = () => {
      setIsFullscreen(Boolean(doc.fullscreenElement ?? doc.webkitFullscreenElement));
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    document.addEventListener("webkitfullscreenchange", handleFullscreenChange as EventListener);
    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
      document.removeEventListener("webkitfullscreenchange", handleFullscreenChange as EventListener);
    };
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

  const requestWakeLock = useCallback(async () => {
    const nav = navigator as NavigatorWithWakeLock;
    if (!nav.wakeLock || wakeLockRef.current) return;

    try {
      wakeLockRef.current = await nav.wakeLock.request("screen");
    } catch {
      wakeLockRef.current = null;
    }
  }, []);

  const releaseWakeLock = useCallback(async () => {
    if (!wakeLockRef.current) return;

    try {
      await wakeLockRef.current.release();
    } catch {
      // no-op: release can fail if lock is already released by the browser
    } finally {
      wakeLockRef.current = null;
    }
  }, []);

  useEffect(() => {
    if (!rootRef.current) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        "[data-gsap='reveal']",
        { y: 18, autoAlpha: 0, filter: "blur(6px)" },
        {
          y: 0,
          autoAlpha: 1,
          filter: "blur(0px)",
          duration: 0.9,
          ease: "power3.out",
          stagger: 0.1,
          clearProps: "filter",
        },
      );
    }, rootRef);

    return () => ctx.revert();
  }, []);

  useEffect(() => {
    if (!progressBarRef.current) return;
    gsap.to(progressBarRef.current, {
      width: `${progress}%`,
      duration: 0.8,
      ease: "power3.out",
    });
  }, [progress]);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible" && isRunning) {
        void requestWakeLock();
      }
    };

    if (isRunning) {
      void requestWakeLock();
      document.addEventListener("visibilitychange", handleVisibilityChange);
    } else {
      void releaseWakeLock();
    }

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      if (!isRunning) return;
      void releaseWakeLock();
    };
  }, [isRunning, requestWakeLock, releaseWakeLock]);

  return (
    <main
      ref={rootRef}
      className="smooth-scroll relative mx-auto flex min-h-dvh w-full max-w-6xl flex-col items-center justify-start overflow-x-hidden overflow-y-auto px-4 pb-[calc(9rem+env(safe-area-inset-bottom))] pt-6 sm:pb-28 md:px-8 md:pt-8 lg:justify-center lg:pb-8"
      style={
        mode === "break"
          ? ({ "--neon-green": "var(--neon-cyan)" } as CSSProperties)
          : undefined
      }
    >
      <TimerHeader statusText={statusText} />

      <TimerCard
        mode={mode}
        modeAccentClass={modeAccentClass}
        modeSoftBgClass={modeSoftBgClass}
        currentPhaseName={currentPhaseInfo.name}
        timeLabel={formatTime(timeLeft)}
        currentPhaseDescription={currentPhaseInfo.description}
        isRunning={isRunning}
        showButtonIcons={showButtonIcons}
        progressBarRef={progressBarRef}
        onStartPause={handleStartPause}
        onReset={handleReset}
        onSkip={handleSkip}
      />

      <PhasesGrid activePhaseIndex={activePhaseIndex} mode={mode} />

      <StatsFooter mode={mode} completedCycles={completedCycles} focusMinutes={focusMinutes} />

      {isSettingsOpen && (
        <SettingsPanel
          draftPomodoroMinutes={draftPomodoroMinutes}
          draftBreakMinutes={draftBreakMinutes}
          showButtonIcons={showButtonIcons}
          setDraftPomodoroMinutes={setDraftPomodoroMinutes}
          setDraftBreakMinutes={setDraftBreakMinutes}
          setShowButtonIcons={setShowButtonIcons}
          onApply={handleApplySettings}
          onClose={() => setIsSettingsOpen(false)}
        />
      )}

      <FloatingControls
        isSettingsOpen={isSettingsOpen}
        isFullscreen={isFullscreen}
        onToggleSettings={() => setIsSettingsOpen((prev) => !prev)}
        onToggleFullscreen={handleFullscreenToggle}
      />

      <CornerBrackets />
    </main>
  );
}
