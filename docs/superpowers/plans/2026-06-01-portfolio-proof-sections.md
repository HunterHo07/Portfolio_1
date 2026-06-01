# Portfolio Proof Sections Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add polished founder, OSS/startup, speaker/teaching, and hackathon proof sections to the portfolio while preserving privacy.

**Architecture:** Keep the site static and extend `index.html`, `css/style.css`, `css/responsive.css`, and `tests/portfolio-content.test.js`. Add image assets under `images/teaching/`. Use existing modal/detail styles where useful, but do not introduce new JavaScript unless required.

**Tech Stack:** Static HTML, CSS, current portfolio JS, pnpm test runner, built-in image generation for one raster banner.

---

### Task 1: Add Tests For Required Proof Content

**Files:**
- Modify: `tests/portfolio-content.test.js`

- [ ] Add required text assertions for `TrillionUnicorn`, `Speaker & Teaching`, `Hackathon Wins`, `Free IT Speaker`, `Online / Offline / Onsite`, and `Deriv AI Hackathon Winner 2025`.
- [ ] Add required URL assertions for the seven public TrillionUnicorn repositories.
- [ ] Add required asset assertions for the teaching proof screenshots and generated teaching banner.
- [ ] Run `pnpm test` and verify it fails before implementation because the new content is missing.

### Task 2: Add Project Assets

**Files:**
- Create: `images/teaching/teaching-n8n-event.jpeg`
- Create: `images/teaching/teaching-non-it-vs-real-it.jpeg`
- Create: `images/teaching/teaching-tech-readiness.jpeg`
- Create: `images/teaching/teaching-productivity.jpeg`
- Create: `images/teaching/speaker-teaching-banner.png`

- [ ] Copy the four user-provided teaching screenshots into `images/teaching/`.
- [ ] Generate one branded teaching/speaker banner with imagegen and save it as `images/teaching/speaker-teaching-banner.png`.

### Task 3: Update Founder Vision Markup

**Files:**
- Modify: `index.html`

- [ ] Convert Founder Vision into a hero-style proof block with text overlay and background image.
- [ ] Keep the tall poster as a visible proof image, not a cropped thumbnail.
- [ ] Add portfolio-safe stats: `18+ Years Hands-On IT`, `Builder Since 2007`, `AI Automation`, and `Architecture + Integration`.

### Task 4: Add TrillionUnicorn OSS / Startup Section

**Files:**
- Modify: `index.html`

- [ ] Add a new section `TrillionUnicorn OSS & Startup Lab`.
- [ ] Include seven public projects: OpenChance, WorkFree, CTOrendang, GameMind, CheckMe, 3Wallet, AhFai.
- [ ] Mention private backend/infra only as private platform foundation without repo links or sensitive details.

### Task 5: Add Speaker & Teaching Section

**Files:**
- Modify: `index.html`

- [ ] Add a new section `Speaker & Teaching`.
- [ ] Include positioning for free IT speaker, free teaching, mentor, and invitations.
- [ ] Include online/offline/onsite availability.
- [ ] Add proof cards using the four teaching images.

### Task 6: Add Hackathon Wins Section

**Files:**
- Modify: `index.html`

- [ ] Add a new section `Hackathon Wins`.
- [ ] Include Deriv AI Hackathon Winner 2025, SUI Hackathon Winner 2025, IOTA Hackathon Malaysia Winner 2025, and ETH Hackathon Winner 2023.
- [ ] Keep copy achievement-focused, not CV/employment-focused.

### Task 7: Style Proof Sections

**Files:**
- Modify: `css/style.css`
- Modify: `css/responsive.css`

- [ ] Add premium responsive styling for Founder Vision background treatment, TrillionUnicorn cards, teaching proof cards, and hackathon cards.
- [ ] Ensure dark and light theme readability.
- [ ] Ensure mobile cards stack cleanly and the tall poster remains fully visible.

### Task 8: Verify, Commit, Push

**Files:**
- Modify: all above

- [ ] Run `pnpm test`.
- [ ] Run `git diff --check`.
- [ ] Verify local render in the browser at desktop/mobile widths.
- [ ] Commit with message `Expand portfolio proof sections`.
- [ ] Push `main`.
- [ ] Verify GitHub Pages build and live content.

