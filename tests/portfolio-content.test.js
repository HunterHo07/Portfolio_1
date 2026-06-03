const fs = require("node:fs");
const assert = require("node:assert/strict");

const html = fs.readFileSync("index.html", "utf8");
const css = fs.readFileSync("css/style.css", "utf8");
const js = fs.readFileSync("js/main.js", "utf8");

const requiredText = [
  "C#",
  "ASP.NET Core 10",
  "ReportU",
  "NameCardAi",
  "BestzDealAi",
  "MessageYou",
  "WarrantyAi",
  "RunJian iRun SimWorld",
  "RJ-2",
  "3D Models Demo",
  "Games Demo",
  "Mobile App Demo",
  "WarrantyScan Mobile",
  "NameCard Mobile",
  "data-project-title",
  "project-detail-modal",
  "theme-toggle",
  "language-toggle",
  "data-i18n",
  "husky-helper",
  "parallax-backdrop",
  "data-theme",
  "Founder Vision",
  "founder-vision",
  "Build products. Automate futures. Ship real impact.",
  "Ahfaiz Founder",
  "AI Automation Teacher",
  "CTO / Startup Builder",
  "Hackathon Winner",
  "Project 10",
  "Project 25",
  "3D Models Demo",
  "project-assets-section",
  "hero-capability",
  "hero-promise",
  "TrillionUnicorn OSS & Startup Lab",
  "OpenChance",
  "WorkFree",
  "CTOrendang",
  "GameMind",
  "CheckMe",
  "3Wallet",
  "AhFai",
  "Speaker & Teaching",
  "Free IT Speaker",
  "Online / Offline / Onsite",
  "Intro to N8N Application & Basics",
  "Decoding Tech Readiness",
  "Real event materials are privacy-masked",
  "Hackathon Wins",
  "Deriv AI Hackathon Winner 2025",
  "Builder Since 2007",
  "Founder Proof Theater",
  "One Hunter. Seven proof moments.",
  "Champion Stage",
];

const requiredUrls = [
  "https://hunterho07.github.io/d21-i3-BestzDeal",
  "https://hunterho07.github.io/d4-fe-Travel",
  "https://d27-i7-sim-work.vercel.app/",
  "https://d34-i7-sim-work.vercel.app/",
  "https://i1-d1-report-u.vercel.app/",
  "https://i1-d2-reportu.vercel.app/",
  "https://i2-d1-namecardai.vercel.app/",
  "https://i2-d2-namecardai.vercel.app/",
  "https://i3-d1-bestzdealai.vercel.app/",
  "https://i3-d2-bestzdealai.vercel.app/",
  "https://i3-d3-bestzdealai.vercel.app/",
  "https://i4-d1-messageyouai.vercel.app/",
  "https://i4-d2-messageyouai.vercel.app/",
  "https://i5-d2-warrantyai.vercel.app/",
  "https://runjian-irun-simworld.vercel.app",
  "https://rj-2.vercel.app",
  "https://rj-assets-hunter5.vercel.app/",
  "https://rj-assets-2-hunter5.vercel.app/",
  "https://game-demo-04-neon-grid-racer.vercel.app",
  "https://game-demo-05-orbit-defense.vercel.app",
  "https://game-demo-06-husky-rescue-run.vercel.app",
  "https://game-demo-07-dragon-forge-arena.vercel.app",
  "https://game-demo-08-quantum-card-lab.vercel.app",
  "https://game-demo-09-sky-island-tycoon.vercel.app",
  "https://qstyle-3d-models-lab.vercel.app",
  "https://github.com/HunterHo07/game-demo-04-neon-grid-racer",
  "https://github.com/HunterHo07/game-demo-05-orbit-defense",
  "https://github.com/HunterHo07/game-demo-06-husky-rescue-run",
  "https://github.com/HunterHo07/game-demo-07-dragon-forge-arena",
  "https://github.com/HunterHo07/game-demo-08-quantum-card-lab",
  "https://github.com/HunterHo07/game-demo-09-sky-island-tycoon",
  "https://github.com/HunterHo07/qstyle-3d-models-lab",
  "https://hunterho07.github.io/mobile-warrantyscan-demo/",
  "https://github.com/HunterHo07/mobile-warrantyscan-demo",
  "https://hunterho07.github.io/mobile-namecard-demo/",
  "https://github.com/HunterHo07/mobile-namecard-demo",
  "https://github.com/TrillionUnicorn/OpenChance",
  "https://github.com/TrillionUnicorn/WorkFree",
  "https://github.com/TrillionUnicorn/CTOrendang",
  "https://github.com/TrillionUnicorn/GameMind",
  "https://github.com/TrillionUnicorn/CheckMe",
  "https://github.com/TrillionUnicorn/3Wallet",
  "https://github.com/TrillionUnicorn/AhFai",
];

