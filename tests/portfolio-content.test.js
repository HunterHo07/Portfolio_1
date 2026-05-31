const fs = require("node:fs");
const assert = require("node:assert/strict");

const html = fs.readFileSync("index.html", "utf8");
const css = fs.readFileSync("css/style.css", "utf8");
const js = fs.readFileSync("js/main.js", "utf8");

const requiredText = [
  "C#",
  "ASP.NET Core 10",
  "Nice & Features",
  "ReportU",
  "NameCardAi",
  "BestzDealAi",
  "MessageYou",
  "WarrantyAi",
  "RJ-1",
  "RJ-2",
  "3D Assets Demo",
  "data-project-title",
  "project-detail-modal",
  "theme-toggle",
  "data-theme",
  "Founder Vision",
  "founder-vision",
  "Build products. Automate futures. Ship real impact.",
  "Ahfaiz Founder",
  "AI Automation Teacher",
  "CTO / Startup Builder",
  "Hackathon Winner",
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
  "https://rj-1-hunter5.vercel.app",
  "https://rj-2.vercel.app",
  "https://rj-assets-hunter5.vercel.app/",
  "https://rj-assets-2-hunter5.vercel.app/",
];

const requiredAssets = [
  "images/founder-portrait.jpeg",
  "images/founder-banner.jpeg",
  "images/founder-vision-poster.jpeg",
];

for (const text of requiredText) {
  assert.ok(html.includes(text), `Missing required text: ${text}`);
}

for (const url of requiredUrls) {
  assert.ok(html.includes(url), `Missing required URL: ${url}`);
}

for (const asset of requiredAssets) {
  assert.ok(html.includes(asset), `Missing required asset reference: ${asset}`);
  assert.ok(fs.existsSync(asset), `Missing required asset file: ${asset}`);
}

const detailButtons = html.match(/class="[^"]*project-detail-btn[^"]*"/g) || [];
assert.ok(detailButtons.length >= 25, `Expected at least 25 Details buttons, found ${detailButtons.length}`);

const projectCards = html.match(/class="[^"]*portfolio-project[^"]*"/g) || [];
assert.ok(projectCards.length >= 25, `Expected at least 25 portfolio project cards, found ${projectCards.length}`);

const themeSelectors = [
  ":root",
  '[data-theme="dark"]',
  ".theme-toggle",
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

for (const behavior of ["localStorage", "matchMedia", "data-theme", "theme-toggle"]) {
  assert.ok(js.includes(behavior), `Missing theme behavior: ${behavior}`);
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
