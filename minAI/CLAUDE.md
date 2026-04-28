# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Nano: the Gathering** is a static card-game webpage inspired by Magic: the Gathering, featuring cards based on a dog named Nano. It was vibe-coded — AI-generated via Claude prompts with no build toolchain.

## Running Locally

No build step. Serve the static files with any HTTP server:

```bash
python3 -m http.server 8000
```

Then open `http://localhost:8000`. (Direct `file://` access won't work due to `fetch()` for `cards.json`.)

There are no tests or linting configured.

## Architecture

Three files make up the entire app:

- **`index.html`** — structure: header with search/filter controls, card grid, two modal systems (card detail + info), footer
- **`index.js`** — all logic (~200 lines): fetches `nano-data/cards.json` on load, renders cards into a grid, handles real-time filtering, manages two modal types, and persists dark/light theme to `localStorage`
- **`style.css`** — MTG-inspired dark/light themes with CSS custom properties; CSS Grid card layout with hover 3D effects

Card data lives in `nano-data/cards.json` (array of card objects with `id`, `name`, `type`, `role`, `treatCost`, `attack`, `defense`, `rulesText`, `flavorText`, `details`, `image`). Images are PNGs in `nano-data/media/`.

### Key patterns in `index.js`

- `renderCards(cardArray)` — generates all card DOM elements; called after every filter change
- `applyFilters()` — reads all filter inputs and passes the filtered subset to `renderCards()`; wired to every filter's `input` event
- Info modal is reused for both "About" and "How to Play" content by swapping its inner HTML before opening
- Theme toggle adds/removes a `light-mode` class on `<body>` and saves the choice to `localStorage`
