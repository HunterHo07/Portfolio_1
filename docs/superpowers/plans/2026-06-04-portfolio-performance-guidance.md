# Portfolio Performance Guidance Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add durable project guidance and enforce the portfolio loading rules requested by the user.

**Architecture:** Keep the static site structure. Enforce critical-path rules in `tests/portfolio-content.test.js`, move optional plugin loading into `js/main.js`, and keep the hero readable with eager media plus a lightweight blur placeholder.

**Tech Stack:** Static HTML/CSS/JavaScript, jQuery for legacy code, optional lazy-loaded UI plugins, pnpm test runner.

---

### Task 1: Guidance Files

**Files:**
- Create: `AGENTS.md`
- Create: `SKILL.md`
- Create: `LLM.md`

- [x] Add project rules, repeatable workflow, and LLM notes covering CX, TDD, performance, hero, Startup Lab, and verification.

### Task 2: Loading Regression

**Files:**
- Modify: `tests/portfolio-content.test.js`

- [x] Add assertions for guidance files, no external head scripts, hero-only preload/eager rules, hero blur placeholder, and optional JS plugin lazy loading.
- [x] Run `pnpm test` and verify it fails before implementation.

### Task 3: Critical Path Loading

**Files:**
- Modify: `index.html`
- Modify: `css/style.css`
- Modify: `js/main.js`

- [x] Remove unused render-blocking head scripts.
- [x] Add Google Font preconnect and `display=swap`.
- [x] Preload only the active hero source image.
- [x] Mark the hero source eager/high priority.
- [x] Add lightweight hero blur placeholder.
- [x] Lazy-load optional JS plugins from `main.js`.

### Task 4: Verification

**Commands:**
- `pnpm test`
- `node --check js/main.js`
- `git diff --check`

- [x] Verify rendered hero and resource loading in Browser/IAB.
