#!/usr/bin/env node

import { readFileSync } from "node:fs";

import { analyze } from "./analyze.js";
import { toMarkdown, toSummary } from "./format.js";
import type { PostureOptions, SpecimenCustodyExport } from "./types.js";

function usage(): never {
  console.error(HELP);
  process.exit(1);
}

const args = process.argv.slice(2);
const input = args[0];
if (!input || input.startsWith("-")) usage();

let format: "json" | "markdown" | "summary" = "summary";
const options: PostureOptions = {};

for (let i = 1; i < args.length; i += 1) {
  const arg = args[i];
  if (arg === "--format") {
    const value = args[i + 1];
    if (value !== "json" && value !== "markdown" && value !== "summary") usage();
    format = value;
    i += 1;
    continue;
  }
  if (arg === "--now") {
    options.now = args[i + 1];
    i += 1;
    continue;
  }
  if (arg === "--stale-gap-after-hours") {
    options.staleGapAfterHours = Number(args[i + 1]);
    i += 1;
    continue;
  }
  usage();
}

const HELP = `specimen-chain-of-custody-console - analyze specimen custody exports

Usage:
  specimen-chain-of-custody-console <export.json> [--format json|markdown|summary]
  specimen-chain-of-custody-console <export.json> [--now ISO-8601]
  specimen-chain-of-custody-console <export.json> [--stale-gap-after-hours number]
`;

const payload = JSON.parse(readFileSync(input, "utf8")) as SpecimenCustodyExport;
const report = analyze(payload, options);

if (format === "json") {
  process.stdout.write(`${JSON.stringify(report, null, 2)}\n`);
} else if (format === "markdown") {
  process.stdout.write(`${toMarkdown(report)}\n`);
} else {
  process.stdout.write(`${toSummary(report)}\n`);
}
