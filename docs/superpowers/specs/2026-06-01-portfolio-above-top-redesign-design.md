# Portfolio Above-Top Redesign Design

## Decision State

Approved by the user on 2026-06-01 after reviewing six generated concept directions:

- Hero / CTA command center: `/Users/workwork/.codex/generated_images/019e7f3e-517d-75a2-a46f-12a4934f3151/ig_012425b2075282c6016a1cf96a2ac881918f1d468d40389be2.png`
- Proof / hackathon / teaching wall: `/Users/workwork/.codex/generated_images/019e7f3e-517d-75a2-a46f-12a4934f3151/ig_012425b2075282c6016a1cf9c0124881919164e16518953909.png`
- Project ecosystem: `/Users/workwork/.codex/generated_images/019e7f3e-517d-75a2-a46f-12a4934f3151/ig_012425b2075282c6016a1cfa7e395481919f1a65b57a63cccc.png`
- Interactive demo lab: `/Users/workwork/.codex/generated_images/019e7f3e-517d-75a2-a46f-12a4934f3151/ig_012425b2075282c6016a1cfb5991f48191a7e2dd9655a2cd49.png`
- Contact / husky assistant: `/Users/workwork/.codex/generated_images/019e7f3e-517d-75a2-a46f-12a4934f3151/ig_012425b2075282c6016a1cfc33d8ec8191b2f42427505a5e1c.png`
- Capabilities map: `/Users/workwork/.codex/generated_images/019e7f3e-517d-75a2-a46f-12a4934f3151/ig_012425b2075282c6016a1cfcc2ec28819193251fa2dda3aa8c.png`

## Goal

Turn the portfolio from a section-by-section project list into a premium but credible conversion journey for four audiences:

- Freelance clients who need websites, mobile apps, systems, automation, AI workflow, Web3, 3D/game demos, or technical consulting.
- Interviewers who need fast proof of fullstack delivery, architecture thinking, leadership, and hands-on depth.
- Founders who need a builder who can translate ideas into working systems.
- Event organizers who need a practical IT speaker, mentor, or trainer.

The page must feel more visual, interactive, and premium, but text readability and client trust are more important than decorative effects.

## Current Audit Findings

- The Facebook reel link resolves to `https://www.facebook.com/reel/866651105780608/`, but unauthenticated access exposes only metadata and a thumbnail, not the playable video stream. The design must therefore use the user's supplied screenshot and the public metadata as direction, not claim exact frame-by-frame video analysis.
- The hero has a strong generated banner, but the above-fold story still lacks a clear conversion flow. It should immediately offer project hiring, speaking invitation, and proof viewing.
- `#hackathon-wins` exists, but it is too visually small. It must become a major proof area rather than a quiet row of cards.
- `#speaker-teaching` exists and uses the right evidence, but it should feel more like a branded speaking/training proof section and less like screenshots placed below a text block.
- Project demos exist in large quantity, but the grid still feels repetitive and does not guide visitors to the most commercially relevant examples.
- The Details modal is useful, but project stories are not deep enough for the user's stated goal. It should sell client outcomes, implementation maturity, and handover confidence.
- The Games Demo and 3D Models Demo counts are present, but they should feel like an interactive lab, not normal portfolio cards.
- The capabilities/about content is too resume-like. It should become a client-readable build map with clickable tech/skill previews.
- The husky helper exists, but the closing CTA should become a stronger decision board that asks what the visitor needs built.

## Architecture Decision

Keep the current static HTML/CSS/JS architecture for this redesign.

Reasons:

- The requested motion, parallax, modal previews, i18n, dark/light theme, CTA flows, and husky helper are all feasible in static HTML/CSS/JS.
- GitHub Pages deployment remains simple and low-risk.
- Avoiding a SvelteKit migration keeps the work focused on conversion quality instead of framework churn.

SvelteKit should be reconsidered only if a later version needs route-level project filtering, a CMS, persisted visitor state, search, or a data-driven project database.

## Visual Direction

Use one cohesive "premium operator command center" language:

- Dark-first but light-theme compatible.
- Deep navy/black backgrounds with warm gold, cyan, and restrained white.
- Large readable display typography for hero and proof sections.
- Modern sans typography for body, controls, labels, and modal details.
- Soft gradient borders only where useful; no ugly outlines.
- Fewer but stronger surfaces instead of many repeated Bootstrap-style cards.
- Real evidence images framed professionally.
- UI text remains code-native. Generated images are only used as backgrounds, thumbnails, proof posters, or visual assets.
- Animation direction should borrow from the Facebook reference theme: multiple website styles, fast visual switching, cinematic depth, layered panels, masked reveals, kinetic typography, and high-motion design transitions. The implementation must adapt those techniques into a readable portfolio experience rather than copying the video.

