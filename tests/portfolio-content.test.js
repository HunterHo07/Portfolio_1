const fs = require("node:fs");
const assert = require("node:assert/strict");

const html = fs.readFileSync("index.html", "utf8");

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

for (const text of requiredText) {
  assert.ok(html.includes(text), `Missing required text: ${text}`);
}

for (const url of requiredUrls) {
  assert.ok(html.includes(url), `Missing required URL: ${url}`);
}

const detailButtons = html.match(/class="[^"]*project-detail-btn[^"]*"/g) || [];
assert.ok(detailButtons.length >= 25, `Expected at least 25 Details buttons, found ${detailButtons.length}`);

const projectCards = html.match(/class="[^"]*portfolio-project[^"]*"/g) || [];
assert.ok(projectCards.length >= 25, `Expected at least 25 portfolio project cards, found ${projectCards.length}`);

console.log("Portfolio content checks passed.");
