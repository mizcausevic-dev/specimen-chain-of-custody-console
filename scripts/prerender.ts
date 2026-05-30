import { mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import {
  custodyLane,
  payload,
  releasePosture,
  summary,
  transferGaps,
  verification
} from "../src/services/specimenChainOfCustodyConsoleService.js";
import {
  renderCustodyLane,
  renderDocs,
  renderOverview,
  renderReleasePosture,
  renderTransferGaps,
  renderVerification
} from "../src/services/render.js";

const root = fileURLToPath(new URL("..", import.meta.url));
const site = path.join(root, "site");

const files: Record<string, string> = {
  "index.html": renderOverview(),
  [path.join("custody-lane", "index.html")]: renderCustodyLane(),
  [path.join("transfer-gaps", "index.html")]: renderTransferGaps(),
  [path.join("release-posture", "index.html")]: renderReleasePosture(),
  [path.join("verification", "index.html")]: renderVerification(),
  [path.join("docs", "index.html")]: renderDocs(),
  "robots.txt": "User-agent: *\nAllow: /\nSitemap: https://specimen.kineticgain.com/sitemap.xml\n",
  "sitemap.xml": `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url><loc>https://specimen.kineticgain.com/</loc></url>
  <url><loc>https://specimen.kineticgain.com/custody-lane/</loc></url>
  <url><loc>https://specimen.kineticgain.com/transfer-gaps/</loc></url>
  <url><loc>https://specimen.kineticgain.com/release-posture/</loc></url>
  <url><loc>https://specimen.kineticgain.com/verification/</loc></url>
  <url><loc>https://specimen.kineticgain.com/docs/</loc></url>
</urlset>`,
  [path.join("api", "dashboard", "summary.json")]: JSON.stringify(summary(), null, 2),
  [path.join("api", "custody-lane.json")]: JSON.stringify(custodyLane(), null, 2),
  [path.join("api", "transfer-gaps.json")]: JSON.stringify(transferGaps(), null, 2),
  [path.join("api", "release-posture.json")]: JSON.stringify(releasePosture(), null, 2),
  [path.join("api", "verification.json")]: JSON.stringify(verification(), null, 2),
  [path.join("api", "sample.json")]: JSON.stringify(payload(), null, 2)
};

for (const [relativePath, contents] of Object.entries(files)) {
  const fullPath = path.join(site, relativePath);
  mkdirSync(path.dirname(fullPath), { recursive: true });
  writeFileSync(fullPath, contents);
}
