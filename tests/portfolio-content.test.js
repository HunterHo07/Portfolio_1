const fs = require("node:fs");
const assert = require("node:assert/strict");

const html = fs.readFileSync("index.html", "utf8");
const css = fs.readFileSync("css/style.css", "utf8");
const responsiveCss = fs.readFileSync("css/responsive.css", "utf8");
const js = fs.readFileSync("js/main.js", "utf8");

for (const agentContextFile of ["AGENTS.md", "SKILL.md", "LLM.md"]) {
  assert.ok(fs.existsSync(agentContextFile), `Missing project guidance file: ${agentContextFile}`);
  const content = fs.readFileSync(agentContextFile, "utf8");
  assert.ok(content.includes("Portfolio_1") && content.includes("CX") && content.includes("performance"), `${agentContextFile} should capture Portfolio_1 CX/performance guidance`);
}

const headHtml = html.slice(html.indexOf("<head>"), html.indexOf("</head>"));
assert.ok(!/<script\s+src=/.test(headHtml), "Head should not contain external render-blocking scripts");
assert.ok(headHtml.includes('rel="preconnect" href="https://fonts.googleapis.com"'), "Head should preconnect to Google Fonts");
assert.ok(headHtml.includes('rel="preconnect" href="https://fonts.gstatic.com" crossorigin'), "Head should preconnect to Google font assets");
assert.ok(headHtml.includes('rel="preload" as="image" href="images/hero-options/option-c-three-source.png"'), "Head should preload only the active hero source image");
assert.ok(!headHtml.includes('rel="preload" as="image" href="images/founder-banner.jpeg"') && !headHtml.includes('rel="preload" as="image" href="images/founder-vision-poster.jpeg"'), "Below-fold images should not be preloaded");
assert.ok(html.includes('class="hero-three-source" src="images/hero-options/option-c-three-source.png" width="1792" height="1024" alt="" loading="eager" decoding="async" fetchpriority="high"'), "Hero source image should be eager, async-decoded, and high priority");
assert.ok(css.includes(".hero-three-stage::before") && css.includes("filter: blur(20px)") && css.includes("hero blur placeholder"), "Hero should have a lightweight blur placeholder before the hero image loads");
assert.ok(!html.includes('src="lib/typed/typed.js"') && !html.includes('src="lib/owlcarousel/owl.carousel.min.js"') && !html.includes('src="lib/magnific-popup/magnific-popup.min.js"') && !html.includes('src="lib/isotope/isotope.pkgd.min.js"'), "Optional UI libraries should not be loaded as page-level script tags");
assert.ok(!html.includes('src="lib/jquery/jquery-migrate.min.js"') && !html.includes('src="contactform/contactform.js"') && !html.includes("https://smtpjs.com/v3/smtp.js"), "Unused legacy scripts should not load on the critical path");
assert.ok(js.includes("loadScriptOnce") && js.includes("loadOptionalPortfolioPlugins") && js.includes("runWhenElementIsNear") && js.includes("IntersectionObserver") && js.includes("lib/magnific-popup/magnific-popup.min.js"), "Optional libraries should be viewport-gated and lazy-loaded by main.js only when needed");

for (const match of html.matchAll(/<img\b[^>]*>/g)) {
  const tag = match[0];
  const src = (tag.match(/src="([^"]+)"/) || [])[1] || "";
  const isLogo = src.endsWith("logo.svg");
  const isHero = tag.includes("hero-three-source");

  assert.ok(/\bwidth="/.test(tag) && /\bheight="/.test(tag), `Image should include stable dimensions: ${src}`);

  if (!isLogo) {
    assert.ok(/\bdecoding="async"/.test(tag), `Image should decode async: ${src}`);
  }

  if (isHero) {
    assert.ok(/\bloading="eager"/.test(tag), `Hero image should be eager: ${src}`);
  } else if (!isLogo) {
    assert.ok(/\bloading="lazy"/.test(tag), `Below-fold or delayed image should be lazy: ${src}`);
  }
}

for (const match of html.matchAll(/<iframe\b[^>]*>/g)) {
  const tag = match[0];
  const src = (tag.match(/src="([^"]+)"/) || [])[1] || "";
  assert.ok(/\bloading="lazy"/.test(tag), `Below-fold iframe should be lazy: ${src}`);
}

