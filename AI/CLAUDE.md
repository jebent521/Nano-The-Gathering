# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Nano: the Gathering** is a static promotional website and card catalog for a dog-themed deck-building card game inspired by Magic: the Gathering. This `AI/` directory is the implementation, built with human-written code to the spec in `Requirements and Constraints.md`.

## Running Locally

No build step. Serve static files with any HTTP server:

```bash
python3 -m http.server 8000
```

Open `http://localhost:8000`. Direct `file://` access won't work because `fetch()` is used to load `cards.json`.

There are no tests or linting configured.

## Card Data

Card data lives in `nano-data/cards.json` (relative to `AI/`). Images are PNGs in `nano-data/media/`.

There are three card `type` values: `Character`, `Action`, and `Treat`. Each card object has:

| Field | Type | Notes |
|---|---|---|
| `id` | number | unique (100s = Characters, 200s = Treats, 300s = Actions) |
| `name` | string | |
| `type` | string | `"Character"`, `"Action"`, or `"Treat"` |
| `role` | string | flavor subtitle |
| `rarity` | string | `"Common"`, `"Uncommon"`, or `"Rare"` |
| `cardCount` | number | copies in a standard deck |
| `treatCost` | number | resource cost to play; always `0` for Treat cards |
| `attack` | number \| null | null for Action and Treat cards |
| `defense` | number \| null | null for Action and Treat cards |
| `rulesText` | string | |
| `flavorText` | string \| null | null for Action and Treat cards |
| `details` | string \| null | longer description; null for some cards |
| `image` | string | path relative to `nano-data/` |

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

