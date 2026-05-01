# Nano: the Gathering — AI Implementation

This directory contains the AI-assisted implementation of the _Nano: the Gathering_ promotional website, built to the spec defined in `Requirements and Constraints.md`.

## What It Is

_Nano: the Gathering_ is a two-player deck-building card game starring Nano, a white Sealyham Terrier of extraordinary talent and questionable judgment. This website serves two purposes:

1. **Promotional site** — Excite new players with featured cards, game lore, a shop, and rules.
2. **Card catalog** — Let existing players search, filter, and reference all 32 cards in the set.

## Team Member Contributions

- **Jonah Ebent**: created repository, defined style colors, executed Claude commands
- **Dominic Antony** and **Adrian Johnson**: assisted in idea generation and webpage style advice

## Pages

| File           | Description                                                                                           |
| -------------- | ----------------------------------------------------------------------------------------------------- |
| `index.html`   | Homepage: hero section, latest news, featured card carousel, shop, cart                               |
| `catalog.html` | Full card catalog with search and advanced filters (name, type, rarity, cost, attack, defense ranges) |
| `deck.html`    | Deck builder: create and name multiple decks, add/remove cards, export to `.txt`                      |

## Features

- **Two themes** — Cheese (light) and Chocolate (dark), toggled per-user and persisted to `localStorage`
- **Card carousel** — Featured Rare and Uncommon cards on the homepage
- **Card modals** — Click any card for a full detail view with rules text, flavor text, and stats
- **Shop & cart** — Purchase starter decks, booster packs, and individual cards; cart persists in `localStorage`
- **Deck builder** — Multiple named decks stored in `localStorage`; respects per-card copy limits; fly animation when adding cards
- **How to Play modal** — In-page rules summary with a downloadable printable PDF rulebook
- **Image fallback** — Cards with missing artwork fall back to a placeholder image
- **Sharp, angular design** — No border-radius anywhere; glow effects in Chocolate mode; juicy animations on all interactive elements

## Running Locally

No build step required. Serve with any HTTP server from the `AI/` directory:

```bash
python3 -m http.server 8000
```

Then open `http://localhost:8000`. Direct `file://` access will not work because `fetch()` is used to load `nano-data/cards.json`.

## Use of AI

This implementation was built with significant assistance from **Claude Code** (Anthropic's AI coding assistant, powered by Claude Sonnet). The following work was AI-generated or AI-assisted:

- All HTML, CSS, and JavaScript files in this directory (`index.html`, `catalog.html`, `deck.html`, `shared.js`, `index.js`, `catalog.js`, `deck.js`, `style.css`)
- The `CLAUDE.md` project context file
- The AI image generator prompt used to produce `nano-data/media/placeholder.png` and the image itself
- The detailed prompt used to produce the printable PDF rulebook (`nano-data/Nano_The_Gathering_Rulebook.pdf`) and the PDF itself

Design decisions, game content, card data, card artwork, and all requirements were authored by the human developer. AI was used as an implementation and writing tool under direct human direction.