assert.ok(fs.existsSync("hero-options.html"), "Hero picker page should exist so Option A and Option C can be compared before replacing the homepage hero");
const heroOptionsHtml = fs.readFileSync("hero-options.html", "utf8");
const heroOptionsCss = fs.readFileSync("css/hero-options.css", "utf8");
const heroOptionsJs = fs.readFileSync("js/hero-options.js", "utf8");

const heroOptionAssets = [
  "images/hero-options/option-a-cinematic-source.png",
  "images/hero-options/option-c-three-source.png"
];
for (const asset of heroOptionAssets) {
  assert.ok(fs.existsSync(asset), `Missing generated hero option source image: ${asset}`);
  assert.ok(fs.statSync(asset).size > 10000, `Generated hero option source image looks too small: ${asset}`);
}

assert.ok(heroOptionsHtml.includes("data-hero-preview=\"option-a\""), "Hero picker should include Option A cinematic layer preview");
assert.ok(heroOptionsHtml.includes("data-hero-preview=\"option-c\""), "Hero picker should include Option C interactive 3D preview");
const cinematicPlanes = heroOptionsHtml.match(/class="cinematic-plane/g) || [];
assert.ok(cinematicPlanes.length >= 18, `Option A should expose at least 18 visible depth planes, found ${cinematicPlanes.length}`);
assert.ok(heroOptionsHtml.includes("option-a-cinematic-source.png"), "Option A should use the generated cinematic source image");
assert.ok(heroOptionsHtml.includes("option-c-three-source.png"), "Option C should use the generated 3D source image");
assert.ok(heroOptionsHtml.includes("three-canvas") && heroOptionsJs.includes("initThreeHero"), "Option C should mount a dedicated 3D scene hook");
assert.ok(heroOptionsCss.includes("perspective:") && heroOptionsCss.includes("--plane-depth"), "Hero options CSS should support real depth-plane transforms");
assert.ok(heroOptionsJs.includes("requestAnimationFrame") && heroOptionsJs.includes("prefers-reduced-motion"), "Hero options should animate efficiently and respect reduced motion");
assert.ok(heroOptionsJs.includes("preserveDrawingBuffer: true"), "Option C Three.js renderer should preserve the frame buffer so browser verification can sample nonblank canvas pixels");

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
  "TrillionUnicorn Startup Lab",
  "Turn on sound for the full startup story",
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
  "Hunter v1.6.6",
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
  "images/founder-banner.jpeg",
  "images/hero-layers/hero-layer-04-hunter.webp",
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
  ".release-badge",
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

assert.ok(html.includes("contact-footer-bg") && html.includes("images/founder-banner.jpeg"), "Contact/footer section should use founder-banner.jpeg as its background");
assert.ok(!html.includes("contact-footer-layers/contact-footer-layer-01-backdrop.webp"), "Contact/footer should not keep the old generated footer backdrop layer");
assert.ok(!html.includes("contact-footer-layers/contact-footer-layer-03-person.webp"), "Contact/footer should not keep the old generated contact person layer");
assert.ok(css.includes(".contact-footer-bg img") && css.includes("object-position: center center"), "Founder footer background should be styled as a real image background");
assert.ok(!css.includes(".contact-parallax-bg") && !css.includes(".contact-layer-person"), "Contact/footer CSS should not keep the old layered parallax selectors");
const visibleHtmlText = html.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ");
for (const footerText of [
  "MALAYSIA & SINGAPORE (On-Site) / Worldwide (Remote Any Timezone )",
  "KUALU LUMPUR, SELANGOR, PENANG, JOHOR BAHRU",
  "Whatsapp: +60 016-2199186",
  "Email: HunterHo.My@gmail.com",
  "Linkedin: Profile",
  "50% Discount",
  "Of Your Current Using Service (Any Server/Hosting)"
]) {
  assert.ok(visibleHtmlText.includes(footerText), `Missing footer contact text: ${footerText}`);
}
assert.ok(html.includes('href="https://my.linkedin.com/in/hunter-ho-0bb450114"'), "Missing LinkedIn profile link");
assert.ok(!css.includes('url("../images/hero-founder-banner-ai.png") center center / cover no-repeat'), "Footer should not reuse the hero banner as a cover background");

assert.ok(html.includes("wa.me/60162199186"), "Missing WhatsApp helper link");
assert.ok(js.includes("is-over-contact") && css.includes(".husky-helper.is-over-contact"), "Floating contact shortcut should hide when it would overlap the contact footer");
assert.ok(html.includes('<a class="release-badge" href="https://github.com/HunterHo07"') && html.includes("Hunter v1.6.6"), "Release badge should link to Hunter GitHub profile and use Hunter version label");
assert.ok(!html.includes("Portfolio v1.6.6") && !html.includes("Portfolio_1/releases/tag/v1.6.6"), "Release badge should no longer use the Portfolio release label or release URL");
assert.ok(html.includes("Book Me for Event") && js.includes('"hero.ctaSpeak": "Book Me for Event"'), "Hero event CTA should clearly target event/function invitations");
assert.ok(html.includes("Projects Demo") && js.includes('"hero.ctaProof": "Projects Demo"'), "Hero proof CTA should be renamed to Projects Demo");
assert.ok(!html.includes("Invite me to speak") && !js.includes("Invite me to speak") && !html.includes("View proof") && !js.includes('"hero.ctaProof": "View proof"'), "Hero CTAs should not keep the unclear old labels");
assert.ok(html.includes('class="hero-hunter-popup"') && html.includes("data-hero-hunter-message"), "Hero should include the delayed Hunter popup markup");
assert.ok(html.includes("images/hero-layers/hero-layer-04-hunter.webp"), "Hero Hunter popup should use the supplied hero-layer-04-hunter image");
assert.ok(css.includes(".hero-hunter-popup") && css.includes(".hero-hunter-popup.is-visible") && css.includes(".hero-hunter-popup.is-leaving"), "Hero Hunter popup should include visible and leaving styles");
assert.ok(css.includes("@keyframes heroHunterIntro") && css.includes("@keyframes heroHunterOutro"), "Hero Hunter popup should include intro and outro animation keyframes");
assert.ok(js.includes("setupHeroHunterPopup") && js.includes("heroHunterDelay = 15000"), "Hero Hunter popup should wait 15 seconds before showing");
assert.ok(js.includes("heroHunterMessages") && js.includes("data-hero-hunter-message"), "Hero Hunter popup should rotate through random messages");
assert.ok(js.includes("isHeroSectionActive") && js.includes("hero-hunter-popup") && js.includes("is-leaving"), "Hero Hunter popup should hide with an outro when the hero is no longer active");

const heroIndex = html.indexOf('id="header"');
const labIndex = html.indexOf('id="trillionunicorn-lab"');
const visionIndex = html.indexOf('id="founder-vision"');
assert.ok(heroIndex !== -1 && labIndex !== -1 && visionIndex !== -1, "Hero, startup lab, and founder vision sections should exist");
assert.ok(heroIndex < labIndex && labIndex < visionIndex, "Startup lab should be the second section immediately after the hero");
assert.ok(html.includes("https://www.youtube.com/embed/KRxQ8JuqMyE"), "Startup lab should embed the requested YouTube video");
assert.ok(html.includes("allowfullscreen"), "Startup video should allow fullscreen playback");
assert.ok(html.includes("youtube.com/watch?v=KRxQ8JuqMyE"), "Startup lab should include a direct YouTube link fallback");
assert.equal((html.match(/class="startup-icon-link/g) || []).length, 7, "Startup lab should show exactly seven compact startup icons");
assert.ok(!html.includes("startup-metrics") && !html.includes("startup-grid") && !html.includes("Platform Foundation"), "Startup lab should not keep the old heavy metric/card grid");
assert.ok(css.includes(".startup-video-frame") && css.includes(".startup-icon-row") && css.includes(".startup-sound-note"), "Startup lab should include focused video and compact icon styling");

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
  "hero-three-stage",
  "hero-three-source",
  "hero-three-canvas",
  "hero-three-orbit-field",
  "option-c-three-source.png",
  "initHeroThreeScene",
  "updateHeroThreeMotion",
  "--hero-three-bg-x",
  "--hero-three-bg-y",
  "hero.headlinePhrases",
  "headlineHoldDelay",
  "hero-word-special",
  "heroSpecialWordShine",
  "heroSpecialWordUnderline",
  "v1.6.6",
  "rotateHeadlinePhrase",
  "heroWordIn",
  "heroTypingCaret",
  "lazyWordPulse",
  "founder-journey",
  "founder-poster-stage",
  "startup-video-frame",
  "startup-icon-row",
  "startup-sound-note",
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
assert.ok(/position:\s*fixed/.test(navBlock) && /top:\s*0/.test(navBlock), "Top navbar should stick to the top of the viewport");
const heroTopNavBlock = (css.match(/body\.is-hero-top nav\s*{([\s\S]*?)}/) || [])[1] || "";
assert.ok(/opacity:\s*0/.test(heroTopNavBlock), "Top navbar should be invisible at the very top of the hero");
assert.ok(/pointer-events:\s*none/.test(heroTopNavBlock), "Top navbar should not be clickable at the very top of the hero");
assert.ok(/translate3d\(0,\s*-100%,\s*0\)/.test(heroTopNavBlock), "Top navbar should slide fully out above the viewport at the hero top");
assert.ok(css.includes("body.is-hero-top .theme-toggle") && css.includes("body.is-hero-top .language-toggle"), "Theme and language controls should share the hidden hero-top navbar state");
const heroTopControlBlock = (css.match(/body\.is-hero-top \.theme-toggle,\s*body\.is-hero-top \.language-toggle\s*{([\s\S]*?)}/) || [])[1] || "";
assert.ok(/opacity:\s*0/.test(heroTopControlBlock), "Theme and language controls should be invisible at the very top of the hero");
assert.ok(/pointer-events:\s*none/.test(heroTopControlBlock), "Theme and language controls should not be clickable at the very top of the hero");
const scrolledNavBlock = (css.match(/body:not\(\.is-hero-top\) nav\s*{([\s\S]*?)}/) || [])[1] || "";
assert.ok(/opacity:\s*1/.test(scrolledNavBlock) && /pointer-events:\s*auto/.test(scrolledNavBlock), "Navbar should become visible and clickable after scrolling");
const navSectionLabels = html.match(/data-nav-label="/g) || [];
const staticNavLinks = html.match(/<li><a href="#[^"]+" class="smoothScroll"/g) || [];
assert.equal(navSectionLabels.length, 13, `Expected 13 marked navbar sections, found ${navSectionLabels.length}`);
assert.equal(staticNavLinks.length, navSectionLabels.length, "Static navbar fallback should match marked section count");
assert.ok(js.includes("setupDynamicNavbar") && js.includes("[data-nav-label][id]"), "Navbar should be generated from marked sections");
assert.ok(js.includes("setupResponsiveNavbarToggle") && responsiveCss.includes(".nav-menu.is-open"), "Responsive navbar should use a native open state");
assert.ok(css.includes("grid-template-columns: 220px minmax(0, 1fr) 220px"), "Desktop navbar should reserve equal left and right columns while centering the menu");
assert.ok(!css.includes("padding-right: 250px"), "Navbar should not use the old hardcoded right padding");
assert.ok(js.includes("setupSmartNavbar") && js.includes('body.classList.toggle("is-hero-top"'), "Top navbar should be controlled by scroll state");
assert.ok(!js.includes('$("#main-nav, #main-nav-subpage").show()'), "Top navbar visibility should be handled by CSS state, not jQuery show calls");
assert.ok((js.match(/"hero\.headlinePhrases"/g) || []).length >= 2, "Hero headline should rotate typed phrases in both languages");
assert.ok(js.includes("headlineHoldDelay = 5000"), "Hero typed headline should hold each completed phrase for 5 seconds");
assert.ok(js.includes("specialWords") && js.includes("hero-word-special"), "Hero typed headline should wrap important words with a special effect class");
const heroKineticsBlock = js.slice(js.indexOf("function setupHeroKinetics()"), js.indexOf("if (!capability)"));
assert.ok(heroKineticsBlock.includes("renderIntroHeadline(headlinePhrases[phraseIndex]") && heroKineticsBlock.includes("heroHeadlineSwap"), "Hero headline should rotate as whole phrases with a stable swap animation");
assert.ok(!heroKineticsBlock.includes("characterIndex") && !heroKineticsBlock.includes("phrase.slice"), "Hero headline should not type/delete partial phrases because it looks unstable");
const heroCapabilityBlock = js.slice(js.indexOf("if (!capability)"), js.indexOf("function setupFounderJourney()"));
assert.ok(heroCapabilityBlock.includes("capability.textContent = capabilityText"), "Hero capability should render complete text immediately");
assert.ok(!heroCapabilityBlock.includes("setInterval") && !heroCapabilityBlock.includes("slice(0, index)"), "Hero capability should not type partial text because it looks unfinished in the new 3D hero");
assert.ok((html.match(/data-hunter-zone=/g) || []).length >= 5, "Hunter-bearing visuals should be registered as single-focus zones");
assert.ok(js.includes("setupSingleHunterFocus") && js.includes("[data-hunter-zone]"), "Single-Hunter focus manager should control visible Hunter zones");
assert.ok(css.includes("[data-hunter-zone]:not(.is-hunter-active)") && css.includes("brightness(0.03)"), "Inactive Hunter zones should be blacked/masked");

assert.ok(html.includes('class="hero-three-stage"') && html.includes('id="hero-three-canvas"'), "Homepage hero should use the selected Option C 3D stage");
assert.ok(html.includes("images/hero-options/option-c-three-source.png"), "Homepage hero should use the generated Option C source image");
assert.ok(!html.includes("hero-parallax-stack"), "Homepage hero should not keep the old five-layer hero stack after Option C is selected");
assert.ok(!js.includes("heroLayerSpeeds") && !js.includes("--layer-offset-x"), "Homepage hero JS should not keep the old five-layer scroll offset system");
assert.ok(css.includes(".hero-three-stage") && css.includes(".hero-three-canvas") && css.includes(".hero-three-orbit-field"), "Homepage CSS should style the Option C 3D hero");
assert.ok(css.includes("--hero-three-bg-x") && css.includes("--hero-three-bg-y"), "Option C hero background should still receive pointer and scroll depth offsets");
assert.ok(js.includes("function initHeroThreeScene()") && js.includes("function updateHeroThreeMotion()"), "Homepage JS should initialize and animate the Option C hero");
assert.ok(js.includes("preserveDrawingBuffer: true"), "Homepage Three.js renderer should preserve the frame buffer for browser verification");
assert.ok(js.includes("https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js"), "Homepage Option C hero should load Three.js as a static-page module");
assert.ok(fs.existsSync("images/hero-options/option-c-three-source.png"), "Missing selected Option C generated hero source image");
assert.ok(fs.statSync("images/hero-options/option-c-three-source.png").size > 10000, "Selected Option C source image looks too small");

const founderJourneyCss = css.slice(css.indexOf(".founder-journey {"), css.indexOf("[data-theme=\"dark\"] .vision-copy"));
assert.ok(founderJourneyCss.includes("min-height: calc(100vh - 156px)"), "Founder theater should use a large full-screen shell");
assert.ok(founderJourneyCss.includes("position: absolute") && founderJourneyCss.includes("inset: 0"), "Founder poster should fill the full theater shell as a background layer");
assert.ok(founderJourneyCss.includes("justify-self: end") && founderJourneyCss.includes("width: min(34vw, 430px)"), "Founder copy should be a compact floating side panel over the image");
assert.ok(founderJourneyCss.includes("object-fit: contain") && founderJourneyCss.includes("founder-poster-layer-all.is-visible"), "Founder poster should show the full poster top-to-bottom and reveal the final all-Hunters layer");
assert.ok(founderJourneyCss.includes("mix-blend-mode: screen"), "Founder theater should use a soft image mask effect");
assert.ok(!founderJourneyCss.includes("max-width: 560px"), "Founder poster should not be constrained to the old small card width");

const founderPosterLayers = html.match(/class="founder-poster-layer founder-poster-layer-[^"]+"/g) || [];
assert.equal(founderPosterLayers.length, 9, `Expected no-Hunter base, seven single-Hunter layers, and all-Hunters finale, found ${founderPosterLayers.length}`);
assert.ok(html.includes("founder-poster-layer-base") && html.includes("founder-poster-layer-all"), "Founder theater should start with no Hunter and end with all Hunters");
assert.equal((html.match(/data-founder-step="/g) || []).length, 7, "Founder theater should expose exactly seven single-Hunter steps");
assert.ok(js.includes("setFounderPosterLayerState") && js.includes("--founder-layer-offset-y"), "Founder theater should drive per-step layer visibility and parallax offsets");

const founderPosterAssets = [
  "images/founder-poster-layers/founder-poster-00-no-hunter.webp",
  "images/founder-poster-layers/founder-poster-01-miami.webp",
  "images/founder-poster-layers/founder-poster-02-cto.webp",
  "images/founder-poster-layers/founder-poster-03-center.webp",
  "images/founder-poster-layers/founder-poster-04-ahfaiz.webp",
  "images/founder-poster-layers/founder-poster-05-worldcup.webp",
  "images/founder-poster-layers/founder-poster-06-hackathon.webp",
  "images/founder-poster-layers/founder-poster-07-teaching.webp",
  "images/founder-poster-layers/founder-poster-08-all-hunters.webp"
];

for (const asset of founderPosterAssets) {
  assert.ok(html.includes(asset), `Missing founder poster layer asset in markup: ${asset}`);
  assert.ok(fs.existsSync(asset), `Missing founder poster layer asset file: ${asset}`);
}

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
