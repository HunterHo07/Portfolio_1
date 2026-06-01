# Portfolio Interactive Upgrade Design

## Decision State

The user delegated remaining product and design decisions to Codex on 2026-06-01. The implementation should prioritize a premium but credible portfolio: stronger selling language, more motion, better image assets, and visible proof of mobile app development without fake framework claims.

## Scope

- Keep the portfolio as static HTML/CSS/JS. Do not migrate to SvelteKit unless a concrete feature cannot be built safely in the current stack.
- Use the founder banner as the main header hero background, resized and polished for the hero/header section.
- Add parallax background depth, scroll reveal animation, subtle card motion, and reduced-motion support.
- Add a gray husky helper that appears near the bottom of the page, rotates cute EN/CN messages, and opens a WhatsApp prompt/link to `+60 0162199186`.
- Add EN/CN i18n for core visible portfolio text and interactive controls, excluding text embedded inside screenshots or raster proof images.
- Rename `Demo Mini Games` to `Games Demo` and expand it from 3 to 9 game cards.
- Rename `RunJian 3D Assets Demo` to `3D Models Demo` and expand it from 2 to 3 cards.
- Add a dedicated `Mobile App Demo` section with two selected demos: WarrantyScan Mobile and NameCard Mobile.
- Create two public GitHub repositories for the mobile demos and link them from the portfolio.
- Upgrade project Details from short plain text into a richer proof modal using premium but credible wording and reusable clickable skill chips with 3-5 second mini demo panels.
- Preserve the Project 24 URL change to `https://runjian-irun-simworld.vercel.app/`.

## Mobile Demo Direction

Build two lightweight, mobile-first standalone demos:

- `WarrantyScan Mobile`: receipt/item capture, warranty timeline, reminders, service alerts, offline-friendly mobile UX.
- `NameCard Mobile`: QR/NFC contact sharing, profile preview, networking mode, contact exchange flow.

Each demo should be static and deployable through GitHub Pages. Use mobile-app-facing tech language in the portfolio: Flutter-ready UX, React Native-ready patterns, PWA, responsive mobile shell, camera/scan flow mock, local state, offline UX, notification/reminder design, API-ready architecture.

## Details Modal Direction

The modal should feel like a sales proof layer:

- Project title and story.
- Tech stack chips.
- Skills and client value.
- Rich about text explaining what the project helps a client do.
- Clickable skill chips that open a small skill demo panel inside the same modal.

Skill demo chips can be reused across projects. Examples: Responsive UX, Image Optimization, Loading Animation, Product Storytelling, Marketplace Flow, AI-ready Workflow, Dashboard UX, 3D Web UI, PWA Mobile Shell.

## Visual Direction

Use a premium but readable design language already present in the portfolio:

- Dark/light theme compatible.
- No unreadable glitch titles in dark mode.
- Hero banner should be image-led with readable text overlays.
- Motion should add polish without making the page feel noisy.
- Respect `prefers-reduced-motion`.

## Verification

- Static content test must pass.
- Browser check must confirm no desktop/mobile horizontal overflow.
- Theme toggle, language toggle, Details modal, skill mini demo, and husky WhatsApp prompt must work.
- Project 24 must use the new RunJian URL.
- Mobile app section must show two apps and GitHub/live links.
- Games Demo must show nine cards.
- 3D Models Demo must show three cards.