Avoid:

- Purple-heavy gradients.
- Generic neon cyberpunk clutter.
- Tiny unreadable text.
- Fake metrics, fake client names, fake logos, or unverified claims.
- Employer/company names from the CV.
- Sensitive provider lists, regulated-system details, payment-provider internals, private operational numbers, or resume-only history.

## Section Order

1. `Hero`
   - Purpose: convert immediately.
   - Copy: "Hunter Ho", "I build web, mobile, AI automation and systems.", "Plan -> Ship -> Operate", "Resolve your problem with the Lazy way".
   - CTAs: "Hire for a project", "Invite me to speak", "View proof".
   - Proof rail: "18+ years", "Hackathon winner", "Speaker & teacher", "OSS + startup lab".
   - Use the approved hero concept as the visual target.

2. `Proof That Ships`
   - Purpose: make credibility impossible to miss.
   - Combines founder vision, hackathon wins, speaking/teaching, and 18+ years into one premium proof wall.
   - Hackathon wins must be visible as a first-class lane:
     - Deriv AI Hackathon Winner 2025.
     - SUI Hackathon Winner 2025.
     - IOTA Hackathon Malaysia Winner 2025.
     - ETH Hackathon Winner 2023.
   - CTAs: "Invite Hunter to teach", "Discuss a project".
   - Existing teaching proof images must not be shown directly if they expose sensitive, unrelated, or third-party channel/platform details.
   - Replace the public-facing teaching proof visuals with privacy-safe generated/stylized class visuals: no platform logos, no Discord/social icons, no dates, no times, no private channel names, no attendee identities, no unrelated text.
   - The section should still prove: online teaching, offline/onsite class support, mentoring, AI automation, n8n/workflow, developer readiness, productivity, and public speaking invitations.

3. `What I Can Build`
   - Purpose: replace resume-like skill text with client-readable capabilities.
   - Capability groups:
     - Web & Mobile.
     - Backend & APIs.
     - Database & Ops.
     - AI Automation.
     - Payments & Webhooks.
     - Web3.
     - 3D / Game / Simulation.
     - Teaching & Consulting.
   - Tech chips must include public-safe examples:
     - SvelteKit, React / Next.js, TypeScript, PHP, Python, Go, C#, ASP.NET Core 10, PostgreSQL, Redis, Flutter, React Native, Three.js, n8n, OpenAI, SUI / IOTA.
   - Interaction: clicking a chip opens a mini preview panel showing how that capability helps a client project.

4. `Project Ecosystem`
   - Purpose: turn 25+ demos and OSS work into a guided decision surface.
   - Category rails:
     - Startup Ideas.
     - Client-ready Web.
     - Mobile Apps.
     - Games.
     - 3D Models.
     - OSS.
   - Featured projects:
     - ReportU.
     - NameCardAi.
     - BestzDealAi.
     - MessageYou.
     - WarrantyAi.
     - RunJian Command World.
   - Each project keeps a visible rainbow text-only "Details" action.
   - Details drawer/modal must include:
     - Project story.
     - Tech Stacks.
     - Skills Used.
     - Project About.
     - Client Value.
     - Clickable skill chips with 3-5 second mini demos.

5. `Interactive Demo Lab`
   - Purpose: make mobile, games, and 3D capability feel playful and high-standard.
   - Zones:
     - Mobile App Demo: WarrantyScan Mobile, NameCard Mobile.
     - Games Demo: 9 game demos.
     - 3D Models Demo: 3 model demos.
   - Visual model: three museum-style demo booths with phone mockups, game wall, and Q-style model shelf.
   - Interaction: hover preview, demo launch buttons, rainbow Details text.

6. `Services / Build With Hunter`
   - Purpose: close with direct client action.
   - Service menu:
     - Website.
     - Mobile App.
     - Server + Database.
     - Automation.
     - AI Workflow.
     - Web3.
     - 3D/Game Demo.
     - Technical Consultation.
   - CTAs:
     - WhatsApp Hunter.
     - Book a free project review.
     - Invite as speaker.
   - Replace or reduce the heavy old contact form emphasis with a lighter decision board.

7. `Husky Helper`
   - Purpose: memorable bottom-of-page helper and WhatsApp CTA.
   - Gray/white husky, cute but professional.
   - Sticky on screen and cannot be closed.
   - Starts subtle, then pops up near the bottom of the page.
   - After first popup, stays visible and occasionally moves within a safe viewport zone without covering key text or buttons.
   - Rotates short EN/CN messages.
   - Click opens a small contact bubble with WhatsApp and email choices.
   - Click also triggers a short celebration effect across the screen.
   - WhatsApp uses the existing number.
   - Motion must respect `prefers-reduced-motion`.

