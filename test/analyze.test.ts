import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

import { analyze } from "../src/analyze.js";
import { toMarkdown, toSummary } from "../src/format.js";
import type { SpecimenCustodyExport } from "../src/types.js";

const here = fileURLToPath(new URL(".", import.meta.url));
const fixture = (name: string): SpecimenCustodyExport =>
  JSON.parse(readFileSync(`${here}/../fixtures/${name}`, "utf8")) as SpecimenCustodyExport;

const NOW = "2026-05-30T08:00:00Z";

describe("analyze", () => {
  it("counts snapshots and gap families", () => {
    const report = analyze(fixture("specimen-chain-of-custody.json"), { now: NOW });
    expect(report.specimens).toBe(2);
    expect(report.currentSnapshots).toBe(1);
    expect(report.gaps).toBe(6);
    expect(report.blockingGaps).toBe(4);
    expect(report.temperatureGaps).toBe(1);
    expect(report.handoffGaps).toBe(3);
  });

  it("flags labeling, temperature, and custody drift", () => {
    const report = analyze(fixture("specimen-chain-of-custody.json"), { now: NOW });
    expect(report.findingsList.find((item) => item.code === "labeling-integrity-gap")).toBeDefined();
    expect(report.findingsList.find((item) => item.code === "temperature-excursion")).toBeDefined();
    expect(report.findingsList.find((item) => item.code === "custody-signoff-missing")).toBeDefined();
  });

  it("flags storage and consent gaps", () => {
    const report = analyze(fixture("specimen-chain-of-custody.json"), { now: NOW });
    expect(report.findingsList.find((item) => item.code === "storage-release-mismatch")).toBeDefined();
    expect(report.findingsList.find((item) => item.code === "consent-packet-stale")).toBeDefined();
  });

  it("returns ok=true on a clean fixture", () => {
    const report = analyze(fixture("specimen-chain-of-custody-clean.json"), { now: NOW });
    expect(report.ok).toBe(true);
    expect(report.findingsList.filter((item) => item.severity === "high")).toEqual([]);
  });
});

describe("formatters", () => {
  it("renders findings in markdown", () => {
    const markdown = toMarkdown(analyze(fixture("specimen-chain-of-custody.json"), { now: NOW }));
    expect(markdown).toContain("Specimen custody posture needs work");
    expect(markdown).toContain("labeling-integrity-gap");
  });

  it("renders clean markdown and summary", () => {
    const report = analyze(fixture("specimen-chain-of-custody-clean.json"), { now: NOW });
    expect(toMarkdown(report)).toContain("Specimen custody posture OK");
    expect(toMarkdown(report)).toContain("No findings.");
    expect(toSummary(report)).toMatch(/^2 specimen groups/);
  });
});
