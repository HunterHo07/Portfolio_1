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
  "Proof Direction",
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
  "https://github.com/HunterHo07/O1-3d-Assets-1",
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
  "images/demo-thumb-rj-assets-3.png",
  "images/demo-thumb-mobile-warrantyscan.png",
  "images/demo-thumb-mobile-warrantyscan-alt.png",
  "images/demo-thumb-mobile-namecard.png",
  "images/demo-thumb-mobile-namecard-alt.png",
  "images/teaching/teaching-proof-board.png",
  "images/teaching/teaching-proof-n8n.png",
  "images/teaching/teaching-proof-non-it.png",
  "images/teaching/teaching-proof-readiness.png",
  "images/teaching/teaching-proof-productivity.png",
  "images/ui/cinematic-product-overlay.jpg",
  "images/ui/hackathon-proof-stage.png",
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
  "teaching-proof-board.png",
  "teaching-proof-n8n.png",
  "teaching-proof-non-it.png",
  "teaching-proof-readiness.png",
  "teaching-proof-productivity.png",
  "speaker-proof-note",
  "hero-parallax-stack",
  "hero-layer",
  "hero-image-layer",
  "hero-image-base",
  "hero-image-left-depth",
  "hero-image-workdesk",
  "hero-image-ui-depth",
  "hero-image-hunter-depth",
  "hero-image-foreground",
  "heroWordIn",
  "heroTypingCaret",
  "lazyWordPulse",
  "founder-journey",
  "founder-poster-stage",
  "startup-metrics",
  "startup-visual",
  "hackathon-proof-wall",
  "hackathon-proof-stage.png",
  "celebration-layer",
  "husky-contact-panel",
  "husky-sprite-stage",
  "husky-sprite-idle",
  "is-emote-excited",
  "setHuskyEmotion",
  "scheduleHuskyRoam",
  "setupHeroKinetics",
  "setupFounderJourney",
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

const heroImageLayers = html.match(/class="hero-layer hero-image-layer hero-image-[^"]+"/g) || [];
assert.equal(heroImageLayers.length, 6, `Expected six image-derived hero parallax layers, found ${heroImageLayers.length}`);
assert.ok((css.match(/background-image: url\("\.\.\/images\/hero-founder-banner-ai\.png"\)/g) || []).length >= 1, "Hero parallax must use the real hero background image");
const heroImageCss = css.slice(css.indexOf(".hero-image-layer"), css.indexOf("#header::after"));
assert.ok(heroImageCss.includes("-webkit-mask-image") && heroImageCss.includes("mask-image"), "Hero image layers should use soft masks for depth");
assert.ok(!heroImageCss.includes("clip-path:"), "Hero image parallax should avoid hard clip-path overlay shapes");

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
  "images/teaching/teaching-productivity.jpeg"
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
