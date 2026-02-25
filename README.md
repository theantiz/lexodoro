# Lexodoro

Lexodoro is a compiler-themed Pomodoro timer built with Next.js.

## Features

- Focus and break timer modes
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

## Run Locally

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Scripts

```bash
npm run dev
npm run lint
npm run build
npm run start
```

## Tech Stack

- Next.js (App Router)
- React
- TypeScript
- Tailwind CSS v4