const requiredAssets = [
  "images/founder-portrait.jpeg",
  "images/logo.svg",
  "images/favicon.svg",
  "images/founder-banner.jpeg",
  "images/hero-founder-banner-ai.png",
  "images/founder-vision-poster.jpeg",
  "images/demo-thumb-bestzdeal-feature.png",
  "images/demo-thumb-travel-feature.png",
  "images/demo-thumb-sim-work-d27.png",
  "images/demo-thumb-sim-work-d34.png",
  "images/demo-thumb-reportu-d1.png",
  "images/demo-thumb-reportu-d2.png",
  "images/demo-thumb-namecardai-d1.png",
  "images/demo-thumb-namecardai-d2.png",
  "images/demo-thumb-bestzdealai-d1.png",
  "images/demo-thumb-bestzdealai-d2.png",
  "images/demo-thumb-bestzdealai-d3.png",
  "images/demo-thumb-messageyou-d1.png",
  "images/demo-thumb-messageyou-d2.png",
  "images/demo-thumb-warrantyai-d2.png",
  "images/demo-thumb-rj-1.png",
  "images/demo-thumb-rj-1-alt.png",
  "images/demo-thumb-rj-2.png",
  "images/demo-thumb-rj-assets-1.png",
  "images/demo-thumb-rj-assets-1-alt.png",
  "images/demo-thumb-rj-assets-2.png",
  "images/demo-thumb-game-neon-grid-racer.png",
  "images/demo-thumb-game-orbit-defense.png",
  "images/demo-thumb-game-husky-rescue.png",
  "images/demo-thumb-game-dragon-forge.png",
  "images/demo-thumb-game-quantum-card.png",
  "images/demo-thumb-game-sky-tycoon.png",
  "images/demo-thumb-qstyle-3d-models-lab.png",
  "images/demo-thumb-mobile-warrantyscan.png",
  "images/demo-thumb-mobile-warrantyscan-alt.png",
  "images/demo-thumb-mobile-namecard.png",
  "images/demo-thumb-mobile-namecard-alt.png",
  "images/teaching/teaching-safe-online.png",
  "images/teaching/teaching-safe-onsite.png",
  "images/teaching/teaching-safe-hero-v2.png",
  "images/teaching/teaching-safe-stage.png",
  "images/teaching/teaching-safe-workflow.png",
  "images/ui/cinematic-product-overlay.jpg",
  "images/ui/hackathon-champion-stage-v2.png",
  "images/ui/husky-idle.png",
  "images/ui/husky-happy.png",
  "images/ui/husky-excited.png",
  "images/ui/husky-contact.png",
];

for (const text of requiredText) {
  assert.ok(html.includes(text), `Missing required text: ${text}`);
}

for (const url of requiredUrls) {
  assert.ok(html.includes(url), `Missing required URL: ${url}`);
}

for (const asset of requiredAssets) {
  assert.ok(html.includes(asset) || css.includes(asset), `Missing required asset reference: ${asset}`);
  assert.ok(fs.existsSync(asset), `Missing required asset file: ${asset}`);
}

const detailButtons = html.match(/class="[^"]*project-detail-btn[^"]*"/g) || [];
assert.ok(detailButtons.length >= 25, `Expected at least 25 Details buttons, found ${detailButtons.length}`);

