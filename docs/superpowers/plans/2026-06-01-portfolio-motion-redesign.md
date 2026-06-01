# Portfolio Motion Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Upgrade the static portfolio with Facebook-reel-inspired motion, privacy-safe teaching visuals, stronger proof sections, and a sticky wandering husky contact assistant.

**Architecture:** Keep the portfolio as static HTML/CSS/JS. Add reusable motion and interaction helpers in `js/main.js`, add section-specific markup in `index.html`, and extend `css/style.css` with a cohesive animation system that works in both light and dark themes.

**Tech Stack:** Static HTML5, CSS3, JavaScript, existing Bootstrap/jQuery layout, pnpm test runner, built-in Image Gen for project-bound privacy-safe raster assets.

---

## File Structure

- Modify `index.html`: add hero CTA buttons, privacy-safe teaching proof markup, richer proof motion hooks, husky contact choices, and celebration canvas/root.
- Modify `css/style.css`: add motion tokens, parallax planes, kinetic section transitions, magnetic CTA styling, privacy-safe teaching card design, proof-card shine, demo lab polish, sticky wandering husky, contact bubble, and reduced-motion fallback.
- Modify `js/main.js`: add magnetic pointer glow, scroll progress CSS variables, safe reveal behavior, husky random movement/messages/contact popup/celebration, and i18n keys.
- Modify `tests/portfolio-content.test.js`: assert new motion hooks, privacy-safe class visual assets, husky behavior hooks, CTA copy, and motion safety tokens.
- Create `images/teaching/teaching-safe-stage.png`: privacy-safe generated class visual with no sensitive text/logo/icon.
- Create `images/teaching/teaching-safe-online.png`: privacy-safe generated online teaching visual.
- Create `images/teaching/teaching-safe-onsite.png`: privacy-safe generated onsite classroom visual.
- Create `images/teaching/teaching-safe-workflow.png`: privacy-safe generated automation/workflow teaching visual.

## Task 1: Add Test Coverage For New Requirements

**Files:**
- Modify: `tests/portfolio-content.test.js`

- [ ] **Step 1: Add assertions for upgraded motion and husky requirements**

Add checks for these literal tokens:

```js
for (const token of [
  "hero-actions",
  "magnetic-cta",
  "proof-motion-wall",
  "privacy-safe-teaching",
  "teaching-safe-stage.png",
  "teaching-safe-online.png",
  "teaching-safe-onsite.png",
  "teaching-safe-workflow.png",
  "motion-radar",
  "celebration-layer",
  "husky-contact-panel",
  "setupMagneticEffects",
  "setupCelebration",
  "moveHuskySafely",
  "prefers-reduced-motion"
]) {
  assert.ok(html.includes(token) || css.includes(token) || js.includes(token), `Missing upgraded portfolio token: ${token}`);
}
```

- [ ] **Step 2: Run test to verify it fails before implementation**

Run: `pnpm test`

Expected: FAIL with at least one missing upgraded portfolio token.

- [ ] **Step 3: Commit failing test**

Run:

```bash
git add tests/portfolio-content.test.js
git commit -m "test: cover portfolio motion upgrade requirements"
```

## Task 2: Create Privacy-Safe Teaching Assets

**Files:**
- Create: `images/teaching/teaching-safe-stage.png`
- Create: `images/teaching/teaching-safe-online.png`
- Create: `images/teaching/teaching-safe-onsite.png`
- Create: `images/teaching/teaching-safe-workflow.png`

- [ ] **Step 1: Generate or create the four privacy-safe assets**

Use Image Gen when available. Each asset must show anonymous, brand-free teaching context and must avoid platform logos, dates, times, Discord/social icons, channel names, attendee faces, or readable sensitive text.

If Image Gen is unavailable, create SVG-based raster-safe visuals with the same privacy constraints.

- [ ] **Step 2: Inspect assets**

Run image inspection with `view_image` for each final asset.

Expected: no sensitive visible text or platform identifiers.

- [ ] **Step 3: Commit assets**

Run:

```bash
git add images/teaching/teaching-safe-*.png
git commit -m "feat: add privacy-safe teaching visuals"
```

## Task 3: Upgrade Markup For Hero, Teaching, Proof, And Husky

**Files:**
- Modify: `index.html`

- [ ] **Step 1: Add hero CTA markup**

Add a `.hero-actions` block after the hero promise with three `.magnetic-cta` links:

```html
<div class="hero-actions" aria-label="Portfolio actions">
  <a class="magnetic-cta magnetic-cta-primary smoothScroll" href="#contact">Hire for a project</a>
  <a class="magnetic-cta smoothScroll" href="#speaker-teaching">Invite me to speak</a>
  <a class="magnetic-cta smoothScroll" href="#hackathon-wins">View proof</a>
</div>
```

