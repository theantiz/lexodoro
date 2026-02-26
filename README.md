# Lexodoro

Lexodoro is a compiler-themed Pomodoro timer built with Next.js.

## Features

- Focus and break timer modes
- Habit/discipline-inspired default cadence (`50m` focus / `10m` break)
- Compiler phase progression (Lex, Parse, Optimize, Generate)
- Live session stats (`cycles`, `focus_min`)
- Keyboard shortcuts:
  - `Space`: start/pause
  - `R`: reset
  - `S`: skip mode
  - `F`: toggle fullscreen
- Settings panel:
  - Update focus minutes
  - Update break minutes
  - Toggle control button icons
- Fullscreen mode toggle
- Custom Lexodoro app icon

## Timing Philosophy

Lexodoro uses a habit-and-discipline cadence by default:

- `50` minutes focus: long enough for meaningful deep work.
- `10` minutes break: deliberate reset before the next block.

The in-app messaging reinforces two principles:

- Show up consistently (habit) instead of waiting for motivation.
- Protect focused blocks and structured recovery (discipline).

## Compiler Phases

Lexodoro splits each focus session into 4 conceptual compiler stages:

1. **LEX (Lexer)**
   Breaks raw source text into tokens (keywords, identifiers, operators, literals).  
   In Lexodoro: start-of-session phase for warming up and defining the exact task.

2. **PARSE (Parser)**
   Organizes tokens into a structured representation (like an abstract syntax tree).  
   In Lexodoro: structure your work, outline steps, and create a clear implementation path.

3. **OPT (Optimizer)**
   Improves intermediate code for performance/efficiency without changing behavior.  
   In Lexodoro: refine your solution, simplify logic, remove waste, and improve quality.

4. **GEN (Code Generator)**
   Produces final target output (machine code or another executable form).  
   In Lexodoro: finalize results, ship changes, and prepare deliverables.

## Tech Stack

- Next.js (App Router)
- React
- TypeScript
- Tailwind CSS v4
