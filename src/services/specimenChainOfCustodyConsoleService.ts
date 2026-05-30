// SPDX-License-Identifier: AGPL-3.0-or-later

import { analyze } from "../analyze.js";
import { custodyLanePackets, releasePosturePackets, sampleSpecimenChainOfCustodyPayload } from "../data/sampleSpecimenChainOfCustody.js";
import type { Finding } from "../types.js";

const NOW = "2026-05-30T00:00:00Z";
const report = analyze(sampleSpecimenChainOfCustodyPayload, {
  now: NOW,
  staleGapAfterHours: 24
});

function severityRank(finding: Finding): number {
  return finding.severity === "high" ? 0 : finding.severity === "medium" ? 1 : finding.severity === "low" ? 2 : 3;
}

export function summary() {
  return {
    specimens: report.specimens,
    currentSnapshots: report.currentSnapshots,
    gaps: report.gaps,
    blockingGaps: report.blockingGaps,
    temperatureGaps: report.temperatureGaps,
    handoffGaps: report.handoffGaps,
    highFindings: report.findingsList.filter((finding) => finding.severity === "high").length,
    recommendation:
      "Repair custody signoff, barcode integrity, cold-chain evidence, and storage-release alignment before calling specimen posture release-safe."
  };
}

export function custodyLane() {
  return custodyLanePackets.map((lane) => ({
    ...lane,
    relatedFindings: report.findingsList.filter((finding) => {
      if (lane.id === "accession-lane") return finding.code === "labeling-integrity-gap";
      if (lane.id === "handoff-lane") return finding.code === "temperature-excursion" || finding.code === "custody-signoff-missing" || finding.code === "transport-seal-gap";
      if (lane.id === "storage-lane") return finding.code === "storage-release-mismatch";
      if (lane.id === "consent-lane") return finding.code === "consent-packet-stale";
      return false;
    }).length
  }));
}

export function transferGaps() {
  return [...report.findingsList]
    .sort((left, right) => severityRank(left) - severityRank(right))
    .map((finding) => ({
      ...finding,
      owner:
        finding.code === "labeling-integrity-gap"
          ? "Clinical Lab Operations"
          : finding.code === "temperature-excursion" || finding.code === "custody-signoff-missing" || finding.code === "transport-seal-gap"
            ? "Pathology Logistics"
            : finding.code === "storage-release-mismatch"
              ? "Biorepository Operations"
              : finding.code === "consent-packet-stale"
                ? "Quality Systems"
                : "Clinical Lab Operations"
    }));
}

export function releasePosture() {
  return releasePosturePackets;
}

export function verification() {
  return [
    "The dashboard is backed by a real offline analyzer and CLI, not static copy alone.",
    "Snapshots and custody gap packets are synthetic sample data only; no patient identifiers, specimen IDs, or live lab credentials are published.",
    "The control plane keeps labeling, temperature, custody, storage, consent, and release posture visible for biotech and diagnostics stakeholders.",
    "This surface demonstrates specimen chain-of-custody operations depth, not a generic lab keyword page.",
    "It complements assay, instrument, and CAPA routing proof with a concrete custody and handoff lane."
  ];
}

export function payload() {
  return {
    summary: summary(),
    custodyLane: custodyLane(),
    transferGaps: transferGaps(),
    releasePosture: releasePosture(),
    verification: verification(),
    sample: sampleSpecimenChainOfCustodyPayload
  };
}
