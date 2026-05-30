// SPDX-License-Identifier: AGPL-3.0-or-later

import express from "express";
import { fileURLToPath } from "node:url";

import {
  custodyLane,
  payload,
  releasePosture,
  summary,
  transferGaps,
  verification
} from "./services/specimenChainOfCustodyConsoleService.js";
import {
  renderCustodyLane,
  renderDocs,
  renderOverview,
  renderReleasePosture,
  renderTransferGaps,
  renderVerification
} from "./services/render.js";

const app = express();
const port = Number(process.env.PORT ?? 5522);
const host = process.env.HOST || "0.0.0.0";

app.get("/", (_req, res) => res.type("html").send(renderOverview()));
app.get("/custody-lane", (_req, res) => res.type("html").send(renderCustodyLane()));
app.get("/transfer-gaps", (_req, res) => res.type("html").send(renderTransferGaps()));
app.get("/release-posture", (_req, res) => res.type("html").send(renderReleasePosture()));
app.get("/verification", (_req, res) => res.type("html").send(renderVerification()));
app.get("/docs", (_req, res) => res.type("html").send(renderDocs()));

app.get("/api/dashboard/summary", (_req, res) => res.json(summary()));
app.get("/api/custody-lane", (_req, res) => res.json(custodyLane()));
app.get("/api/transfer-gaps", (_req, res) => res.json(transferGaps()));
app.get("/api/release-posture", (_req, res) => res.json(releasePosture()));
app.get("/api/verification", (_req, res) => res.json(verification()));
app.get("/api/sample", (_req, res) => res.json(payload()));

const currentFile = fileURLToPath(import.meta.url);
const invokedDirectly = process.argv[1] !== undefined && currentFile === process.argv[1];

if (invokedDirectly) {
  app.listen(port, host, () => {
    console.log(`Specimen Chain Of Custody Console listening on http://${host}:${port}`);
  });
}

export default app;
