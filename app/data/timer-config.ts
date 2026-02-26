export const COMPILER_PHASES = [
  {
    name: "LEX",
    fullName: "Lexer",
    color: "text-neon-green",
    borderColor: "border-neon-green",
    description: "Tokenizing source code",
  },
  {
    name: "PARSE",
    fullName: "Parser",
    color: "text-neon-cyan",
    borderColor: "border-neon-cyan",
    description: "Building abstract syntax tree",
  },
  {
    name: "OPT",
    fullName: "Optimizer",
    color: "text-neon-purple",
    borderColor: "border-neon-purple",
    description: "Optimizing intermediate code",
  },
  {
    name: "GEN",
    fullName: "Code Generator",
    color: "text-neon-orange",
    borderColor: "border-neon-orange",
    description: "Generating target machine code",
  },
] as const;

export type CompilerPhase = (typeof COMPILER_PHASES)[number];

export const DEFAULT_POMODORO_MINUTES = 50;
export const DEFAULT_BREAK_MINUTES = 10;

export type TimerMode = "pomodoro" | "break";
