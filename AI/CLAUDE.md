# CLAUDE.md

## Scope

which files Claude may create or modify, and which it must never touch.

## Tech stack

- HTML5, CSS3, ES2020 JS only. No frameworks.

## File layout

Exact directory tree expected on VM under /srv/csc391web/team3/AI/ .

## Dataset Contract

File: /srv/csc391support/nanodata/<file>
Columns: ...
Loading: fetched at runtime via fetch()

## Style Tokens

palette, typography, and anything else you want to specify like spacing units, responsive breakpoints, etc.

| Token      | Value   |
| ---------- | ------- |
| --color-bg | #0B2545 |
| ...        | ...     |

## Commands

## Do Not

- Do not add build tools.
- Do not inline CSS.
- Do not invent data values.
- Do not delete files you did not create.

## Definition of Done

A task is done when:

1. The page loads without console errors.
2. The feature appears in the functionality table and works.
3. Style matches the tokens above.
