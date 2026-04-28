# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Nano: the Gathering** is a static promotional website and card catalog for a dog-themed deck-building card game inspired by Magic: the Gathering. This `AI/` directory is the Stage 2 implementation, built with human-written code to the spec in `Requirements and Constraints.md`. The `minAI/` sibling directory is a completed Stage 1 vibe-coded reference implementation.

## Running Locally

No build step. Serve static files with any HTTP server:

```bash
python3 -m http.server 8000
```

Open `http://localhost:8000`. Direct `file://` access won't work because `fetch()` is used to load `cards.json`.

There are no tests or linting configured.

## Card Data

Card data lives in `../nano-data/cards.json` (relative to `AI/`). Each card object has:

```
id, name, type, role, treatCost (array), attack, defense, rulesText, flavorText, details, image
```

Images are PNGs in `../nano-data/media/`.

## Themes

Two named themes toggled by the user, persisted to `localStorage`:

| Token      | Cheese (light) | Chocolate (dark) |
| ---------- | -------------- | ---------------- |
| Primary    | `#ffcf10`      | `#362821`        |
| Secondary  | `#f0ac2e`      | `#533e36`        |
| Background | `#fffceb`      | `#212121`        |
| Accent     | `#b2a6b9`      | `#4c6344`        |
| Text       | `#372642`      | `#d9d0c1`        |

Design constraints: **no border-radius** (sharp, angular), juicy animations on all interactive elements, glow effects on dark (Chocolate) mode.

## Functionality Priorities

**Must:** hero/announcements section, about section, card catalog, search/filter by title + type + attack/defense/cost ranges.

**Should:** shopping (card packs and individual cards), deck builder (card IDs in `localStorage`).

**Nice:** downloadable PDF rules, dragon-shaped card detail modal, "add to deck" fly animation, homepage GIF.

## Reference Implementation

`minAI/` has a working single-page implementation (`index.html` + `index.js` + `style.css`) worth reading for:

- How `renderCards(cardArray)` / `applyFilters()` are structured
- How the info modal is reused for multiple content types by swapping innerHTML
- How theme toggling with `localStorage` works
