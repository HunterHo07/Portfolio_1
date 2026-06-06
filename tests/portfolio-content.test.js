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
  "language-toggle",
  "data-i18n",
  "husky-helper",
  "parallax-backdrop",
  "data-theme",
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
  "Non-IT vs Real-IT",
  "Vibe Coding 101",
  "Intro to N8N Application &amp; Basics 2026",
  "Decoding Tech Readiness",
  "Developer Productivity Workflow",
  "Outside Full-Time Work",
  "Hunter Timeline + Happening",
  "hackathons, Web3 events",
  "Builder Since 2007",
  "Proof Theater",
  "Choose a proof moment.",
  "Hunter v2.1.0",
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
  "https://mobile-warrantyscan-demo.vercel.app",
  "https://mobile-namecard-demo.vercel.app",
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
  "images/demo-thumb-game-neon-signal-run.png",
  "images/demo-thumb-qstyle-3d-models-lab.png",
  "images/demo-thumb-qstyle-3d-models-lab-cards.png",
  "images/demo-thumb-qstyle-3d-models-lab-detail.png",
  "images/demo-thumb-qstyle-3d-models-lab-mobile.png",
  "images/hackathon/deriv-ai-hackathon-stage-2025.jpg",
  "images/hackathon/deriv-ai-hackathon-countdown.jpg",
  "images/demo-thumb-mobile-warrantyscan.jpg",
  "images/demo-thumb-mobile-namecard.jpg",
  "images/teaching/teaching-non-it-vs-real-it.jpeg",
  "images/teaching/teaching-vibe-coding-101.svg",
  "images/teaching/teaching-intro-n8n-basics-2026.svg",
  "images/teaching/teaching-tech-readiness.jpeg",
  "images/teaching/teaching-productivity.jpeg",
  "images/ui/cinematic-product-overlay.jpg",
  "images/ui/husky-idle.png",
  "images/ui/husky-happy.png",
  "images/ui/husky-excited.png",
  "images/ui/husky-contact.png",
  "images/founder-banner-contact-email.webp",
  "images/about-hunter-parallax-v2.png",
  "images/hero-layers/hero-hunter-cutout.webp",
  "images/hunter-demo-bg-neon-matrix.png",
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
const demoProjectsStart = html.indexOf('data-text="Demo Projects"');
const demoProjectsEndForNames = html.indexOf("<!-- mobile app demo -->", demoProjectsStart);
const demoProjectsForNames = html.slice(demoProjectsStart, demoProjectsEndForNames);
for (const oldCodeName of [
  "Sim Work Operations Demo",
  "Sim Work Visual Upgrade",
  "SimWork Demo 3",
  "SimWork Normal Demo 1",
  "SimWork Normal Demo 2",
  "SimWork Normal Demo 3",
  "SimWork Normal Demo 4",
  "SimWork Normal Demo 5",
  "Warranty AI Demo 2",
  "CoreDesk AI CMS Demo 1",
  "CoreDesk AI CMS Demo 2",
  "Job Portal Demo 1",
  "Job Portal Demo 2",
  "Job Portal Demo 3",
  "Sicbo Tool",
  "RunJian SimWork 2.5D"
]) {
  assert.ok(!demoProjectsForNames.includes(oldCodeName), `Demo Projects should replace code-name title: ${oldCodeName}`);
}
for (const professionalName of [
  "OpsPilot Work Simulation",
  "TeamForge Manager Simulator",
  "WorkQuest Career Simulator",
  "SkillSprint Office Challenge",
  "CareerCraft Scenario Lab",
  "WorkPath Simulation Studio",
  "OpsForge Assessment Arena",
  "TalentRise Progress Simulator",
  "WarrantyVault Service Assistant",
  "ContentOps AI Command Desk",
  "AdminFlow CMS Workspace",
  "HirePath Talent Portal",
  "RecruitFlow Hiring Hub",
  "TalentBoard Job Marketplace",
  "DicePattern Analytics Console",
  "RunJian Command World"
]) {
  assert.ok(demoProjectsForNames.includes(professionalName), `Demo Projects should include professional project name: ${professionalName}`);
}
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
assert.ok(html.includes("demo-thumb-game-neon-signal-run.png") && html.includes("Games Demo - Neon Signal Run"), "Redesigned game-demo-09 card should use the Neon Signal Run thumbnail and details title");
assert.ok(!html.includes("Sky Island Tycoon") && !html.includes("demo-thumb-game-sky-tycoon.png"), "Redesigned game-demo-09 card should not keep stale Sky Island Tycoon label or thumbnail");
assert.ok(fs.existsSync("images/demo-thumb-game-neon-signal-run.png") && fs.statSync("images/demo-thumb-game-neon-signal-run.png").size > 10000, "Missing generated Neon Signal Run thumbnail asset");

