import type { Finding, PostureOptions, PostureReport, SpecimenCustodyExport, SpecimenCustodySnapshot } from "./types.js";

function isCurrent(snapshot: SpecimenCustodySnapshot): boolean {
  return snapshot.snapshotStatus === "CURRENT";
}

function includesAny(text: string, needles: string[]): boolean {
  const haystack = text.toLowerCase();
  return needles.some((needle) => haystack.includes(needle));
}

export function analyze(payload: SpecimenCustodyExport, options: PostureOptions = {}): PostureReport {
  const now = options.now ?? new Date().toISOString();
  const staleGapAfterHours = options.staleGapAfterHours ?? 24;
  const snapshots = payload.snapshots ?? [];
  const gaps = payload.gaps ?? [];
  const findingsList: Finding[] = [];

  const currentSnapshots = snapshots.filter(isCurrent).length;
  if (currentSnapshots === 0) {
    findingsList.push({
      code: "no-current-specimen-snapshot",
      severity: "high",
      message: "No current specimen custody snapshot is available for review.",
      subject: "specimen-snapshot-currentness"
    });
  }

  for (const snapshot of snapshots) {
    if (snapshot.snapshotStatus === "STALE") {
      findingsList.push({
        code: "stale-specimen-snapshot",
        severity: snapshot.riskStatus === "CRITICAL" ? "high" : "medium",
        message: `Specimen snapshot for "${snapshot.name}" is stale and should be refreshed before release posture is trusted.`,
        subject: snapshot.id,
        subjectName: snapshot.controlPath,
        scope: snapshot.scope
      });
    }
  }

  for (const gap of gaps) {
    const observed = gap.observedState.toLowerCase();

    if (gap.controlFamily === "Labeling" && includesAny(observed, ["relabel", "barcode", "mismatch", "label"])) {
      findingsList.push({
        code: "labeling-integrity-gap",
        severity: gap.blocksApproval ? "high" : "medium",
        message: `Labeling integrity is too weak on "${gap.resourcePath}" for a clean custody posture.`,
        subject: gap.id,
        subjectName: gap.resourcePath,
        scope: gap.scope,
        controlFamily: gap.controlFamily
      });
    }

    if (gap.controlFamily === "Temperature" && includesAny(observed, ["excursion", "warmer", "temperature", "cold-chain"])) {
      findingsList.push({
        code: "temperature-excursion",
        severity: gap.blocksApproval ? "high" : "medium",
        message: `Temperature posture is incomplete on "${gap.resourcePath}".`,
        subject: gap.id,
        subjectName: gap.resourcePath,
        scope: gap.scope,
        controlFamily: gap.controlFamily
      });
    }

    if (gap.controlFamily === "Custody" && includesAny(observed, ["missing", "unsigned", "handoff", "custody"])) {
      findingsList.push({
        code: "custody-signoff-missing",
        severity: gap.blocksApproval ? "high" : "medium",
        message: `Custody signoff is incomplete on "${gap.resourcePath}".`,
        subject: gap.id,
        subjectName: gap.resourcePath,
        scope: gap.scope,
        controlFamily: gap.controlFamily
      });
    }

    if (gap.controlFamily === "Storage" && includesAny(observed, ["freezer", "shelf", "unreleased", "storage"])) {
      findingsList.push({
        code: "storage-release-mismatch",
        severity: gap.blocksApproval ? "high" : "medium",
        message: `Storage and release posture are misaligned on "${gap.resourcePath}".`,
        subject: gap.id,
        subjectName: gap.resourcePath,
        scope: gap.scope,
        controlFamily: gap.controlFamily
      });
    }

    if (gap.controlFamily === "Transport" && includesAny(observed, ["seal", "courier", "transport", "unscanned"])) {
      findingsList.push({
        code: "transport-seal-gap",
        severity: gap.blocksApproval ? "high" : "medium",
        message: `Transport custody is drifting on "${gap.resourcePath}".`,
        subject: gap.id,
        subjectName: gap.resourcePath,
        scope: gap.scope,
        controlFamily: gap.controlFamily
      });
    }

    if (gap.controlFamily === "Consent" && includesAny(observed, ["expired", "stale", "consent", "packet"])) {
      findingsList.push({
        code: "consent-packet-stale",
        severity: gap.blocksApproval ? "high" : "medium",
        message: `Consent packet coverage is stale on "${gap.resourcePath}".`,
        subject: gap.id,
        subjectName: gap.resourcePath,
        scope: gap.scope,
        controlFamily: gap.controlFamily
      });
    }

    if (gap.gapWindowHours > staleGapAfterHours) {
      findingsList.push({
        code: "stale-gap-window",
        severity: gap.gapWindowHours > staleGapAfterHours * 2 ? "medium" : "low",
        message: `Gap on "${gap.resourcePath}" has remained unresolved for ${gap.gapWindowHours} hours.`,
        subject: gap.id,
        subjectName: gap.resourcePath,
        scope: gap.scope,
        controlFamily: gap.controlFamily
      });
    }
  }

  const blockingGaps = gaps.filter((gap) => gap.blocksApproval).length;
  const temperatureGaps = gaps.filter((gap) => gap.controlFamily === "Temperature").length;
  const handoffGaps = gaps.filter((gap) => gap.scope === "HANDOFF").length;
  const ok = !findingsList.some((finding) => finding.severity === "high");

  return {
    generatedAt: now,
    specimens: snapshots.length,
    currentSnapshots,
    gaps: gaps.length,
    blockingGaps,
    temperatureGaps,
    handoffGaps,
    findingsList,
    ok
  };
}
