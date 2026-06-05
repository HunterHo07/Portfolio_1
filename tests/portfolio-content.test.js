const fs = require("node:fs");
const path = require("node:path");
const assert = require("node:assert/strict");

const html = fs.readFileSync("index.html", "utf8");
const css = fs.readFileSync("css/style.css", "utf8");
const responsiveCss = fs.readFileSync("css/responsive.css", "utf8");
const js = fs.readFileSync("js/main.js", "utf8");
const siblingRoot = path.resolve(process.cwd(), "..");

function readImageSize(filePath) {
  const buffer = fs.readFileSync(filePath);
  if (buffer.toString("ascii", 1, 4) === "PNG") {
    return {
      width: buffer.readUInt32BE(16),
      height: buffer.readUInt32BE(20)
    };
  }

  if (buffer[0] === 0xff && buffer[1] === 0xd8) {
    let offset = 2;
    while (offset < buffer.length) {
      if (buffer[offset] !== 0xff) {
        offset += 1;
        continue;
      }
      const marker = buffer[offset + 1];
      const blockLength = buffer.readUInt16BE(offset + 2);
      if (marker >= 0xc0 && marker <= 0xc3) {
        return {
          width: buffer.readUInt16BE(offset + 7),
          height: buffer.readUInt16BE(offset + 5)
        };
      }
      offset += 2 + blockLength;
    }
  }

  assert.fail(`Unsupported image thumbnail format: ${filePath}`);
}

for (const agentContextFile of ["AGENTS.md", "SKILL.md", "LLM.md"]) {
  assert.ok(fs.existsSync(agentContextFile), `Missing project guidance file: ${agentContextFile}`);
  const content = fs.readFileSync(agentContextFile, "utf8");
  assert.ok(content.includes("Portfolio_1") && content.includes("CX") && content.includes("performance"), `${agentContextFile} should capture Portfolio_1 CX/performance guidance`);
}