## Motion And Interaction

Use motion as proof polish, not noise:

- Multi-layer parallax background with depth planes, floating particles, pointer-reactive orbs, and scroll-tied offsets.
- Cinematic reveal sequences inspired by the Facebook reel style: masked panel reveals, fast but readable section transitions, kinetic underline sweeps, rotating spotlight highlights, and staggered proof-card entrances.
- Scroll progress/radar effect that makes the page feel alive without becoming a game.
- Section reveal animations that cannot hide content if JavaScript is delayed or disabled.
- Hero proof rail entrance.
- Magnetic CTA buttons with subtle pointer-follow glow and pressed feedback.
- Teaching proof cards animate like a privacy-safe digital stage wall: tilt, scan light, and layered poster/card depth.
- Hackathon win cards get trophy-style shine, timeline glow, and scroll-triggered count/proof emphasis.
- Project hover tilt and soft glow.
- Details drawer/modal open animation.
- Tech-chip mini demo progress or preview animation lasting about 3-5 seconds.
- Demo lab booth hover previews.
- Husky idle float/tail animation, random safe-position movement, rotating messages, contact bubble, and celebration particles on click.

Accessibility constraints:

- All critical text must be readable without animation.
- `prefers-reduced-motion` must disable nonessential movement.
- Keyboard focus states must be visible.
- Modal/drawer must close with Escape and click outside.
- No horizontal overflow on desktop or mobile.
- The husky cannot be closed, but it must not trap focus or block core content.
- Celebration effects must be short, non-flashing, and disabled/reduced for `prefers-reduced-motion`.
- Motion quality must be checked in both light and dark themes.

## Content Rules

Public-safe content allowed:

- 18+ years hands-on IT.
- Builder since 2007.
- Fullstack development.
- Solution architecture.
- AI automation.
- Web/mobile/systems/backend/database.
- Startup/OSS lab.
- Public speaking, free IT teaching, online/offline/onsite invitations.
- Hackathon wins listed above.
- High-level domains such as dashboards, integrations, payments, automation, Web3, mobile apps, and 3D/game demos.

Content not allowed:

- Employer names from the CV.
- Full work experience timeline.
- Private company/client details.
- Sensitive provider lists.
- Regulated-system internals.
- Production transaction numbers.
- Private phone/email outside existing portfolio contact choices unless already used in the site.

## Light And Dark Themes

Both themes must feel designed, not merely inverted.

Dark:

- Primary mood from the concepts.
- High contrast white/gold/cyan text.
- Background depth and command-room atmosphere.

Light:

- Clean white or very light neutral surfaces.
- Dark text with restrained gold/cyan accents.
- No low-contrast pale gray text.
- Proof images and project thumbnails must not look washed out.

## EN/CN I18n

Maintain EN/CN only.

Must translate:

- Navigation.
- Hero copy.
- CTA buttons.
- Proof section headings and short descriptions.
- Capability group names.
- Project ecosystem labels.
- Modal labels.
- Demo lab headings.
- Service menu.
- Husky messages.

Raster image text does not need translation.

## Testing And Verification

Required checks before claiming implementation complete:

- `pnpm test` passes.
- `node --check js/main.js` passes.
- Browser desktop visual check at local `127.0.0.1:8088`.
- Browser mobile visual check around 390px width.
- No horizontal overflow.
- Dark/light theme verified on hero, proof, projects, demo lab, and contact.
- EN/CN toggle updates visible core UI.
- Hero CTAs scroll or link correctly.
- Hackathon proof section is prominent and visible.
- Details opens for project cards and skill-chip mini preview works.
- Games Demo still has 9 entries.
- 3D Models Demo still has 3 entries.
- Mobile App Demo still has 2 entries with GitHub/live links.
- Husky is sticky, cannot be closed, pops up near page bottom, moves randomly inside safe screen bounds, rotates EN/CN messages, opens WhatsApp/email contact choices, and triggers celebration on click.
- Teaching/class visuals are privacy-safe: no platform logos, no sensitive event details, no private channel names, no attendee identities, no unrelated text/icons.
- Motion verification confirms parallax, masked reveals, magnetic CTAs, proof-card animation, demo-lab hover effects, and reduced-motion fallback.
- Generated or copied assets are in the repo if referenced by production code.

## Non-Goals For This Pass

- Do not create new game repositories in this pass.
- Do not build a 200-model 3D asset app in this pass.
- Do not migrate to SvelteKit unless a concrete implementation blocker is found.
- Do not add private CV work history.
- Do not overbuild backend, CMS, search, or analytics.
