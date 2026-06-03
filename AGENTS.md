# Portfolio_1 Agent Rules

This repo is the public Hunter Ho portfolio static site. Be direct, verify current files, and keep changes scoped to the requested section.

## CX

- Start non-trivial work with CX lookup: `/Users/exchange/docs/cx/index.md`.
- Treat CX as memory, not truth. Verify current files before editing.
- At task end, save a compact CX note when a reusable decision, failure, or project state changed.

## Project Guardrails

- Use TDD for behavior, loading, performance, and copy regressions. The main regression command is `pnpm test`.
- Run `node --check js/main.js` after JavaScript edits.
- Run `git diff --check` before completion.
- Use the in-app browser for visual verification of `http://127.0.0.1:4173/index.html`.
- Do not release, commit, push, or tag unless the user asks.

## Visual Direction

- Work top-to-bottom by section unless the user redirects.
- Preserve the selected Option C hero unless the user explicitly chooses a new hero.
- Avoid character-by-character headline typing. Hero headline changes must stay phrase-stable.
- Keep text as real HTML, not baked into generated images.
- One visible Hunter/person-focused visual zone at a time unless the user requests otherwise.

## Performance Rules

- Above-the-fold text must render before heavy effects.
- Hero image assets may be eager/high priority. Below-fold images and iframes must be lazy.
- Use a lightweight blur/gradient placeholder behind hero media for slow networks.
- Do not preload below-fold images such as footer, proof, poster, teaching, or project thumbnails.
- Optional libraries must be loaded only when the matching feature exists. Do not put optional plugin scripts in the critical page path.
- Prefer WebP for generated/raster production assets. Keep quality high, but do not ship multi-megabyte PNGs when a WebP source can replace them.

## Current Known Context

- Local dev server commonly runs at `http://127.0.0.1:4173`.
- Current public badge is `Hunter v1.6.6`, linked to `https://github.com/HunterHo07`.
- Current second section is `#trillionunicorn-lab`.
- Recent accepted hero popup behavior: show the small Hunter popup only after 15 seconds of hero dwell, rotate messages, and hide on scroll-away.