const themeSelectors = [
  ":root",
  '[data-theme="dark"]',
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

assert.ok(css.includes(".release-badge") && css.includes("min-height: 24px") && css.includes("font-size: 8px") && css.includes("bottom: 13px"), "Release badge should stay compact so it does not block proof controls or poster content");

for (const token of ["--color-bg", "--color-surface", "--color-text", "--color-heading", "--color-accent"]) {
  assert.ok(css.includes(token), `Missing theme token: ${token}`);
}

assert.ok(!html.includes('id="theme-toggle"') && !html.includes("theme-toggle"), "Theme toggle button should be removed while the site is dark-theme only");
assert.ok(!js.includes("setupThemeToggle") && !js.includes("portfolio-theme") && !js.includes("theme-toggle"), "Theme switching behavior should be removed while the site is dark-theme only");
assert.ok(!css.includes(".theme-toggle"), "Theme toggle styling should be removed while the site is dark-theme only");
for (const behavior of ["localStorage", "data-theme", "portfolio-language", "project-detail-chip"]) {
  assert.ok(js.includes(behavior), `Missing theme behavior: ${behavior}`);
}

assert.ok(html.includes("contact-footer-bg") && html.includes("images/founder-banner-contact-email.webp") && fs.existsSync("images/founder-banner-contact-email.webp"), "Contact/footer section should use the simplified printed email contact banner image as its background");
assert.ok(html.includes('css/style.css?v=2.1.11'), "Main stylesheet cache key should be bumped for the image-anchored contact footer overlay");
assert.ok(!html.includes("contact-footer-layers/contact-footer-layer-01-backdrop.webp"), "Contact/footer should not keep the old generated footer backdrop layer");
assert.ok(!html.includes("contact-footer-layers/contact-footer-layer-03-person.webp"), "Contact/footer should not keep the old generated contact person layer");
assert.ok(css.includes(".contact-footer-bg") && css.includes("position: relative") && css.includes(".contact-footer-bg img") && css.includes("height: auto") && css.includes("object-fit: contain") && css.includes("object-position: center top"), "Founder footer background should render at its natural height without cropping banner information");
assert.ok(!css.includes("aspect-ratio: 1280 / 511") && !css.includes("min-height: clamp(720px, 40vw, 880px)"), "Contact footer should no longer be locked to the founder banner aspect ratio");
assert.ok(!html.includes("contact-section-title") && !html.includes("CONTACT ME"), "Contact footer should not show a separate Contact Me title over the banner");
assert.ok(!html.includes("contact-region") && !html.includes("contact-links") && html.includes("contact-offer"), "Location and direct contact should be printed into the banner while the maintenance offer remains live HTML");
assert.ok(html.includes("Direct contact email: HunterHo.My@gmail.com") && !html.includes("Direct contact: Whatsapp +60 016-2199186") && !html.includes("Linkedin Profile"), "Printed contact details should expose only the simplified email contact in the contact aria label");
assert.ok(css.includes(".contact-offer") && css.includes("position: relative") && css.includes("text-align: left") && css.includes("white-space: nowrap"), "Discount offer should remain a compact live HTML panel with a single-line headline");
assert.ok(css.includes("contactPanelIn") && css.includes("contactLightSweep") && css.includes("contactGlowPulse"), "Contact zones should have intro and lighting highlight animations");
assert.ok(css.includes("#contact .col-lg-6") && css.includes("position: static"), "Contact card should not anchor to Bootstrap's 1px column height");
assert.ok(html.includes('class="contact-footer-lower"') && css.includes(".contact-footer-lower") && css.includes("position: absolute") && css.includes(".contact-info-dock") && css.includes("right: clamp(22px, 4vw, 56px)") && css.includes("bottom: clamp(46px, 6vw, 86px)"), "Contact footer should anchor the live maintenance offer to the image bottom-right instead of letting it drift left");
assert.ok(html.includes('class="contact-copyright-dock"') && html.includes("&copy; Copyrights Hunter Ho. All rights reserved."), "Copyright should move into the contact section as an animated dock");
assert.ok(!html.includes('id="footer"'), "Standalone footer section should be removed so the footer background is not a separate empty band");
assert.ok(css.includes(".contact-copyright-dock") && css.includes("left: 50%") && css.includes("bottom: clamp(10px, 1.8vw, 18px)") && css.includes("translate3d(-50%, calc(100% + 24px), 0)") && css.includes(".contact-copyright-dock.is-visible"), "Copyright dock should stay centered on the image background and animate from below");
assert.ok(!css.includes("min-height: 1080px") && !css.includes("min-height: clamp(540px, 78vw, 640px)") && !css.includes("min-height: clamp(500px, 132vw, 560px)"), "Contact footer should no longer reserve fixed-height blank space below the banner");
assert.ok(html.includes("js/main.js?v=2.1.6"), "Main script cache key should be bumped for the stronger demo Hunter random effects");
assert.ok(js.includes("setupContactCopyrightDock") && js.includes("contact-copyright-dock") && js.includes("is-visible"), "Copyright dock should be controlled by scroll/intersection state");
assert.ok(!css.includes(".contact-parallax-bg") && !css.includes(".contact-layer-person"), "Contact/footer CSS should not keep the old layered parallax selectors");
const visibleHtmlText = html.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ");
for (const footerText of [
  "Service Offer",
  "50% Discount",
  "Save up to 50% on server/hosting maintenance."
]) {
  assert.ok(visibleHtmlText.includes(footerText), `Missing footer contact text: ${footerText}`);
}
assert.ok(!visibleHtmlText.includes("Direct Contact Whatsapp") && !visibleHtmlText.includes("KUALU LUMPUR") && !visibleHtmlText.includes("Linkedin: Profile"), "Removed footer contact details should not be duplicated as visible HTML over the printed banner");
assert.ok(!css.includes('url("../images/hero-founder-banner-ai.png") center center / cover no-repeat'), "Footer should not reuse the hero banner as a cover background");

assert.ok(html.includes("wa.me/60162199186"), "Missing WhatsApp helper link");
assert.ok(js.includes("is-over-contact") && css.includes(".husky-helper.is-over-contact"), "Floating contact shortcut should hide when it would overlap the contact footer");
const releaseBadgeTag = html.match(/<a[^>]*class="release-badge"[^>]*href="https:\/\/github\.com\/HunterHo07"[^>]*>[\s\S]*?<\/a>/);
assert.ok(releaseBadgeTag && releaseBadgeTag[0].includes("Hunter v2.1.0"), "Release badge should link to Hunter GitHub profile and use Hunter v2 version label");
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
  pricingIndex === -1 && aboutIndex !== -1 && servicesIndex !== -1 && contactIndex !== -1,
  "About, Services, and Contact anchors should exist while the Pricing commercial-reasons section is removed"
);
assert.ok(
  aboutIndex < servicesIndex && servicesIndex < contactIndex,
  "About and Services should stay merged into one bottom stack before Contact"
);
assert.ok(
  html.indexOf('href="#about"') < html.indexOf('href="#services"') &&
    !html.includes('href="#journal"') &&
    html.indexOf('href="#services"') < html.indexOf('href="#contact"'),
  "Static navbar should follow the merged About, Services, Contact order without Pricing"
);
const aboutSectionEnd = html.indexOf("<!-- end section about services stack -->", aboutIndex);
assert.ok(aboutSectionEnd > aboutIndex, "About/Services stack should keep an explicit end marker for scoped checks");
const aboutServicesStack = html.slice(aboutIndex, aboutSectionEnd);
assert.ok(aboutServicesStack.includes("about-services-stack"), "About and Services should be grouped in one bottom stack");
assert.ok(!aboutServicesStack.includes('id="journal"') && !aboutServicesStack.includes("Clear commercial reasons to start now.") && !aboutServicesStack.includes("My Service Offers"), "Commercial pricing reason cards should be removed from the About/Services bottom stack");
assert.ok(aboutServicesStack.includes("about-hunter-parallax-v2.png"), "About section should use the new generated Hunter cutout");
assert.ok(!aboutServicesStack.includes("images/HunterHo.webp"), "About section should not keep the old framed Hunter portrait");
assert.ok(aboutServicesStack.includes("about-portrait-parallax") && aboutServicesStack.includes("data-parallax-depth"), "About portrait should include parallax hooks");
assert.ok(aboutServicesStack.includes("about-service-command-center"), "Merged About/Services section should use one command-center layout");
assert.ok(aboutServicesStack.includes("service-capability-grid") && !aboutServicesStack.includes("service-offer-grid"), "Merged section should keep capabilities without the removed commercial offer grid");
assert.equal((aboutServicesStack.match(/data-pricing-service="/g) || []).length, 6, "Each Client Build Menu service card should open market pricing details");
assert.ok(aboutServicesStack.includes('id="service-pricing-modal"') && aboutServicesStack.includes("Market Pricing Snapshot") && aboutServicesStack.includes("Why ask Hunter"), "Client Build Menu should include a reusable market pricing modal");
assert.ok(aboutServicesStack.includes("Better offer up to 50%") && aboutServicesStack.includes("Real track record"), "Pricing modal should explain Hunter's better offer and delivery proof");
for (const oldSplitHeading of [
  '<p class="section-kicker">About Hunter</p>',
  '<p class="section-kicker">Services</p>',
  "<h2>What I Build</h2>",
  '<p class="section-kicker">Service Offer</p>',
  'data-text="My Service"'
]) {
  assert.ok(!aboutServicesStack.includes(oldSplitHeading), `Merged service section should not keep old split heading: ${oldSplitHeading}`);
}
assert.ok(css.includes(".about-services-stack") && css.includes(".about-portrait-parallax"), "About/Services stack should include dedicated parallax styling");
assert.ok(css.includes(".about-service-command-center") && css.includes(".service-capability-grid") && css.includes(".service-offer-grid"), "Merged service section should include command-center styling");
assert.ok(css.includes(".about-services-stack .services-block:hover") && css.includes("View market pricing") && css.includes(".service-pricing-modal.is-open") && css.includes("transform: translate3d(0, 0, 0) scale(1)"), "Client Build Menu should have card hover effects and animated pricing modal styles");
assert.ok(css.includes(".is-service-pricing-open .husky-helper"), "Floating helper should hide while Client Build Menu pricing modal is open");
assert.ok(js.includes("setupAboutServicesParallax") && js.includes("--about-parallax-y"), "About/Services stack should include scroll-driven parallax behavior");
assert.ok(js.includes("setupServiceMarketPricingModal") && js.includes("servicePricingData") && js.includes("MY / SEA") && js.includes("Singapore") && js.includes("US / UK / AU") && js.includes("Europe / GCC"), "Client Build Menu should drive market pricing modal data by country/region");
assert.ok(js.includes("data-pricing-service") && js.includes("is-service-pricing-open") && js.includes('event.key === "Escape"'), "Client Build Menu pricing modal should support card click, modal state, and Escape close");
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
assert.ok(startupLabSection.includes("startup-founder-band") && startupLabSection.includes("startup-founder-video-hero"), "Startup Lab should keep the video hero as the top lead element");
assert.ok(!startupLabSection.includes("Founder Vision") && !startupLabSection.includes("Hunter promo video") && !startupLabSection.includes("Founder, builder, teacher, and shipped-system operator."), "Startup Lab should remove the temporary Founder Vision copy block");
assert.ok(!startupLabSection.includes("startup-lab-shell"), "Startup Lab should no longer keep a separate video/copy shell above Founder Vision");
assert.ok(!html.includes('href="#founder-vision"') && !html.includes('data-nav-label="Vision"'), "Removed Founder Vision section should not leave a navbar target behind");
assert.ok(css.includes(".startup-founder-band") && css.includes(".startup-founder-roles"), "Startup Lab should include dedicated bottom Founder Vision styling");
assert.ok(!startupLabSection.includes("startup-founder-proof-preview") && !startupLabSection.includes("founder-poster-08-all-hunters.webp"), "Startup Lab should remove the old founder poster preview from this section");
const founderVideoStart = startupLabSection.indexOf("startup-founder-video-hero");
const founderVideoEnd = startupLabSection.indexOf("startup-lab-copy");
const founderVideoMarkup = startupLabSection.slice(founderVideoStart, founderVideoEnd);
assert.ok(founderVideoMarkup.includes("startup-video-frame") && founderVideoMarkup.includes("startup-sound-note"), "Startup video hero should own the video frame and sound note");
assert.ok(startupLabSection.indexOf("startup-lab-copy") > startupLabSection.indexOf("startup-founder-video-hero"), "Startup Lab description should sit below the full-width video hero row");
assert.ok(startupLabSection.indexOf("startup-icon-row") > startupLabSection.indexOf("startup-lab-copy"), "Startup project icons should sit below the Startup Lab description copy");
assert.ok(startupLabSection.indexOf("startup-founder-roles") > startupLabSection.indexOf("startup-icon-row"), "Founder role tags should sit below the startup project icons");
assert.ok(startupLabSection.indexOf("startup-founder-roles") > startupLabSection.indexOf("TrillionUnicorn Startup Lab"), "Founder role tags should sit below the Startup Lab description copy");
assert.ok(startupLabSection.indexOf("TrillionUnicorn Startup Lab") < startupLabSection.indexOf("startup-tech-stack-flow"), "Startup Lab description should sit above the looping tech stack rows");
assert.ok(css.includes(".startup-founder-roles") && css.includes("grid-column: 1 / -1") && css.includes("grid-template-columns: repeat(6, minmax(0, 1fr))"), "Founder role chips should use a full-width six-column row below the image on desktop");
assert.ok(css.includes(".startup-founder-band") && css.includes("align-items: start") && css.includes("grid-template-columns: minmax(0, 1fr)"), "Startup Lab top layout should collapse to a single full-width video row");
assert.ok(css.includes(".startup-founder-video-hero") && css.includes("justify-self: center") && css.includes("width: min(100%, 1680px)") && css.includes("margin-inline: auto") && css.includes(".startup-founder-video-hero .startup-video-frame") && css.includes("display: block") && css.includes("justify-self: stretch") && css.includes("width: 100%") && css.includes("max-width: 100%") && css.includes("min-height: 0") && css.includes(".startup-founder-video-hero .startup-sound-note") && css.includes("justify-self: stretch") && css.includes("max-width: 100%"), "Startup video should stay centered in the section with equal left and right padding around the video and reminder row");
assert.ok(css.includes(".startup-founder-video-hero") && css.includes("overflow: visible") && css.includes("box-shadow: none") && css.includes(".startup-video-frame") && css.includes("background: transparent") && css.includes(".startup-sound-note") && css.includes("margin: 14px 0 0") && css.includes("padding: 0"), "Startup video should embed without a decorative frame and keep only a simple reminder row below");
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
assert.ok(css.includes("animation: techStackMarqueeLeft 62s linear infinite"), "Startup tech stack default marquee should move slowly enough to read");
assert.ok(css.includes("animation-duration: 70s") && css.includes("animation-duration: 82s"), "Startup tech stack alternate rows should also use slower loop speeds");
assert.ok(css.includes(".tech-orbit-pill:hover") && css.includes("rgba(63, 255, 151, 0.76)") && css.includes("techPillHoverGlow 1.8s"), "Hovered tech pills should stay highlighted with a distinct green glow");
assert.ok(css.includes("opacity: 1") && css.includes("scale(1.2)") && css.includes(".tech-orbit-pill.is-dim:not(:hover):not(:focus-visible)"), "Hovered tech pills should stay fully opaque and scale 20% larger even when dimming is active");
assert.ok(css.includes(".tech-orbit-pill.is-lit-cyan") && css.includes(".tech-orbit-pill.is-lit-amber") && css.includes(".tech-orbit-pill.is-lit-violet"), "Startup tech stack should support three non-hover auto-highlight color tones");
assert.ok(css.includes("transition: opacity 0.5s ease, transform 1.05s ease"), "Tech pill sheen fade should be slow enough to read");
assert.ok(css.includes(".tech-stack-row") && css.includes("min-height: 50px") && css.includes("padding: 7px 0") && css.includes("overflow: visible"), "Tech stack rows should leave vertical room so lit pill borders are not clipped");
assert.ok(css.includes(".tech-orbit-pill::after") && css.includes("inset: 2px") && css.includes(".tech-orbit-pill.is-lit::after") && css.includes(".tech-orbit-pill:hover::after"), "Tech pills should draw an internal highlight ring so the top border line cannot disappear");
assert.ok(js.includes("var startupTechGlowMinDuration = 1400") && js.includes("var startupTechGlowDurationRange = 900") && js.includes("var startupTechNextDelayMin = 760") && js.includes("var startupTechNextDelayRange = 900"), "Startup tech stack lighting should use slower glow and loop timing constants");
assert.ok(js.includes("startupTechLightToneClasses") && js.includes("is-lit-cyan") && js.includes("is-lit-amber") && js.includes("is-lit-violet"), "Startup tech stack lighting should randomly assign one of three non-hover color tone classes");
assert.ok(js.includes("setupStartupTechStackLights") && js.includes("data-tech-stack-row") && js.includes("is-lit") && js.includes("is-dim") && js.includes("Math.random"), "Startup tech stack flow should rotate and randomly light individual pills with JavaScript");

const modelsSectionStart = html.indexOf('id="project-assets-section"');
const modelsSectionEnd = html.indexOf("<!-- start section speaker teaching -->");
const modelsSection = html.slice(modelsSectionStart, modelsSectionEnd);
const demoHunterStart = html.indexOf('data-demo-hunter-start');
const demoHunterRange = html.slice(demoHunterStart, modelsSectionEnd);
assert.ok(demoHunterStart !== -1 && demoHunterStart < modelsSectionStart, "Hunter matrix background should start at the Demo Projects heading, before the 3D Models section");
assert.ok(demoHunterRange.includes("models-hunter-bg-stage") && demoHunterRange.includes("data-demo-hunter-bg"), "Demo Projects through 3D Models should share one Hunter matrix background stage");
assert.ok(demoHunterRange.includes("images/hunter-demo-bg-neon-matrix.png"), "Demo background should use the Image Gen neon matrix Hunter asset");
assert.ok(js.includes("demoHunterStart") && js.includes("demoHunterEnd") && js.includes("--models-hunter-range-height"), "Hunter matrix background should measure from Demo Projects start to the 3D Models end");
assert.ok(modelsSection.includes("Q-Style 3D Models Lab") && modelsSection.includes("demo-thumb-qstyle-3d-models-lab.png"), "3D Models section should keep the real Q-Style GLB catalog proof card");
assert.ok(
  modelsSection.includes('data-alt-thumb="images/demo-thumb-qstyle-3d-models-lab-cards.png"') &&
    modelsSection.includes('data-extra-thumbs="images/demo-thumb-qstyle-3d-models-lab-detail.png,images/demo-thumb-qstyle-3d-models-lab-mobile.png"'),
  "Q-Style Assets 3 card should rotate through real per-card GLB preview thumbnails"
);
assert.ok(demoHunterRange.includes("models-hunter-bg-stage") && demoHunterRange.includes("models-matrix-canvas"), "Demo range should include a visible Hunter background stage and matrix canvas");
assert.ok(modelsSection.includes("models-hunter-bg-effect-list"), "3D Models section should list the random visual effects being used");
assert.ok(css.includes(".models-hunter-bg-stage") && css.includes("position: fixed") && css.includes("--models-hunter-depth: -999") && css.includes("z-index: 0") && css.includes("filter: blur(var(--models-hunter-blur") && css.includes(".models-hunter-bg-stage.is-demo-range-active"), "Demo Hunter background should stay fixed and visibly behind content while preserving the requested -999 depth value");
assert.ok(css.includes(".models-hunter-bg-ghost.is-active") && css.includes("@keyframes modelsHunterPulse") && css.includes("@keyframes modelsMatrixDrift"), "3D Models Hunter background should include visible active/pulse/matrix animations");
assert.ok(css.includes(".models-hunter-bg-stage::before") && css.includes(".models-hunter-bg-stage::after") && css.includes("stage-effect-neon-rim") && css.includes("stage-effect-glitch-echo"), "Demo Hunter background should randomize visible stage-level neon, scan, and glitch effects");
assert.ok(js.includes("setupModelsHunterBackground()"), "3D Models Hunter background should be initialized");
assert.ok(js.includes("modelsHunterEffects") && js.includes("neon-rim") && js.includes("matrix-rain") && js.includes("hologram-scan") && js.includes("glitch-echo"), "3D Models Hunter background should expose a named random effect list");
assert.ok(js.includes("modelsHunterRoutes") && js.includes("left-to-right") && js.includes("top-to-bottom") && js.includes("bottom-left-to-top-right") && js.includes("mid-left-to-mid-right"), "3D Models Hunter background should support random edge-to-edge routes that cross the viewport");
assert.ok(js.includes("stage.classList.add(\"stage-effect-\" + effect)") && js.includes("--models-hunter-light-x") && js.includes("randomBetween(7600, 11800)"), "Demo Hunter passes should randomize stage class, light position, and faster route duration");

for (const token of [
  "hero-actions",
  "magnetic-cta",
  "proof-motion-wall",
  "real-teaching-grid",
  "teaching-non-it-vs-real-it.jpeg",
  "teaching-vibe-coding-101.svg",
  "teaching-intro-n8n-basics-2026.svg",
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
  "v2.1.0",
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
  "hackathon-glass-carousel",
  "hackathon-carousel-stage",
  "hackathon-carousel-track",
  "hackathon-carousel-card",
  "setupHackathonGlassCarousel",
  "Neon Grid Racer",
  "Orbit Defense",
  "Husky Rescue Run",
  "Dragon Forge Arena",
  "Quantum Card Lab",
  "Neon Signal Run",
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
  "popup-img",
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
assert.ok(!css.includes("body.is-hero-top .language-toggle"), "Language toggle should stay visible at the hero top");
const languageToggleBlock = (css.match(/\.language-toggle\s*{([\s\S]*?)}/) || [])[1] || "";
assert.ok(/position:\s*fixed/.test(languageToggleBlock) && /top:\s*12px/.test(languageToggleBlock) && /right:\s*24px/.test(languageToggleBlock), "Language toggle should stay fixed at the top-right corner and align with the desktop navbar middle");
const scrolledNavBlock = (css.match(/body:not\(\.is-hero-top\) nav\s*{([\s\S]*?)}/) || [])[1] || "";
assert.ok(/opacity:\s*1/.test(scrolledNavBlock) && /pointer-events:\s*auto/.test(scrolledNavBlock) && /background:\s*rgba\(9,\s*21,\s*36,\s*0\.9\)/.test(scrolledNavBlock), "Navbar should become visible and clickable after scrolling with a 90% opacity background");
const navSectionLabels = html.match(/data-nav-label="/g) || [];
const navMenuBlock = (html.match(/<ul class="nav-menu list-unstyled">([\s\S]*?)<\/ul>/) || [])[1] || "";
const staticNavLinks = navMenuBlock.match(/<a\b[^>]*href="#[^"]+"[^>]*class="smoothScroll"/g) || [];
assert.equal(navSectionLabels.length, 10, `Expected 10 marked navbar sections after removing Pricing, found ${navSectionLabels.length}`);
assert.equal(staticNavLinks.length, navSectionLabels.length, "Static navbar fallback should match marked section count");
const markedSectionIds = [...html.matchAll(/<(section|div)\b[^>]*\bid="([^"]+)"[^>]*\bdata-nav-label="([^"]+)"/g)].map((match) => match[2]);
const staticNavIds = [...navMenuBlock.matchAll(/href="#([^"]+)"/g)].map((match) => match[1]);
assert.deepEqual(staticNavIds, markedSectionIds, "Static navbar fallback should exactly match marked section anchors in page order");
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
assert.ok(founderJourneyCss.includes('data-founder-state="0"') && founderJourneyCss.includes("visibility: hidden"), "Founder empty poster state should hide the intro HUD so it cannot block the Hunter title");
assert.ok(founderJourneyCss.includes("@keyframes founderHudTopIn") && founderJourneyCss.includes("@keyframes founderHudSideIn") && founderJourneyCss.includes("@keyframes founderHudBottomIn"), "Founder dashboard HUD should animate in from the top, side, and bottom");
assert.ok(founderJourneyCss.includes(".founder-hud-panel-top.is-copy-swapping") && founderJourneyCss.includes("@keyframes founderCopySwap"), "Founder title HUD should animate copy intro/outro when proof state changes");
assert.ok(founderJourneyCss.includes("founder-hud-panel-top") && founderJourneyCss.includes("founder-hud-panel-bottom"), "Founder proof copy should stay in meaningful top and bottom dashboard panels");
assert.ok(founderJourneyCss.includes("founder-poster-layer-all.is-visible"), "Founder poster should still reveal the final all-Hunters layer");
assert.ok(founderJourneyCss.includes(".founder-journey.is-final-poster .founder-poster-layer-all") && founderJourneyCss.includes("height: min(90vh, 980px)") && founderJourneyCss.includes("translate3d(-50%, -50%, 0)"), "Founder final state should zoom out to show the complete poster on screen");
assert.ok(founderJourneyCss.includes(".founder-final-callouts") && founderJourneyCss.includes("is-final-poster .founder-final-callouts"), "Founder final state should show digital callouts instead of covering the middle poster");
assert.ok(founderJourneyCss.includes(".founder-journey-steps span") && founderJourneyCss.includes("display: none"), "Founder bottom proof buttons should stay compact and avoid blocking the poster");
assert.ok(founderJourneyCss.includes(".founder-theater-controls") && founderJourneyCss.includes(".founder-step-btn"), "Founder theater should expose clickable bottom navigation controls");
assert.ok(css.includes(".founder-final-callout") && css.includes("proofCalloutGlow"), "Founder final callouts should use animated digital highlights");
assert.equal((html.match(/data-final-proof="/g) || []).length, 6, "Founder final callouts should be interactive targets for the six proof moments");
assert.equal((html.match(/class="[^"]*founder-proof-connector/g) || []).length, 6, "Founder final poster should include six connector highlight lines to the correct image zones");
assert.ok(html.includes("founder-proof-color-spotlight") && html.includes('aria-hidden="true"'), "Founder final poster should include a masked color spotlight layer for focused proof regions");
assert.ok(html.includes("founder-proof-detail-drawer") && html.includes("data-final-proof-detail-title") && html.includes("data-final-proof-detail-body"), "Founder final poster should include a bottom detail drawer for hover/click proof details");
assert.ok(founderJourneyCss.includes("is-final-callout-entering") && founderJourneyCss.includes("has-final-callout-settled") && founderJourneyCss.includes("is-final-callout-leaving"), "Founder final callouts should use explicit enter, settled, and leave classes instead of replaying slide animation on every final-state update");
assert.ok(founderJourneyCss.includes("--connector-x") && founderJourneyCss.includes("--connector-y") && founderJourneyCss.includes("--connector-angle"), "Founder final connector lines should be positioned from live JS geometry instead of fixed static percentages");
assert.ok(founderJourneyCss.includes("founderConnectorTravel") && founderJourneyCss.includes("linear-gradient(90deg, transparent 0%, color-mix"), "Founder connector lines should use a one-way digital light sweep");
assert.ok(founderJourneyCss.includes(".founder-proof-color-spotlight") && founderJourneyCss.includes("--proof-spotlight-clip") && founderJourneyCss.includes("clip-path: var(--proof-spotlight-clip)"), "Focused final proof should preserve the selected poster area in color using a CSS mask");
assert.ok(founderJourneyCss.includes("--proof-scan-angle") && founderJourneyCss.includes("--proof-scan-duration") && founderJourneyCss.includes("--connector-travel-duration"), "Founder final callouts should expose per-proof scan and connector timing variables");
assert.ok(founderJourneyCss.includes(".founder-journey.has-final-proof-focus .founder-poster-layer-all") && founderJourneyCss.includes("filter: grayscale"), "Hovering/clicking a final proof should gray out other poster content");
assert.ok(founderJourneyCss.includes(".founder-final-callout.is-focused") && founderJourneyCss.includes(".founder-proof-connector.is-focused"), "Focused final proof should highlight its card and connector line");
assert.ok(founderJourneyCss.includes("translate3d(-170%, 0, 0)") && founderJourneyCss.includes("translate3d(340%, 0, 0)") && founderJourneyCss.includes("animation-play-state: paused"), "Founder final callout scan should travel fully off-card and pause on inactive focused-state cards to avoid stuck highlight blocks");
assert.ok(founderJourneyCss.includes("--proof-scan-duration: 1.95s") && founderJourneyCss.includes("--proof-scan-duration: 3.05s"), "Founder final callout text-box scan effects should run at the faster 2x speed");
assert.ok(founderJourneyCss.includes('data-final-proof-focus="win"') && founderJourneyCss.includes('data-final-proof-focus="teach"') && founderJourneyCss.includes("top: clamp(108px, 12vh, 150px)") && founderJourneyCss.includes("bottom: auto"), "Proof 05 and 06 detail drawers should move upward so they do not cover the lower poster panels");
assert.ok(js.includes("setupFounderFinalProofFocus") && js.includes("data-final-proof") && js.includes("setFinalProofFocus") && js.includes("founder-proof-detail-drawer"), "Founder theater should support hover/click focus details for final proof callouts");
assert.ok(js.includes("positionFounderFinalConnectors") && js.includes("founderFinalProofPoints") && js.includes("--connector-angle"), "Founder theater should calculate connector endpoints from live card positions and poster target points");
assert.ok(js.includes("scheduleFounderFinalConnectorPosition") && js.includes("window.setTimeout(positionFounderFinalConnectors, 140)") && js.includes("window.setTimeout(positionFounderFinalConnectors, 820)"), "Founder connector positioning should reschedule after final-state scroll and callout intro animation settle");
assert.ok(js.includes("setFounderFinalCalloutPresence") && js.includes("finalCalloutsVisible") && js.includes("setFounderProofSpotlight") && js.includes("--proof-spotlight-clip"), "Founder theater should run final callout entry once per final-state transition and update the focused color spotlight");
assert.ok(js.includes('sport: { x: 0.26, y: 0.205') && js.includes('ai: { x: 0.24, y: 0.54') && js.includes('world: { x: 0.81, y: 0.535') && js.includes('win: { x: 0.25, y: 0.8') && js.includes('teach: { x: 0.73, y: 0.77'), "Sport, Ahfaiz, WorldCup, Hackathon, and Teaching proof spotlight masks should stay aligned to the adjusted annotated target positions");
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
assert.ok(mobileSection.includes("Live Demo") && mobileSection.includes("Android Project") && mobileSection.includes("React Native") && mobileSection.includes("Expo"), "Mobile cards should link demo-first and describe real native app source");
assert.ok(!mobileSection.includes("github.com"), "Mobile section should not send users to GitHub source links");
for (const demoUrl of [
  "https://mobile-warrantyscan-demo.vercel.app",
  "https://mobile-namecard-demo.vercel.app"
]) {
  assert.ok(mobileSection.includes(demoUrl), `Mobile card should use the hosted demo URL: ${demoUrl}`);
}
assert.ok(!mobileSection.includes("PWA") && !mobileSection.includes("responsive app shells") && !mobileSection.includes("App Source"), "Mobile section should not describe the apps as PWA/web demos or source-first cards");
assert.ok(!mobileSection.includes("github.io/mobile-warrantyscan-demo") && !mobileSection.includes("github.io/mobile-namecard-demo"), "Mobile cards should not link to the old web demo pages");
for (const nativeAppPath of [
  "mobile-warrantyscan-demo/native-app/package.json",
  "mobile-warrantyscan-demo/native-app/App.tsx",
  "mobile-warrantyscan-demo/native-app/app.json",
  "mobile-warrantyscan-demo/native-app/eas.json",
  "mobile-namecard-demo/native-app/package.json",
  "mobile-namecard-demo/native-app/App.tsx",
  "mobile-namecard-demo/native-app/app.json",
  "mobile-namecard-demo/native-app/eas.json"
]) {
  assert.ok(fs.existsSync(path.join(siblingRoot, nativeAppPath)), `Missing native mobile app source file: ${nativeAppPath}`);
}
const warrantyAppJson = JSON.parse(fs.readFileSync(path.join(siblingRoot, "mobile-warrantyscan-demo/native-app/app.json"), "utf8"));
const namecardAppJson = JSON.parse(fs.readFileSync(path.join(siblingRoot, "mobile-namecard-demo/native-app/app.json"), "utf8"));
const warrantyEasJson = JSON.parse(fs.readFileSync(path.join(siblingRoot, "mobile-warrantyscan-demo/native-app/eas.json"), "utf8"));
const namecardEasJson = JSON.parse(fs.readFileSync(path.join(siblingRoot, "mobile-namecard-demo/native-app/eas.json"), "utf8"));
assert.equal(warrantyAppJson.expo.android.package, "com.hunterho.warrantyscan", "WarrantyScan should expose Android package metadata");
assert.ok(warrantyAppJson.expo.android.permissions.includes("CAMERA"), "WarrantyScan should declare camera permission");
assert.equal(namecardAppJson.expo.android.package, "com.hunterho.namecardmobile", "NameCard should expose Android package metadata");
assert.ok(namecardAppJson.expo.android.permissions.includes("READ_CONTACTS") && namecardAppJson.expo.android.permissions.includes("WRITE_CONTACTS"), "NameCard should declare contact permissions");
assert.equal(warrantyEasJson.build.preview.android.buildType, "apk", "WarrantyScan should keep an installable preview APK profile");
assert.equal(namecardEasJson.build.preview.android.buildType, "apk", "NameCard should keep an installable preview APK profile");
assert.ok(speakerIndex !== -1 && hackathonWinsIndex !== -1 && projectAssetsIndex !== -1, "Teaching, Wins, and 3D Models sections should exist");
assert.equal(hunterIndex, -1, "Old standalone Development section should stay removed after the merged service stack");
assert.ok(!html.includes("More Example Development") && !html.includes('href="#hunter"'), "Outdated More Example Development heading and nav target should be removed");
assert.ok(!html.includes("hunter-flters") && !html.includes("hunter-container"), "Removed Development gallery should not leave filter/container markup");
assert.ok(!css.includes("#hunter") && !css.includes("hunter-thumbnail"), "Removed Development gallery should not leave Hunter-specific CSS selectors");
assert.ok(!js.includes("setupLazyHunterIsotope") && !js.includes("hunter-flters") && !js.includes("hunter-thumbnail"), "Removed Development gallery should not leave lazy Isotope JavaScript");
assert.ok(projectAssetsIndex < speakerIndex && speakerIndex < hackathonWinsIndex, "Speaker & Teaching should be followed by compact Hackathon Wins");
assert.ok(speakerEnd > speakerIndex, "Teaching section should keep an explicit end marker for scoped checks");
assert.ok(hackathonWinsEnd > hackathonWinsIndex, "Hackathon Wins section should keep an explicit end marker for scoped checks");
const speakerSection = html.slice(speakerIndex, speakerEnd);
const hackathonWinsSection = html.slice(hackathonWinsIndex, hackathonWinsEnd);
assert.ok(speakerSection.includes("teaching-section-heading") && speakerSection.includes("IT Teaching & Community Sharing"), "Teaching section should have a compact community-sharing title above the cards");
assert.ok(speakerSection.includes("boot camp teaching") && speakerSection.includes("back to the community"), "Teaching section intro should frame invited sessions as giving practical IT back to the community");
assert.equal((speakerSection.match(/class="teaching-proof-card"/g) || []).length, 5, "Speaker & Teaching should keep five teaching cards after replacing the duplicate N8N poster with the new Krenovator additions");
assert.equal((speakerSection.match(/class="teaching-card-media"/g) || []).length, 5, "Teaching cards should wrap all five teaching posters in a stable media frame");
assert.ok(hackathonWinsSection.includes("hackathon-glass-carousel") && hackathonWinsSection.includes("Hunter Timeline + Happening"), "The wins section should evolve into a broader Hunter timeline and happening gallery");
assert.ok(!html.includes("hackathon-proof-wall"), "Standalone Champion Stage proof wall should be removed");
assert.ok((hackathonWinsSection.match(/class="hackathon-carousel-card/g) || []).length >= 2, "Timeline gallery should support multiple real event cards and stay open-ended for future additions");
assert.ok((hackathonWinsSection.match(/class="hackathon-carousel-image"/g) || []).length >= 2, "Every timeline card should use a real image element");
assert.ok(!hackathonWinsSection.includes("hackathon-card-placeholder"), "Hackathon carousel should not keep placeholder cards after real event images are available");
assert.ok(hackathonWinsSection.includes("Outside Full-Time Work") && hackathonWinsSection.includes("Web3 events") && hackathonWinsSection.includes("team highlights"), "Timeline gallery intro should frame the section as activity outside full-time work");
assert.ok(hackathonWinsSection.includes("Hackathons") && hackathonWinsSection.includes("Startup") && hackathonWinsSection.includes("Team Highlights"), "Timeline gallery should expose quick category cues instead of only win-focused framing");
for (const hackathonAsset of [
  "images/hackathon/deriv-ai-hackathon-stage-2025.jpg",
  "images/hackathon/deriv-ai-hackathon-countdown.jpg"
]) {
  assert.ok(hackathonWinsSection.includes(hackathonAsset), `Hackathon carousel should include real event asset: ${hackathonAsset}`);
}
for (const unrelatedHackathonAsset of [
  "images/hackathon/deriv-ai-hackathon-live-session.jpg",
  "images/hackathon/deriv-ai-hackathon-application.jpg",
  "images/hackathon/deriv-ai-hackathon-semifinalists.jpg",
  "images/hackathon/deriv-ai-hackathon-team-table.jpg"
]) {
  assert.ok(!hackathonWinsSection.includes(unrelatedHackathonAsset), `Hackathon carousel should not use unrelated local asset: ${unrelatedHackathonAsset}`);
}
assert.ok(hackathonWinsSection.includes("Cyberjaya") && hackathonWinsSection.includes("RM15,000") && hackathonWinsSection.includes("AI Champion"), "Hackathon carousel should surface event metadata and achievement outcomes");
assert.ok(hackathonWinsSection.includes("data-carousel-prev") && hackathonWinsSection.includes("data-carousel-next"), "Hackathon carousel should expose previous and next controls");
assert.ok(hackathonWinsSection.includes("data-carousel-track"), "Timeline gallery should identify the moving media track in markup");
assert.ok(html.indexOf('href="#speaker-teaching"') < html.indexOf('href="#hackathon-wins"'), "Navbar order should place Teaching before Wins after moving the wins block");
for (const realTeachingAsset of [
  "images/teaching/teaching-non-it-vs-real-it.jpeg",
  "images/teaching/teaching-vibe-coding-101.svg",
  "images/teaching/teaching-intro-n8n-basics-2026.svg",
  "images/teaching/teaching-tech-readiness.jpeg",
  "images/teaching/teaching-productivity.jpeg"
]) {
  assert.ok(speakerSection.includes(realTeachingAsset), `Teaching section should use real class/invitation image: ${realTeachingAsset}`);
}
assert.ok(!speakerSection.includes("images/teaching/teaching-n8n-event.jpeg"), "Teaching section should drop the older duplicate N8N invitation image once the new 2026 Krenovator poster is added");
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
assert.ok(css.includes(".hackathon-carousel-stage") && css.includes("perspective:") && css.includes("transform-style: preserve-3d"), "Hackathon carousel should use a real 3D stage");
assert.ok(css.includes(".hackathon-carousel-card") && css.includes("backdrop-filter: blur") && css.includes("rotateY("), "Timeline cards should keep liquid-glass styling and 3D tilt");
assert.ok(js.includes("setupHackathonGlassCarousel") && js.includes("data-hackathon-carousel") && js.includes("data-carousel-next"), "Hackathon carousel should be controlled by JavaScript");
assert.ok(js.includes("requestAnimationFrame") && js.includes("trackOffset") && js.includes("trackVelocity") && js.includes("pointerdown") && js.includes("dragThreshold"), "Timeline gallery should use continuous motion, drag support, and scalable track state for near-endless scrolling");

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