- [ ] **Step 2: Add proof motion hooks**

Add `proof-motion-wall` to the proof sections and `data-motion-card` attributes to founder, startup, teaching, and hackathon cards.

- [ ] **Step 3: Replace public teaching evidence images**

Use `images/teaching/teaching-safe-*.png` in the public teaching proof cards and add `privacy-safe-teaching` to the teaching proof grid.

- [ ] **Step 4: Add motion radar and celebration layer**

Add:

```html
<div class="motion-radar" id="motion-radar" aria-hidden="true"></div>
<div class="celebration-layer" id="celebration-layer" aria-hidden="true"></div>
```

- [ ] **Step 5: Add husky contact panel**

Inside `.husky-helper`, add `.husky-contact-panel` with WhatsApp and email links. Do not add a close button.

- [ ] **Step 6: Commit markup**

Run:

```bash
git add index.html
git commit -m "feat: add portfolio motion markup"
```

## Task 4: Implement Premium Motion CSS

**Files:**
- Modify: `css/style.css`

- [ ] **Step 1: Add motion tokens and base layers**

Add CSS variables for motion glow, radar size, pointer x/y, scroll depth, and safe transitions.

- [ ] **Step 2: Add magnetic CTA styles**

Style `.magnetic-cta` with readable text, pointer glow, hover elevation, and pressed state.

- [ ] **Step 3: Add proof and teaching animations**

Style `.proof-motion-wall`, `[data-motion-card]`, `.privacy-safe-teaching`, and teaching cards with scan light, tilt-safe transforms, shadow depth, and staggered reveal.

- [ ] **Step 4: Add radar, celebration, and husky styles**

Style `.motion-radar`, `.celebration-layer`, `.celebration-particle`, `.husky-contact-panel`, and `.husky-helper.is-chat-open`.

- [ ] **Step 5: Add reduced motion fallback**

Add `@media (prefers-reduced-motion: reduce)` that disables parallax, long animations, husky wandering, and celebration particles while preserving visibility.

- [ ] **Step 6: Commit CSS**

Run:

```bash
git add css/style.css
git commit -m "feat: add portfolio motion effects"
```

## Task 5: Implement Motion And Husky JavaScript

**Files:**
- Modify: `js/main.js`

- [ ] **Step 1: Extend i18n dictionary**

Add EN/CN keys for hero CTAs, husky WhatsApp/email labels, husky contact prompt, and privacy-safe teaching labels.

- [ ] **Step 2: Add `setupMagneticEffects()`**

Track pointer position on `.magnetic-cta` and card surfaces with CSS variables.

- [ ] **Step 3: Add scroll depth and radar updates**

Update root CSS variables and `.motion-radar` position from scroll and pointer events.

- [ ] **Step 4: Add `setupCelebration()`**

Create short-lived particles in `#celebration-layer` when the husky is clicked. Keep effects short and non-blocking.

- [ ] **Step 5: Add `moveHuskySafely()`**

Move the sticky husky within safe viewport bounds after it first appears near page bottom. Do not cover top nav, major CTAs, or viewport edges.

- [ ] **Step 6: Update husky click behavior**

Clicking the husky toggles the contact panel, rotates a message, and triggers celebration. The husky cannot be closed or removed.

- [ ] **Step 7: Commit JS**

Run:

```bash
git add js/main.js
git commit -m "feat: add husky and portfolio motion interactions"
```

## Task 6: Verify And Fix Fidelity

**Files:**
- Modify as needed: `index.html`, `css/style.css`, `js/main.js`, `tests/portfolio-content.test.js`

- [ ] **Step 1: Run static tests**

Run:

```bash
pnpm test
node --check js/main.js
```

Expected: both pass.

- [ ] **Step 2: Browser QA desktop and mobile**

Use Browser/IAB or Playwright fallback at `http://127.0.0.1:8088/`.

Verify:

- No horizontal overflow.
- Dark and light themes remain readable.
- EN/CN toggle updates new UI.
- Hero CTAs work.
- Teaching visuals are privacy-safe.
- Hackathon proof is prominent.
- Parallax/radar/masked reveal effects are visible.
- Husky appears near bottom, cannot close, moves safely, opens WhatsApp/email contact choices, and triggers celebration.
- Reduced-motion mode does not hide content.

- [ ] **Step 3: Capture concept and render screenshots**

Use `view_image` on the approved concept paths and final browser screenshots.

- [ ] **Step 4: Commit verification fixes**

Run:

```bash
git add index.html css/style.css js/main.js tests/portfolio-content.test.js images/teaching/teaching-safe-*.png
git commit -m "fix: polish portfolio motion QA"
```

Skip this commit if no verification fixes are needed.