const headHtml = html.slice(html.indexOf("<head>"), html.indexOf("</head>"));
const headWithoutNoscript = headHtml.replace(/<noscript>[\s\S]*?<\/noscript>/g, "");
assert.ok(!/<script\s+src=/.test(headHtml), "Head should not contain external render-blocking scripts");
assert.ok(headHtml.includes('rel="preconnect" href="https://fonts.googleapis.com"'), "Head should preconnect to Google Fonts");
assert.ok(headHtml.includes('rel="preconnect" href="https://fonts.gstatic.com" crossorigin'), "Head should preconnect to Google font assets");
for (const asyncCss of [
  "lib/owlcarousel/assets/owl.carousel.min.css",
  "lib/magnific-popup/magnific-popup.css",
  "lib/hover/hover.min.css",
  "css/animate.css"
]) {
  assert.ok(headHtml.includes(`href="${asyncCss}"`) && headHtml.includes(`data-async-css="${asyncCss}"`) && /this\.media\s*=\s*['"]all['"]/.test(headHtml), `Noncritical CSS should load asynchronously: ${asyncCss}`);
  assert.ok(!headWithoutNoscript.includes(`<link href="${asyncCss}" rel="stylesheet" />`), `Noncritical CSS should not remain render-blocking: ${asyncCss}`);
}
assert.ok(/<link[\s\S]*rel="preload"[\s\S]*as="image"[\s\S]*href="images\/hero-options\/option-c-three-source\.jpg"[\s\S]*>/.test(headHtml), "Head should preload only the optimized active hero source image");
assert.ok(!headHtml.includes('rel="preload" as="image" href="images/founder-banner.jpeg"') && !headHtml.includes('rel="preload" as="image" href="images/founder-vision-poster.jpeg"'), "Below-fold images should not be preloaded");
const heroSourceTag = html.match(/<img[^>]*class="hero-three-source"[^>]*>/);
assert.ok(heroSourceTag && heroSourceTag[0].includes('src="images/hero-options/option-c-three-source.jpg"') && heroSourceTag[0].includes('loading="eager"') && heroSourceTag[0].includes('decoding="async"') && heroSourceTag[0].includes('fetchpriority="high"'), "Hero source image should be optimized, eager, async-decoded, and high priority");
assert.ok(fs.existsSync("images/hero-options/option-c-three-source.jpg"), "Missing optimized homepage hero source image");
assert.ok(fs.statSync("images/hero-options/option-c-three-source.jpg").size < 360000, "Optimized homepage hero source image should stay under 360 KB");
assert.ok(css.includes(".hero-three-stage::before") && css.includes("filter: blur(20px)") && css.includes("hero blur placeholder"), "Hero should have a lightweight blur placeholder before the hero image loads");
assert.ok(html.includes('class="is-hero-top is-hero-loading"'), "Body should start with a hero loading state before the hero image is ready");
assert.ok(html.includes('class="hero-image-loader"') && html.includes('data-hero-loader') && html.includes("Loading hero visual"), "Hero should show a small loader while the hero image is still downloading");
assert.ok(css.includes(".hero-image-loader") && css.includes(".hero-three-stage.is-image-ready::before") && css.includes("@keyframes heroLoaderSpin"), "Hero loader should be styled and fade the blur placeholder after the image is ready");
assert.ok(js.includes("setupHeroImageLoading") && js.includes("is-hero-loading") && js.includes("is-image-ready") && js.includes("decode()"), "Hero loader should resolve through image decode/load state in main.js");
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

for (const huskySprite of [
  "images/ui/husky-idle.png",
  "images/ui/husky-happy.png",
  "images/ui/husky-excited.png",
  "images/ui/husky-contact.png"
]) {
  const size = readImageSize(huskySprite);
  assert.equal(size.width, 256, `Husky helper sprite should be resized for its on-screen display width: ${huskySprite}`);
  assert.equal(size.height, 256, `Husky helper sprite should be resized for its on-screen display height: ${huskySprite}`);
  assert.ok(fs.statSync(huskySprite).size < 125000, `Husky helper sprite should stay under 125 KB: ${huskySprite}`);
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
  "Native Mobile App Projects",
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
  "Intro to N8N Application & Basics",
  "Non-IT vs Real-IT",
  "Decoding Tech Readiness",
  "Developer Productivity Workflow",
  "Hackathon Wins",
  "Real Hackathon Wins",
  "Deriv AI Hackathon Winner 2025",
  "Builder Since 2007",
  "Proof Theater",
  "Choose a proof moment.",
  "Hunter v2.0.4",
];

const requestedDemoUrls = [
  "https://d27-i7-sim-work.vercel.app/",
  "https://d34-i7-sim-work.vercel.app/",
  "https://i7-d5-simwork.vercel.app/",
  "https://i7-d1-simwork.vercel.app/",
  "https://i7-d2-simwork-lb6q.vercel.app/",
  "https://d25-i7-sim-work.vercel.app/",
  "https://d26-i7-sim-work.vercel.app/",
  "https://d33-i7-sim-work.vercel.app/",
  "https://d30-i42-instant-website-ai.vercel.app/",
  "https://h1-iota-recyclling.vercel.app/",
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
  "https://i5-d3-warrantyai.vercel.app/",
  "https://i6-d1-coredeskaicms.vercel.app/",
  "https://i6-d2-coredeskaicms.vercel.app/",
  "https://job1-six.vercel.app/",
  "https://job2-pearl.vercel.app/",
  "https://job3-sigma.vercel.app/",
  "https://lifeflowai.vercel.app/",
  "https://sicbo-ui-tool.vercel.app/",
  "https://v0-launch-gami-sport.vercel.app/",
  "https://p2-run-jian-sim-world.vercel.app/",
];

const requiredUrls = [
  ...requestedDemoUrls,
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
  "https://github.com/HunterHo07/mobile-warrantyscan-demo/tree/main/native-app",
  "https://github.com/HunterHo07/mobile-namecard-demo/tree/main/native-app",
  "https://github.com/TrillionUnicorn/OpenChance",
  "https://github.com/TrillionUnicorn/WorkFree",
  "https://github.com/TrillionUnicorn/CTOrendang",
  "https://github.com/TrillionUnicorn/GameMind",
  "https://github.com/TrillionUnicorn/CheckMe",
  "https://github.com/TrillionUnicorn/3Wallet",
  "https://github.com/TrillionUnicorn/AhFai",
];

const requiredAssets = [
  "images/logo.svg",
  "images/favicon.svg",
  "images/demo-thumb-bestzdeal-feature.png",
  "images/demo-thumb-bestzdeal-feature-demo.png",
  "images/demo-thumb-bestzdeal-feature-demo-match.png",
  "images/demo-thumb-travel-feature.png",
  "images/demo-thumb-sim-work-d27.png",
  "images/demo-thumb-sim-work-d27-demo.png",
  "images/demo-thumb-sim-work-d34.png",
  "images/demo-thumb-sim-work-d34-demo.png",
  "images/demo-thumb-sim-work-d34-project-manager.png",
  "images/demo-thumb-reportu-d1.png",
  "images/demo-thumb-reportu-d1-demo.png",
  "images/demo-thumb-reportu-d2.png",
  "images/demo-thumb-reportu-d2-demo.png",
  "images/demo-thumb-namecardai-d1.png",
  "images/demo-thumb-namecardai-d1-demo.png",
  "images/demo-thumb-namecardai-d2.png",
  "images/demo-thumb-namecardai-d2-demo.png",
  "images/demo-thumb-bestzdealai-d1.png",
  "images/demo-thumb-bestzdealai-d1-demo.png",
  "images/demo-thumb-bestzdealai-d2.png",
  "images/demo-thumb-bestzdealai-d2-demo.png",
  "images/demo-thumb-bestzdealai-d3.png",
  "images/demo-thumb-bestzdealai-d3-demo.png",
  "images/demo-thumb-messageyou-d1.png",
  "images/demo-thumb-messageyou-d1-demo.png",
  "images/demo-thumb-messageyou-d2.png",
  "images/demo-thumb-messageyou-d2-demo.png",
  "images/demo-thumb-warrantyai-d2.png",
  "images/demo-thumb-warrantyai-d2-demo.png",
  "images/demo-thumb-simwork-d5.png",
  "images/demo-thumb-simwork-d1.png",
  "images/demo-thumb-simwork-d2.png",
  "images/demo-thumb-sim-work-d25.png",
  "images/demo-thumb-sim-work-d26.png",
  "images/demo-thumb-sim-work-d33.png",
  "images/demo-thumb-instant-website-ai-d30.png",
  "images/demo-thumb-grab-recycling-iota.png",
  "images/demo-thumb-warrantyai-d3.png",
  "images/demo-thumb-coredesk-d1.png",
  "images/demo-thumb-coredesk-d2.png",
  "images/demo-thumb-job1.png",
  "images/demo-thumb-job2.png",
  "images/demo-thumb-job3.png",
  "images/demo-thumb-lifeflowai.png",
  "images/demo-thumb-sicbo-tool.png",
  "images/demo-thumb-gami-sport.png",
  "images/demo-thumb-runjian-simworld-p2.png",
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
  "images/demo-thumb-mobile-warrantyscan.jpg",
  "images/demo-thumb-mobile-namecard.jpg",
  "images/teaching/teaching-n8n-event.jpeg",
  "images/teaching/teaching-non-it-vs-real-it.jpeg",
  "images/teaching/teaching-tech-readiness.jpeg",
  "images/teaching/teaching-productivity.jpeg",
  "images/ui/cinematic-product-overlay.jpg",
  "images/ui/husky-idle.png",
  "images/ui/husky-happy.png",
  "images/ui/husky-excited.png",
  "images/ui/husky-contact.png",
  "images/founder-banner.jpeg",
  "images/about-hunter-parallax-v2.png",
  "images/hero-layers/hero-hunter-cutout.webp",
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

const assetsReferenceThumbSize = readImageSize("images/demo-thumb-rj-assets-1.png");
assert.deepEqual(
  readImageSize("images/demo-thumb-qstyle-3d-models-lab.png"),
  assetsReferenceThumbSize,
  "Assets 3 thumbnail should be refreshed from the working Q-style demo and match the Assets 1/2 screenshot format"
);

const detailButtons = html.match(/class="[^"]*project-detail-btn[^"]*"/g) || [];
assert.ok(detailButtons.length >= 43, `Expected at least 43 Details buttons after adding requested demos, found ${detailButtons.length}`);

const projectCards = html.match(/class="[^"]*portfolio-project[^"]*"/g) || [];
assert.ok(projectCards.length >= 43, `Expected at least 43 portfolio project cards after adding requested demos, found ${projectCards.length}`);

assert.ok(!html.includes('src="images/p1.webp" width="450" height="300" class="img-responsive" alt="Nice & Features BestzDeal"'), "BestzDeal feature demo still uses reused placeholder thumbnail");
assert.ok(
  html.includes('data-extra-thumbs="images/demo-thumb-bestzdeal-feature-demo.png,images/demo-thumb-bestzdeal-feature-demo-match.png"'),
  "Project 10 should include both BestzDeal /demo thumbnails in the thumbnail loop"
);
assert.ok(
  html.includes('data-extra-thumbs="images/demo-thumb-reportu-d1-demo.png"'),
  "Project 14 should include the ReportU /demo thumbnail in the thumbnail loop"
);
assert.ok(
  html.includes('data-extra-thumbs="images/demo-thumb-reportu-d2-demo.png"'),
  "Project 15 should include the ReportU D2 /demo thumbnail in the thumbnail loop"
);
assert.ok(
  html.includes('data-extra-thumbs="images/demo-thumb-sim-work-d27-demo.png"'),
  "Project 12 should include the Sim Work D27 /demo thumbnail in the thumbnail loop"
);
assert.ok(
  html.includes('data-extra-thumbs="images/demo-thumb-sim-work-d34-demo.png,images/demo-thumb-sim-work-d34-project-manager.png"'),
  "Project 13 should include both Sim Work D34 /demo thumbnails in the thumbnail loop"
);
for (const [projectNumber, demoThumb] of [
  [16, "images/demo-thumb-namecardai-d1-demo.png"],
  [17, "images/demo-thumb-namecardai-d2-demo.png"],
  [18, "images/demo-thumb-bestzdealai-d1-demo.png"],
  [19, "images/demo-thumb-bestzdealai-d2-demo.png"],
  [20, "images/demo-thumb-bestzdealai-d3-demo.png"],
  [21, "images/demo-thumb-messageyou-d1-demo.png"],
  [22, "images/demo-thumb-messageyou-d2-demo.png"],
  [23, "images/demo-thumb-warrantyai-d2-demo.png"],
]) {
  assert.ok(
    html.includes(`data-extra-thumbs="${demoThumb}"`),
    `Project ${projectNumber} should include its /demo thumbnail in the thumbnail loop`
  );
}
assert.ok(!html.includes('>ReportU <br /> D1<'), "ReportU card should use project number plus summary, not only project name");
assert.ok(html.indexOf("3D Models Demo") > html.indexOf("Games Demo"), "3D Models section should be separated after games section");
assert.ok((html.match(/Games Demo/g) || []).length >= 1, "Games Demo heading should exist");
assert.ok((html.match(/<div class="col-lg-4 col-md-6">/g) || []).length >= 9, "Expected expanded game/demo card layout");
assert.equal((html.match(/data-project-title="Games Demo -/g) || []).length, 9, "Every Games Demo card should have a Details button");
for (const gameClass of ["game-racer", "game-orbit", "game-runner", "game-arena", "game-cardlab", "game-tycoon"]) {
  assert.ok(html.includes(`game-demo-card ${gameClass}`), `Games Demo portfolio cards should expose distinct themed card class ${gameClass}`);
}
assert.ok(css.includes(".game-demo-card.game-racer") && css.includes(".game-demo-card.game-tycoon"), "Games Demo cards should use per-game visual themes instead of the same card surface");

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
assert.ok(css.includes(".contact-footer-bg img") && css.includes("object-position: center top"), "Founder footer background should anchor from the top so the banner text stays visible");
assert.ok(css.includes("min-height: clamp(980px, 74vw, 1160px)"), "Contact footer should be taller so the contact copy has room below the banner role text");
assert.ok(html.includes("contact-section-title") && css.includes(".contact-section-title") && css.includes("top: clamp(22px, 3.8vw, 52px)"), "Contact title should be its own top overlay above the Hunter name in the banner");
assert.ok(html.includes("contact-info-dock") && html.includes("contact-region") && html.includes("contact-links"), "Location and direct contact details should be split into two lower-left zones");
assert.ok(html.includes("contact-offer") && css.includes(".contact-offer") && css.includes("right: clamp(30px, 7vw, 126px)"), "Discount offer should be positioned as its own lower-right contact zone");
assert.ok(css.includes("contactPanelIn") && css.includes("contactLightSweep") && css.includes("contactGlowPulse"), "Contact zones should have intro and lighting highlight animations");
assert.ok(css.includes("#contact .col-lg-6") && css.includes("position: static"), "Contact card should not anchor to Bootstrap's 1px column height");
assert.ok(css.includes(".contact-info-dock") && css.includes("grid-template-columns: minmax(0, 1fr) minmax(230px, 0.78fr)"), "Contact lower-left area should use a two-part location/contact grid");
assert.ok(html.includes('class="contact-copyright-dock"') && html.includes("&copy; Copyrights Hunter Ho. All rights reserved."), "Copyright should move into the contact section as an animated dock");
assert.ok(!html.includes('id="footer"'), "Standalone footer section should be removed so the footer background is not a separate empty band");
assert.ok(css.includes(".contact-copyright-dock") && css.includes("translate3d(-50%, calc(100% + 34px), 0)") && css.includes(".contact-copyright-dock.is-visible"), "Copyright dock should animate in and out from the bottom");
assert.ok(js.includes("setupContactCopyrightDock") && js.includes("contact-copyright-dock") && js.includes("is-visible"), "Copyright dock should be controlled by scroll/intersection state");
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
const releaseBadgeTag = html.match(/<a[^>]*class="release-badge"[^>]*href="https:\/\/github\.com\/HunterHo07"[^>]*>[\s\S]*?<\/a>/);
assert.ok(releaseBadgeTag && releaseBadgeTag[0].includes("Hunter v2.0.4"), "Release badge should link to Hunter GitHub profile and use Hunter v2 version label");
assert.ok(!html.includes("Portfolio v") && !html.includes("Portfolio_1/releases/tag/"), "Release badge should no longer use the Portfolio release label or release URL");
assert.ok(html.includes("Book Me for Event") && js.includes('"hero.ctaSpeak": "Book Me for Event"'), "Hero event CTA should clearly target event/function invitations");
assert.ok(html.includes("Projects Demo") && js.includes('"hero.ctaProof": "Projects Demo"'), "Hero proof CTA should be renamed to Projects Demo");
assert.ok(!html.includes("Invite me to speak") && !js.includes("Invite me to speak") && !html.includes("View proof") && !js.includes('"hero.ctaProof": "View proof"'), "Hero CTAs should not keep the unclear old labels");
assert.ok(html.includes('class="hero-hunter-popup"') && html.includes("data-hero-hunter-message"), "Hero should include the delayed Hunter popup markup");
assert.ok(html.includes("images/hero-layers/hero-hunter-cutout.webp"), "Hero Hunter popup should use the transparent Hunter cutout image");
assert.ok(css.includes("width: clamp(150px, 13vw, 208px)") && css.includes("overflow: visible") && css.includes("background: transparent"), "Hero Hunter popup should show a larger unframed transparent person cutout");
assert.ok(css.includes(".hero-hunter-portrait-shell::before") && css.includes("display: none"), "Hero Hunter popup should not keep the old decorative portrait line");
assert.ok(css.includes("margin-bottom: clamp(46px, 5.4vw, 78px)"), "Hero Hunter message bubble should sit higher beside the larger Hunter cutout");
assert.ok(css.includes(".hero-hunter-popup") && css.includes(".hero-hunter-popup.is-visible") && css.includes(".hero-hunter-popup.is-leaving"), "Hero Hunter popup should include visible and leaving styles");
assert.ok(css.includes("@keyframes heroHunterIntro") && css.includes("@keyframes heroHunterOutro"), "Hero Hunter popup should include intro and outro animation keyframes");
assert.ok(js.includes("setupHeroHunterPopup") && js.includes("heroHunterDelay = 15000"), "Hero Hunter popup should wait 15 seconds before showing");
assert.ok(js.includes("heroHunterMessages") && js.includes("data-hero-hunter-message"), "Hero Hunter popup should rotate through random messages");
assert.ok(js.includes("isHeroSectionActive") && js.includes("hero-hunter-popup") && js.includes("is-leaving"), "Hero Hunter popup should hide with an outro when the hero is no longer active");

const pricingIndex = html.indexOf('id="journal"');
const aboutIndex = html.indexOf('id="about"');
const servicesIndex = html.indexOf('id="services"');
const contactIndex = html.indexOf('id="contact"');
assert.ok(
  pricingIndex !== -1 && aboutIndex !== -1 && servicesIndex !== -1 && contactIndex !== -1,
  "About, Services, Pricing, and Contact anchors should exist"
);
assert.ok(
  aboutIndex < servicesIndex && servicesIndex < pricingIndex && pricingIndex < contactIndex,
  "About, Services, and Pricing should be merged into one bottom stack before Contact"
);
assert.ok(
  html.indexOf('href="#about"') < html.indexOf('href="#services"') &&
    html.indexOf('href="#services"') < html.indexOf('href="#journal"') &&
    html.indexOf('href="#journal"') < html.indexOf('href="#contact"'),
  "Static navbar should follow the merged About, Services, Pricing, Contact order"
);
const aboutSectionEnd = html.indexOf("<!-- end section about services stack -->", aboutIndex);
assert.ok(aboutSectionEnd > aboutIndex, "About/Services stack should keep an explicit end marker for scoped checks");
const aboutServicesStack = html.slice(aboutIndex, aboutSectionEnd);
assert.ok(aboutServicesStack.includes("about-services-stack"), "About and Services should be grouped in one bottom stack");
assert.ok(aboutServicesStack.includes('id="journal"') && aboutServicesStack.includes("My Service"), "My Service pricing cards should be merged into the About/Services bottom stack");
assert.ok(aboutServicesStack.includes("about-hunter-parallax-v2.png"), "About section should use the new generated Hunter cutout");
assert.ok(!aboutServicesStack.includes("images/HunterHo.webp"), "About section should not keep the old framed Hunter portrait");
assert.ok(aboutServicesStack.includes("about-portrait-parallax") && aboutServicesStack.includes("data-parallax-depth"), "About portrait should include parallax hooks");
assert.ok(css.includes(".about-services-stack") && css.includes(".about-portrait-parallax"), "About/Services stack should include dedicated parallax styling");
assert.ok(js.includes("setupAboutServicesParallax") && js.includes("--about-parallax-y"), "About/Services stack should include scroll-driven parallax behavior");
assert.ok(js.includes("getSectionDocumentTop") && js.includes("getBoundingClientRect().top + window.scrollY"), "Navbar scrollspy should use document coordinates so nested Services does not become active too early");
assert.ok(!js.includes("section.offsetTop <= scrollAnchor"), "Navbar scrollspy should not use offsetTop for nested section anchors");

const heroIndex = html.indexOf('id="header"');
const labIndex = html.indexOf('id="trillionunicorn-lab"');
const visionIndex = html.indexOf('id="founder-vision"');
const journeyIndex = html.indexOf('id="founder-journey"');
assert.ok(heroIndex !== -1 && labIndex !== -1 && journeyIndex !== -1, "Hero, startup lab, and founder proof theater sections should exist");
assert.equal(visionIndex, -1, "Founder Vision standalone section should be removed after moving its useful intro into the Startup Lab");
assert.ok(heroIndex < labIndex && labIndex < journeyIndex, "Startup Lab should be the second section and lead directly into the proof theater");
const startupLabSection = html.slice(labIndex, journeyIndex);
assert.ok(html.includes("https://www.youtube.com/embed/KRxQ8JuqMyE"), "Startup lab should embed the requested YouTube video");
assert.ok(html.includes("allowfullscreen"), "Startup video should allow fullscreen playback");
assert.ok(html.includes("compute-pressure"), "Startup video should allow compute-pressure to avoid embedded permission console errors");
assert.ok(html.includes("youtube.com/watch?v=KRxQ8JuqMyE"), "Startup lab should include a direct YouTube link fallback");
assert.equal((html.match(/class="startup-icon-link/g) || []).length, 7, "Startup lab should show exactly seven compact startup icons");
assert.ok(!html.includes("startup-metrics") && !html.includes("startup-grid") && !html.includes("Platform Foundation"), "Startup lab should not keep the old heavy metric/card grid");
assert.ok(css.includes(".startup-video-frame") && css.includes(".startup-icon-row") && css.includes(".startup-sound-note"), "Startup lab should include focused video and compact icon styling");
assert.ok(startupLabSection.includes("startup-founder-band") && startupLabSection.includes("Founder Vision") && startupLabSection.includes("Build products. Automate futures. Ship real impact."), "Founder Vision intro should be integrated at the bottom of the Startup Lab section");
assert.ok(startupLabSection.indexOf("startup-founder-band") > startupLabSection.indexOf("startup-icon-row"), "Founder Vision intro should sit below the seven startup icons");
assert.ok(!html.includes('href="#founder-vision"') && !html.includes('data-nav-label="Vision"'), "Removed Founder Vision section should not leave a navbar target behind");
assert.ok(css.includes(".startup-founder-band") && css.includes(".startup-founder-roles"), "Startup Lab should include dedicated bottom Founder Vision styling");
assert.ok(startupLabSection.includes("startup-founder-proof-preview") && startupLabSection.includes("founder-poster-08-all-hunters.webp"), "Founder Vision band should replace the old side roles area with a proof poster preview image");
assert.ok(startupLabSection.indexOf("startup-founder-roles") > startupLabSection.indexOf("teams move from idea to working system."), "Founder role chips should sit below the Founder Vision copy");
assert.ok(startupLabSection.indexOf("startup-founder-roles") > startupLabSection.indexOf("startup-founder-proof-preview"), "Founder role chips should move below the proof poster preview so long labels do not clip in the copy column");
assert.ok(startupLabSection.indexOf("startup-founder-roles") < startupLabSection.indexOf("startup-tech-stack-flow"), "Founder role chips should sit above the looping tech stack rows");
assert.ok(css.includes(".startup-founder-roles") && css.includes("grid-column: 1 / -1") && css.includes("grid-template-columns: repeat(6, minmax(0, 1fr))"), "Founder role chips should use a full-width six-column row below the image on desktop");
assert.ok(css.includes(".startup-founder-proof-preview") && css.includes("min-height: clamp(560px, 48vw, 760px)") && css.includes("object-fit: contain"), "Founder proof poster preview should be tall enough and use contain sizing so the top and bottom are not cropped");
assert.ok(css.includes("@media (max-width: 767px)") && css.includes(".startup-founder-roles") && css.includes("display: none"), "Founder role chips should be hidden on mobile instead of becoming clipped horizontal controls");
assert.ok(startupLabSection.includes("startup-tech-stack-flow"), "Startup founder band should include a three-layer tech stack flow in the empty strip before Proof Theater");
assert.equal((startupLabSection.match(/class="tech-stack-row/g) || []).length, 3, "Startup tech stack flow should have exactly three animated rows");
for (const techToken of [
  "TypeScript",
  "Python",
  "ASP.NET Core",
  "React Native",
  "PostgreSQL",
  "Docker",
  "Vercel",
  "Figma",
  "OpenAI API",
  "n8n",
  "Solidity",
  "TrillionUnicorn"
]) {
  assert.ok(startupLabSection.includes(techToken), `Startup tech stack flow missing token: ${techToken}`);
}
assert.ok(css.includes(".startup-tech-stack-flow") && css.includes("@keyframes techStackMarqueeLeft") && css.includes("@keyframes techStackMarqueeRight"), "Startup tech stack flow should include left/right marquee animation styling");
assert.ok(css.includes(".tech-orbit-pill.is-lit") && css.includes("techPillGlow") && css.includes(".tech-orbit-pill.is-dim"), "Startup tech stack pills should include highlight-on/off lighting styles");
assert.ok(js.includes("setupStartupTechStackLights") && js.includes("data-tech-stack-row") && js.includes("is-lit") && js.includes("is-dim") && js.includes("Math.random"), "Startup tech stack flow should rotate and randomly light individual pills with JavaScript");

for (const token of [
  "hero-actions",
  "magnetic-cta",
  "proof-motion-wall",
  "real-teaching-grid",
  "teaching-n8n-event.jpeg",
  "teaching-non-it-vs-real-it.jpeg",
  "teaching-tech-readiness.jpeg",
  "teaching-productivity.jpeg",
  "hero-three-stage",
  "hero-three-source",
  "hero-three-canvas",
  "hero-three-orbit-field",
  "option-c-three-source.jpg",
  "initHeroThreeScene",
  "updateHeroThreeMotion",
  "--hero-three-bg-x",
  "--hero-three-bg-y",
  "hero.headlinePhrases",
  "headlineHoldDelay",
  "hero-word-special",
  "v2.0.4",
  "rotateHeadlinePhrase",
  "heroWordIn",
  "heroTypingCaret",
  "lazyWordPulse",
  "founder-journey",
  "founder-poster-stage",
  "founder-dashboard-hud",
  "founder-hud-panel-top",
  "founder-hud-panel-bottom",
  "startup-video-frame",
  "startup-icon-row",
  "startup-sound-note",
  "compact-hackathon-wins",
  "compact-hackathon-grid",
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
const navMenuBlock = (html.match(/<ul class="nav-menu list-unstyled">([\s\S]*?)<\/ul>/) || [])[1] || "";
const staticNavLinks = navMenuBlock.match(/<a\b[^>]*href="#[^"]+"[^>]*class="smoothScroll"/g) || [];
assert.equal(navSectionLabels.length, 12, `Expected 12 marked navbar sections after removing Founder Vision, found ${navSectionLabels.length}`);
assert.equal(staticNavLinks.length, navSectionLabels.length, "Static navbar fallback should match marked section count");
assert.ok(js.includes("setupDynamicNavbar") && js.includes("[data-nav-label][id]"), "Navbar should be generated from marked sections");
assert.ok(js.includes("setupResponsiveNavbarToggle") && responsiveCss.includes(".nav-menu.is-open"), "Responsive navbar should use a native open state");
assert.ok(css.includes("grid-template-columns: 220px minmax(0, 1fr) 220px"), "Desktop navbar should reserve equal left and right columns while centering the menu");
assert.ok(!css.includes("padding-right: 250px"), "Navbar should not use the old hardcoded right padding");
assert.ok(js.includes("setupSmartNavbar") && js.includes('body.classList.toggle("is-hero-top"'), "Top navbar should be controlled by scroll state");
assert.ok(!js.includes('$("#main-nav, #main-nav-subpage").show()'), "Top navbar visibility should be handled by CSS state, not jQuery show calls");
assert.ok((js.match(/"hero\.headlinePhrases"/g) || []).length >= 2, "Hero headline should rotate typed phrases in both languages");
assert.ok(js.includes("headlineHoldDelay = 5000"), "Hero typed headline should hold each completed phrase for 5 seconds");
assert.ok(js.includes("headlineInitialDelay = 60000") && js.includes("headlineInitialDelay);"), "Hero headline rotation should wait for the initial hero render to settle before repainting the LCP headline");
assert.ok(js.includes("specialWords") && js.includes("hero-word-special"), "Hero typed headline should wrap important words with a special effect class");
const heroSpecialWordCss = css.slice(css.indexOf(".hero-headline .hero-word-special"), css.indexOf(".header-content p"));
assert.ok(heroSpecialWordCss.includes("background: linear-gradient") && heroSpecialWordCss.includes("::after"), "Hero special words should keep the gradient and underline treatment");
assert.ok(!heroSpecialWordCss.includes("infinite"), "Hero special words should not repaint forever because the H1 is the LCP element");
const heroKineticsBlock = js.slice(js.indexOf("function setupHeroKinetics()"), js.indexOf("if (!capability)"));
assert.ok(heroKineticsBlock.includes("renderIntroHeadline(headlinePhrases[phraseIndex]") && heroKineticsBlock.includes("heroHeadlineSwap"), "Hero headline should rotate as whole phrases with a stable swap animation");
assert.ok(!heroKineticsBlock.includes("characterIndex") && !heroKineticsBlock.includes("phrase.slice"), "Hero headline should not type/delete partial phrases because it looks unstable");
const heroCapabilityBlock = js.slice(js.indexOf("if (!capability)"), js.indexOf("function setupFounderJourney()"));
assert.ok(heroCapabilityBlock.includes("capability.textContent = capabilityText"), "Hero capability should render complete text immediately");
assert.ok(!heroCapabilityBlock.includes("setInterval") && !heroCapabilityBlock.includes("slice(0, index)"), "Hero capability should not type partial text because it looks unfinished in the new 3D hero");
assert.ok((html.match(/data-hunter-zone=/g) || []).length >= 4, "Remaining Hunter-bearing visuals should be registered as single-focus zones");
assert.ok(js.includes("setupSingleHunterFocus") && js.includes("[data-hunter-zone]"), "Single-Hunter focus manager should control visible Hunter zones");
assert.ok(css.includes("[data-hunter-zone]:not(.is-hunter-active)") && css.includes("brightness(0.03)"), "Inactive Hunter zones should be blacked/masked");

assert.ok(html.includes('class="hero-three-stage"') && html.includes('id="hero-three-canvas"'), "Homepage hero should use the selected Option C 3D stage");
assert.ok(html.includes("images/hero-options/option-c-three-source.jpg"), "Homepage hero should use the optimized Option C source image");
assert.ok(!html.includes("hero-parallax-stack"), "Homepage hero should not keep the old five-layer hero stack after Option C is selected");
assert.ok(!js.includes("heroLayerSpeeds") && !js.includes("--layer-offset-x"), "Homepage hero JS should not keep the old five-layer scroll offset system");
assert.ok(css.includes(".hero-three-stage") && css.includes(".hero-three-canvas") && css.includes(".hero-three-orbit-field"), "Homepage CSS should style the Option C 3D hero");
assert.ok(css.includes("--hero-three-bg-x") && css.includes("--hero-three-bg-y"), "Option C hero background should still receive pointer and scroll depth offsets");
assert.ok(js.includes("function initHeroThreeScene()") && js.includes("function updateHeroThreeMotion()"), "Homepage JS should initialize and animate the Option C hero");
assert.ok(js.includes("preserveDrawingBuffer: true"), "Homepage Three.js renderer should preserve the frame buffer for browser verification");
assert.ok(js.includes("https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js"), "Homepage Option C hero should load Three.js as a static-page module");
assert.ok(fs.existsSync("images/hero-options/option-c-three-source.png"), "Missing selected Option C source image for the hero option picker");
assert.ok(fs.statSync("images/hero-options/option-c-three-source.png").size > 10000, "Selected Option C source image for the hero option picker looks too small");

const founderJourneyCss = css.slice(css.indexOf(".founder-journey {"), css.indexOf(".proof-section {"));
assert.ok(founderJourneyCss.includes("min-height: 1300vh"), "Founder theater should reserve enough scroll runway so lower proof states land visibly before changing");
assert.ok(founderJourneyCss.includes("min-height: calc(100vh - 76px)"), "Founder theater should use a near full-viewport shell");
assert.ok(founderJourneyCss.includes("position: absolute") && founderJourneyCss.includes("inset: 0"), "Founder poster should fill the full theater shell as a background layer");
assert.ok(founderJourneyCss.includes("#founder-journey .container") && founderJourneyCss.includes("max-width: min(1920px, calc(100vw - 12px))"), "Founder theater should use a near full-bleed container instead of the default page grid");
assert.ok(founderJourneyCss.includes("width: min(104vw, 1440px)") && founderJourneyCss.includes("height: auto"), "Founder poster should render wider so the image is the section spotlight");
assert.ok(founderJourneyCss.includes("founder-poster-spotlight-safe") && founderJourneyCss.includes("pointer-events: none"), "Founder theater should reserve a non-blocking spotlight zone for Hunter faces");
assert.ok(founderJourneyCss.includes("--poster-scroll-y") && js.includes("--poster-scroll-y"), "Founder poster should scroll vertically through the tall poster image as the section progresses");
assert.ok(js.includes("founderPosterScrollAnchors") && js.includes('scroll: "-64%"') && js.includes('scroll: "-67%"'), "Founder lower proof states should use explicit poster scroll anchors so Hackathon and Teaching land near the screen center before changing");
assert.ok(founderJourneyCss.includes("founder-dashboard-hud") && founderJourneyCss.includes("pointer-events: none"), "Founder text should be presented as non-blocking dashboard HUD panels");
assert.ok(html.includes("data-founder-copy-label") && html.includes("data-founder-copy-title") && html.includes("data-founder-copy-message"), "Founder title HUD should expose dynamic copy slots");
assert.ok(html.includes('aria-live="polite"') && !html.includes("One Hunter. Seven proof moments.</h2>"), "Founder title HUD should not keep the old static generic headline");
assert.ok(!html.includes("The poster reveals one Hunter proof moment at a time"), "Founder theater should remove the redundant explanatory side note");
assert.ok(!html.includes("founder-hud-panel-side"), "Founder theater should not keep the meaningless side dashboard panel");
assert.ok(founderJourneyCss.includes("data-founder-state=\"1\"") && founderJourneyCss.includes("data-founder-state=\"6\"") && founderJourneyCss.includes("--founder-hud-left"), "Founder HUD title panel should move away from each active proof image zone");
assert.ok(founderJourneyCss.includes("@keyframes founderHudTopIn") && founderJourneyCss.includes("@keyframes founderHudSideIn") && founderJourneyCss.includes("@keyframes founderHudBottomIn"), "Founder dashboard HUD should animate in from the top, side, and bottom");
assert.ok(founderJourneyCss.includes(".founder-hud-panel-top.is-copy-swapping") && founderJourneyCss.includes("@keyframes founderCopySwap"), "Founder title HUD should animate copy intro/outro when proof state changes");
assert.ok(founderJourneyCss.includes("founder-hud-panel-top") && founderJourneyCss.includes("founder-hud-panel-bottom"), "Founder proof copy should stay in meaningful top and bottom dashboard panels");
assert.ok(founderJourneyCss.includes("founder-poster-layer-all.is-visible"), "Founder poster should still reveal the final all-Hunters layer");
assert.ok(founderJourneyCss.includes(".founder-journey.is-final-poster .founder-poster-layer-all") && founderJourneyCss.includes("height: min(90vh, 980px)") && founderJourneyCss.includes("translate3d(-50%, -50%, 0)"), "Founder final state should zoom out to show the complete poster on screen");
assert.ok(founderJourneyCss.includes(".founder-final-callouts") && founderJourneyCss.includes("is-final-poster .founder-final-callouts"), "Founder final state should show digital callouts instead of covering the middle poster");
assert.ok(founderJourneyCss.includes(".founder-journey-steps span") && founderJourneyCss.includes("display: none"), "Founder bottom proof buttons should stay compact and avoid blocking the poster");
assert.ok(founderJourneyCss.includes(".founder-theater-controls") && founderJourneyCss.includes(".founder-step-btn"), "Founder theater should expose clickable bottom navigation controls");
assert.ok(css.includes(".founder-final-callout") && css.includes("proofCalloutGlow"), "Founder final callouts should use animated digital highlights");
assert.ok(founderJourneyCss.includes("mix-blend-mode: screen"), "Founder theater should use a soft image mask effect");
assert.ok(!founderJourneyCss.includes("max-width: 560px"), "Founder poster should not be constrained to the old small card width");
assert.ok(!founderJourneyCss.includes("width: min(78vw, 920px)"), "Founder poster should not keep the old narrow width");

const founderPosterLayers = html.match(/class="founder-poster-layer founder-poster-layer-[^"]+"/g) || [];
assert.equal(founderPosterLayers.length, 8, `Expected no-Hunter base, six single-Hunter layers, and all-Hunters finale, found ${founderPosterLayers.length}`);
assert.ok(html.includes("founder-poster-layer-base") && html.includes("founder-poster-layer-all"), "Founder theater should start with no Hunter and end with all Hunters");
assert.equal((html.match(/data-founder-step="/g) || []).length, 6, "Founder theater should expose exactly six single-Hunter steps after skipping the middle portrait layer");
assert.equal((html.match(/data-founder-target="/g) || []).length, 6, "Founder bottom proof buttons should be clickable targets for each proof moment");
assert.ok(html.includes('data-founder-action="prev"') && html.includes('data-founder-action="next"') && html.includes('data-founder-action="skip"'), "Founder theater should include Prev, Next, and Skip controls");
assert.ok(js.includes("setFounderPosterLayerState") && js.includes("--founder-layer-offset-y"), "Founder theater should drive per-step layer visibility and parallax offsets");
assert.ok(js.includes("scrollToFounderState") && js.includes("data-founder-target") && js.includes("data-founder-action"), "Founder theater controls should scroll to proof states and the final poster");
assert.ok(js.includes("founderCopyStates") && js.includes("Challenge Accepted") && js.includes("Trillion Unicorn CTO") && js.includes("Ahfaiz AI Startup") && js.includes("WorldCup 2026") && js.includes("Community IT Teacher") && js.includes("Complete Vision Poster"), "Founder theater should provide meaningful per-proof tag, intro, and message copy");
assert.ok(js.includes("updateFounderCopy") && js.includes("is-copy-swapping"), "Founder theater should animate copy changes from the controller");
assert.ok(js.includes('journey.setAttribute("data-founder-state"') && !js.includes("sidePanel.style.opacity"), "Founder theater controller should expose state for CSS-positioned HUD panels");
assert.ok(js.includes('posterStage.classList.add("is-hunter-active")'), "Founder theater should keep its poster stage visible instead of depending on other Hunter zones");

const founderPosterAssets = [
  "images/founder-poster-layers/founder-poster-00-no-hunter.webp",
  "images/founder-poster-layers/founder-poster-01-miami.webp",
  "images/founder-poster-layers/founder-poster-02-cto.webp",
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
assert.ok(!html.includes("founder-poster-03-center.webp"), "Founder theater should skip the middle portrait layer from the proof scroll sequence");
assert.equal((html.match(/class="founder-final-callout"/g) || []).length, 6, "Founder final poster should show six proof callouts for the six useful moments");

const speakerIndex = html.indexOf('id="speaker-teaching"');
const hackathonWinsIndex = html.indexOf('id="hackathon-wins"');
const projectAssetsIndex = html.indexOf('id="project-assets-section"');
const hunterIndex = html.indexOf('id="hunter"');
const mobileDemoIndex = html.indexOf('id="mobile-app-demos"');
const demoProjectsIndex = html.indexOf('data-text="Demo Projects"');
const gamesDemoIndex = html.indexOf('data-text="Games Demo"');
const speakerEnd = html.indexOf("<!-- end section speaker teaching -->", speakerIndex);
const hackathonWinsEnd = html.indexOf("<!-- end section hackathon wins -->", hackathonWinsIndex);
assert.ok(mobileDemoIndex !== -1 && demoProjectsIndex !== -1 && gamesDemoIndex !== -1, "Native Mobile App Projects, Demo Projects, and Games Demo sections should exist");
assert.ok(demoProjectsIndex < mobileDemoIndex && mobileDemoIndex < gamesDemoIndex, "Native Mobile App Projects should stay below Demo Projects and before Games Demo");
const demoProjectsSection = html.slice(demoProjectsIndex, mobileDemoIndex);
const normalizeDemoUrl = (url) => url.replace(/\/$/, "").toLowerCase();
const demoCardUrls = [...demoProjectsSection.matchAll(/<div class="col-lg-4 col-md-6">\s*<div class="journal-info portfolio-project">\s*<a\s+target="_blank"\s+href="([^"]+)"/g)].map((match) => normalizeDemoUrl(match[1]));
const duplicateDemoCardUrls = demoCardUrls.filter((url, index) => demoCardUrls.indexOf(url) !== index);
assert.deepEqual(duplicateDemoCardUrls, [], `Demo Projects should not add duplicate cards for already-listed URLs: ${duplicateDemoCardUrls.join(", ")}`);
for (const requestedDemoUrl of requestedDemoUrls) {
  assert.ok(demoCardUrls.includes(normalizeDemoUrl(requestedDemoUrl)), `Missing requested demo card URL: ${requestedDemoUrl}`);
}
const mobileSectionEnd = html.indexOf("<!-- end mobile app demo -->", mobileDemoIndex);
assert.ok(mobileSectionEnd > mobileDemoIndex, "Native Mobile App Projects section should keep an explicit end marker for scoped checks");
const mobileSection = html.slice(mobileDemoIndex, mobileSectionEnd);
assert.ok(mobileSection.includes("Native Mobile App Projects") && mobileSection.includes("Android-ready"), "Mobile section should present native app projects, not web demos");
assert.equal((mobileSection.match(/class="app-build-status"/g) || []).length, 2, "Each mobile card should expose app build status metadata");
assert.equal((mobileSection.match(/class="mobile-app-platforms"/g) || []).length, 2, "Each mobile card should expose native platform tags");
assert.ok(mobileSection.includes("App Source") && mobileSection.includes("Android Project") && mobileSection.includes("React Native") && mobileSection.includes("Expo"), "Mobile cards should link and describe real native app source");
assert.ok(!mobileSection.includes("PWA") && !mobileSection.includes("responsive app shells") && !mobileSection.includes("Live Demo"), "Mobile section should not describe the apps as PWA/web live demos");
assert.ok(!mobileSection.includes("github.io/mobile-warrantyscan-demo") && !mobileSection.includes("github.io/mobile-namecard-demo"), "Mobile cards should not link to the old web demo pages");
for (const nativeAppPath of [
  "mobile-warrantyscan-demo/native-app/package.json",
  "mobile-warrantyscan-demo/native-app/App.tsx",
  "mobile-warrantyscan-demo/native-app/app.json",
  "mobile-namecard-demo/native-app/package.json",
  "mobile-namecard-demo/native-app/App.tsx",
  "mobile-namecard-demo/native-app/app.json"
]) {
  assert.ok(fs.existsSync(path.join(siblingRoot, nativeAppPath)), `Missing native mobile app source file: ${nativeAppPath}`);
}
assert.ok(speakerIndex !== -1 && hackathonWinsIndex !== -1 && projectAssetsIndex !== -1 && hunterIndex !== -1, "Teaching, Wins, 3D Models, and Development sections should exist");
assert.ok(projectAssetsIndex < speakerIndex && speakerIndex < hackathonWinsIndex && hackathonWinsIndex < hunterIndex, "Speaker & Teaching should be followed by compact Hackathon Wins before Development");
assert.ok(speakerEnd > speakerIndex, "Teaching section should keep an explicit end marker for scoped checks");
assert.ok(hackathonWinsEnd > hackathonWinsIndex, "Hackathon Wins section should keep an explicit end marker for scoped checks");
const speakerSection = html.slice(speakerIndex, speakerEnd);
const hackathonWinsSection = html.slice(hackathonWinsIndex, hackathonWinsEnd);
assert.ok(speakerSection.includes("teaching-section-heading") && speakerSection.includes("Real IT Teaching & Invited Sessions"), "Teaching section should have a compact section title above the cards");
assert.equal((speakerSection.match(/class="teaching-proof-card"/g) || []).length, 4, "Speaker & Teaching should only keep four teaching cards");
assert.equal((speakerSection.match(/class="teaching-card-media"/g) || []).length, 4, "Teaching cards should wrap real images in a stable media frame");
assert.ok(hackathonWinsSection.includes("compact-hackathon-wins") && hackathonWinsSection.includes("Real Hackathon Wins"), "Hackathon wins should be a compact titled block below Teaching");
assert.ok(!html.includes("hackathon-proof-wall") && !html.includes("Champion Stage"), "Standalone Champion Stage proof wall should be removed");
assert.equal((hackathonWinsSection.match(/class="hackathon-win-card"/g) || []).length, 4, "Compact Hackathon Wins should keep exactly four win cards");
assert.ok(html.indexOf('href="#speaker-teaching"') < html.indexOf('href="#hackathon-wins"'), "Navbar order should place Teaching before Wins after moving the wins block");
for (const realTeachingAsset of [
  "images/teaching/teaching-n8n-event.jpeg",
  "images/teaching/teaching-non-it-vs-real-it.jpeg",
  "images/teaching/teaching-tech-readiness.jpeg",
  "images/teaching/teaching-productivity.jpeg"
]) {
  assert.ok(speakerSection.includes(realTeachingAsset), `Teaching section should use real class/invitation image: ${realTeachingAsset}`);
}
for (const oldSafeTeachingAsset of [
  "images/teaching/teaching-safe-online.png",
  "images/teaching/teaching-safe-onsite.png",
  "images/teaching/teaching-safe-hero-v2.png",
  "images/teaching/teaching-safe-stage.png",
  "images/teaching/teaching-safe-workflow.png"
]) {
  assert.ok(!speakerSection.includes(oldSafeTeachingAsset), `Teaching section should not use generated safe placeholder image: ${oldSafeTeachingAsset}`);
}
for (const removedTeachingShell of ["speaker-shell", "speaker-copy", "speaker-hero", "speaker-tags", "speaker-proof-note", "privacy-safe-teaching"]) {
  assert.ok(!speakerSection.includes(removedTeachingShell), `Teaching section should remove the old large intro shell: ${removedTeachingShell}`);
}
assert.ok(css.includes(".real-teaching-grid"), "Teaching cards should use a dedicated real-image grid style");
assert.ok(css.includes(".teaching-section-heading") && css.includes(".teaching-card-media") && css.includes("aspect-ratio") && css.includes("object-fit: contain"), "Teaching section CSS should size the title and fit full real images without cropping");
assert.ok(css.includes(".teaching-card-copy") && css.includes("color: #f8f2e6") && css.includes("rgba(247, 243, 232, 0.74)"), "Teaching card copy should stay readable on the dark card surface in light and dark themes");

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

for (const extraThumbs of [...html.matchAll(/data-extra-thumbs="([^"]+)"/g)].map((match) => match[1])) {
  for (const extraThumb of extraThumbs.split(",").map((src) => src.trim()).filter(Boolean)) {
    assert.ok(fs.existsSync(extraThumb), `Missing extra thumbnail asset: ${extraThumb}`);
  }
}

assert.ok(!html.includes("images/teaching/speaker-teaching-banner.png"), "Teaching section should not restore the old banner image");

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