const projectCards = html.match(/class="[^"]*portfolio-project[^"]*"/g) || [];
assert.ok(projectCards.length >= 25, `Expected at least 25 portfolio project cards, found ${projectCards.length}`);

assert.ok(!html.includes('src="images/p1.webp" width="450" height="300" class="img-responsive" alt="Nice & Features BestzDeal"'), "BestzDeal feature demo still uses reused placeholder thumbnail");
assert.ok(!html.includes('>ReportU <br /> D1<'), "ReportU card should use project number plus summary, not only project name");
assert.ok(html.indexOf("3D Models Demo") > html.indexOf("Games Demo"), "3D Models section should be separated after games section");
assert.ok((html.match(/Games Demo/g) || []).length >= 1, "Games Demo heading should exist");
assert.ok((html.match(/<div class="col-lg-4 col-md-6">/g) || []).length >= 9, "Expected expanded game/demo card layout");
assert.equal((html.match(/data-project-title="Games Demo -/g) || []).length, 9, "Every Games Demo card should have a Details button");

const themeSelectors = [
  ":root",
  '[data-theme="dark"]',
  ".theme-toggle",
  ".language-toggle",
  ".husky-helper",
  ".parallax-backdrop",
  "body",
  "nav",
  "#about",
  "#services",
  "#journal",
  "#founder-vision",
  ".vision-shell",
  ".vision-hero-media",
  ".vision-proof-grid",
  ".journal-info",
  ".project-detail-dialog",
];

for (const selector of themeSelectors) {
  assert.ok(css.includes(selector), `Missing theme selector: ${selector}`);
}

for (const token of ["--color-bg", "--color-surface", "--color-text", "--color-heading", "--color-accent"]) {
  assert.ok(css.includes(token), `Missing theme token: ${token}`);
}

for (const behavior of ["localStorage", "matchMedia", "data-theme", "theme-toggle", "portfolio-language", "project-detail-chip"]) {
  assert.ok(js.includes(behavior), `Missing theme behavior: ${behavior}`);
}

assert.ok(html.includes("wa.me/60162199186"), "Missing WhatsApp helper link");

for (const token of [
  "hero-actions",
  "magnetic-cta",
  "proof-motion-wall",
  "privacy-safe-teaching",
  "teaching-safe-online.png",
  "teaching-safe-onsite.png",
  "teaching-safe-stage.png",
  "teaching-safe-workflow.png",
  "speaker-proof-note",
  "hero-parallax-stack",
  "hero-layer",
  "hero-layer-backdrop",
  "hero-layer-workdesk",
  "hero-layer-ui",
  "hero-layer-hunter",
  "hero-layer-foreground",
  "hero-layer-04-hunter.webp",
  "heroLayerSpeeds",
  "--layer-offset-y",
  "hero.headlinePhrases",
  "heroHeadlineTypingTimer",
  "typeHeadline",
  "heroWordIn",
  "heroTypingCaret",
  "lazyWordPulse",
  "founder-journey",
  "founder-poster-stage",
  "startup-metrics",
  "startup-visual",
  "hackathon-proof-wall",
  "hackathon-champion-stage-v2.png",
  "champion-route",
  "championCrownPulse",
  "Neon Grid Racer",
  "Orbit Defense",
  "Husky Rescue Run",
  "Dragon Forge Arena",
  "Quantum Card Lab",
  "Sky Island Tycoon",
  "Q-Style 3D Models Lab",
  "celebration-layer",
  "husky-contact-panel",
  "husky-sprite-stage",
  "husky-sprite-idle",
  "is-emote-excited",
  "setHuskyEmotion",
  "scheduleHuskyRoam",
  "setupHeroKinetics",
  "setupFounderJourney",
  "setupSingleHunterFocus",
  "data-hunter-zone",
  "is-hunter-active",
  "hunterRevealIn",
  "setupProjectThumbnailLoops",
  "setupSectionParallax",
  "data-alt-thumb",
  "is-thumb-swapping",
  "parallax-live-section",
  "setupMagneticEffects",
  "setupCelebration",
  "moveHuskySafely",
  "prefers-reduced-motion",
  "cinematic-media-frame",
  "cinematic-product-overlay.jpg",
  "mix-blend-mode",
  ".hunter-thumbnail .popup-img",
  ".journal-info > a:first-child"
]) {
  assert.ok(html.includes(token) || css.includes(token) || js.includes(token), `Missing upgraded portfolio token: ${token}`);
}

assert.ok(!html.includes("motion-radar") && !css.includes("motion-radar") && !js.includes("motion-radar"), "Mouse pointer radar effect should be removed");

const navBlock = (css.match(/nav\s*{([\s\S]*?)}/) || [])[1] || "";
assert.ok(/display:\s*block/.test(navBlock), "Top navbar should be visible from page load");
assert.ok(!js.includes('$("#main-nav").slideUp(700)'), "Top navbar should not be hidden at the hero top");
assert.ok(js.includes('$("#main-nav, #main-nav-subpage").show()'), "Top navbar should be forced visible by JS fallback");
assert.ok((js.match(/"hero\.headlinePhrases"/g) || []).length >= 2, "Hero headline should rotate typed phrases in both languages");
assert.ok((html.match(/data-hunter-zone=/g) || []).length >= 5, "Hunter-bearing visuals should be registered as single-focus zones");
assert.ok(js.includes("setupSingleHunterFocus") && js.includes("[data-hunter-zone]"), "Single-Hunter focus manager should control visible Hunter zones");
assert.ok(css.includes("[data-hunter-zone]:not(.is-hunter-active)") && css.includes("brightness(0.03)"), "Inactive Hunter zones should be blacked/masked");

const heroImageLayers = html.match(/class="hero-layer hero-layer-[^"]+"/g) || [];
assert.equal(heroImageLayers.length, 5, `Expected five transparent hero parallax image layers, found ${heroImageLayers.length}`);
assert.ok(!html.includes("hero-image-layer") && !css.includes("hero-image-layer"), "Hero parallax should not use the old CSS background layer class");
assert.ok(!css.includes('background-image: url("../images/hero-founder-banner-ai.png")'), "Hero parallax should use transparent image assets, not repeated CSS backgrounds");
const heroLayerAssets = [
  "images/hero-layers/hero-layer-01-backdrop.webp",
  "images/hero-layers/hero-layer-02-workdesk.webp",
  "images/hero-layers/hero-layer-03-ui-panels.webp",
  "images/hero-layers/hero-layer-04-hunter.webp",
  "images/hero-layers/hero-layer-05-foreground-wave.webp"
];
for (const asset of heroLayerAssets) {
  assert.ok(html.includes(asset), `Missing hero layer asset in markup: ${asset}`);
  assert.ok(fs.existsSync(asset), `Missing generated hero layer asset file: ${asset}`);
  assert.ok(fs.statSync(asset).size > 10000, `Hero layer asset looks too small: ${asset}`);
}
const heroLayerCss = css.slice(css.indexOf(".hero-layer img"), css.indexOf("#header::after"));
assert.ok(heroLayerCss.includes("object-fit: cover") && heroLayerCss.includes("translate3d(var(--layer-offset-x"), "Hero image layers should move via image transforms");
assert.ok(js.includes("heroDepth") && js.includes("heroLayerSpeeds") && js.includes("--layer-offset-x"), "Hero parallax should compute visible per-layer scroll depth");

const founderJourneyCss = css.slice(css.indexOf(".founder-journey {"), css.indexOf("[data-theme=\"dark\"] .vision-copy"));
assert.ok(founderJourneyCss.includes("min-height: calc(100vh - 156px)"), "Founder theater should use a large full-screen shell");
assert.ok(founderJourneyCss.includes("position: absolute") && founderJourneyCss.includes("inset: 0"), "Founder poster should fill the full theater shell as a background layer");
assert.ok(founderJourneyCss.includes("justify-self: end") && founderJourneyCss.includes("width: min(46vw, 520px)"), "Founder copy should be a floating side panel over the image");
assert.ok(founderJourneyCss.includes("mix-blend-mode: screen"), "Founder theater should use a soft image mask effect");
assert.ok(!founderJourneyCss.includes("max-width: 560px"), "Founder poster should not be constrained to the old small card width");

for (const oldHeroOverlay of [
  "hero-layer-vignette",
  "hero-layer-grid",
  "hero-layer-code-left",
  "hero-layer-code-right",
  "hero-layer-orbit",
  "hero-layer-node",
  "hero-layer-wave",
  "hero-layer-scan",
  "heroScanSweep"
]) {
  assert.ok(!html.includes(oldHeroOverlay) && !css.includes(oldHeroOverlay) && !js.includes(oldHeroOverlay), `Old CSS-drawn hero overlay should be removed: ${oldHeroOverlay}`);
}

const thumbnailLoops = html.match(/data-alt-thumb="images\/[^"]+-alt\.png"/g) || [];
assert.ok(thumbnailLoops.length >= 30, `Expected at least 30 real second-state thumbnail loops, found ${thumbnailLoops.length}`);
assert.ok(!/<a target="_blank" href="https:\/\/github\.com\/[^"]+"><img[^>]+data-alt-thumb=/.test(html), "GitHub-only cards should not use live demo thumbnail loops");

for (const altThumb of [...html.matchAll(/data-alt-thumb="([^"]+)"/g)].map((match) => match[1])) {
  assert.ok(fs.existsSync(altThumb), `Missing alternate thumbnail asset: ${altThumb}`);
}

for (const sensitiveTeachingAsset of [
  "images/teaching/speaker-teaching-banner.png",
  "images/teaching/teaching-n8n-event.jpeg",
  "images/teaching/teaching-non-it-vs-real-it.jpeg",
  "images/teaching/teaching-tech-readiness.jpeg",
  "images/teaching/teaching-productivity.jpeg",
  "images/teaching/teaching-proof-board.png",
  "images/teaching/teaching-proof-n8n.png",
  "images/teaching/teaching-proof-non-it.png",
  "images/teaching/teaching-proof-readiness.png",
  "images/teaching/teaching-proof-productivity.png"
]) {
  assert.ok(!html.includes(sensitiveTeachingAsset), `Sensitive teaching asset should not be public-facing: ${sensitiveTeachingAsset}`);
}

function parseThemeBlock(selector) {
  const pattern = new RegExp(`${selector.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\s*{([\\s\\S]*?)}`);
  const match = css.match(pattern);
  assert.ok(match, `Missing theme block: ${selector}`);

  return Object.fromEntries(
    [...match[1].matchAll(/(--color-[a-z-]+):\s*(#[0-9a-fA-F]{6})/g)].map(([, key, value]) => [key, value])
  );
}

function luminance(hex) {
  const channels = hex
    .slice(1)
    .match(/.{2}/g)
    .map((channel) => {
      const value = Number.parseInt(channel, 16) / 255;
      return value <= 0.03928 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
    });

  return channels[0] * 0.2126 + channels[1] * 0.7152 + channels[2] * 0.0722;
}

function contrast(a, b) {
  const [lighter, darker] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (lighter + 0.05) / (darker + 0.05);
}

const lightTheme = parseThemeBlock(":root");
const darkTheme = parseThemeBlock('[data-theme="dark"]');

for (const [name, theme] of [
  ["light", lightTheme],
  ["dark", darkTheme],
]) {
  for (const surface of ["--color-bg", "--color-surface", "--color-elevated"]) {
    assert.ok(contrast(theme["--color-text"], theme[surface]) >= 4.5, `${name} text contrast failed on ${surface}`);
    assert.ok(contrast(theme["--color-heading"], theme[surface]) >= 4.5, `${name} heading contrast failed on ${surface}`);
  }

  assert.ok(
    contrast(theme["--color-button-text"], theme["--color-button-bg"]) >= 4.5,
    `${name} button contrast failed`
  );
}

console.log("Portfolio content checks passed.");
