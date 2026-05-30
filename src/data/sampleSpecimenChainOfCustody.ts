import type { SpecimenCustodyExport } from "../types.js";

export const sampleSpecimenChainOfCustodyPayload: SpecimenCustodyExport = {
  snapshots: [
    {
      id: "specimen-oncology-core",
      name: "Oncology biopsy intake cohort",
      scope: "SPECIMEN",
      riskStatus: "WATCH",
      snapshotStatus: "CURRENT",
      controlPath: "/specimens/oncology-biopsy/custody-posture",
      owner: "Clinical Lab Operations",
      specimenCount: 84,
      transferTouchpoints: 5,
      collectedAt: "2026-05-30T14:00:00Z"
    },
    {
      id: "specimen-regional-courier",
      name: "Regional courier handoff cohort",
      scope: "HANDOFF",
      riskStatus: "CRITICAL",
      snapshotStatus: "STALE",
      controlPath: "/specimens/regional-courier/custody-posture",
      owner: "Pathology Logistics",
      specimenCount: 41,
      transferTouchpoints: 6,
      collectedAt: "2026-05-27T09:20:00Z"
    }
  ],
  gaps: [
    {
      id: "gap-barcode-relabel",
      snapshotId: "specimen-oncology-core",
      resourcePath: "oncology-biopsy / accession relabel lane",
      scope: "SPECIMEN",
      controlFamily: "Labeling",
      status: "DEGRADED",
      expectedState: "Barcode and accession labels remain aligned through intake and prep.",
      observedState: "Relabel event left one accession barcode mismatch unresolved.",
      gapWindowHours: 11,
      blocksApproval: true,
      note: "Relabel drift is still visible to bench operators."
    },
    {
      id: "gap-temperature-excursion",
      snapshotId: "specimen-regional-courier",
      resourcePath: "regional-courier / cold-chain tote 7",
      scope: "HANDOFF",
      controlFamily: "Temperature",
      status: "DEGRADED",
      expectedState: "Cold-chain tote remains inside excursion threshold until receipt scan.",
      observedState: "Temperature excursion persisted above threshold before receipt confirmation.",
      gapWindowHours: 19,
      blocksApproval: true
    },
    {
      id: "gap-custody-signoff",
      snapshotId: "specimen-regional-courier",
      resourcePath: "regional-courier / courier-to-lab transfer packet",
      scope: "HANDOFF",
      controlFamily: "Custody",
      status: "CHANGED",
      expectedState: "Courier and receiving lab both sign the transfer packet in the same review window.",
      observedState: "Receiving signature is missing from the custody packet.",
      gapWindowHours: 33,
      blocksApproval: true
    },
    {
      id: "gap-storage-release",
      snapshotId: "specimen-oncology-core",
      resourcePath: "oncology-biopsy / freezer shelf B12",
      scope: "STORAGE",
      controlFamily: "Storage",
      status: "DEGRADED",
      expectedState: "Storage location and release queue remain in sync after thaw approval.",
      observedState: "One specimen remains queued for release while still marked in freezer custody.",
      gapWindowHours: 16,
      blocksApproval: true
    },
    {
      id: "gap-consent-packet",
      snapshotId: "specimen-oncology-core",
      resourcePath: "oncology-biopsy / patient-consent attachment packet",
      scope: "LAB",
      controlFamily: "Consent",
      status: "CHANGED",
      expectedState: "Consent attachment remains current through secondary review.",
      observedState: "Consent packet is stale and missing the most recent signed attachment.",
      gapWindowHours: 27,
      blocksApproval: false
    },
    {
      id: "gap-transport-seal",
      snapshotId: "specimen-regional-courier",
      resourcePath: "regional-courier / tamper-seal verification lane",
      scope: "HANDOFF",
      controlFamily: "Transport",
      status: "DEGRADED",
      expectedState: "Transport seal and courier scan remain intact through arrival.",
      observedState: "Seal verification was unscanned at the final courier checkpoint.",
      gapWindowHours: 22,
      blocksApproval: false
    }
  ]
};

export const custodyLanePackets = [
  {
    id: "accession-lane",
    lane: "Accession integrity lane",
    owner: "Clinical Lab Operations",
    focus: "Barcode continuity, specimen labeling, and intake-safe accession posture",
    status: "red",
    note: "Label drift is still weakening accession confidence.",
    nextAction: "Close the relabel mismatch before the next pathology review window."
  },
  {
    id: "handoff-lane",
    lane: "Courier handoff lane",
    owner: "Pathology Logistics",
    focus: "Transfer signatures, courier scans, and receipt-safe custody continuity",
    status: "red",
    note: "Missing receiving signoff is blocking a credible handoff trail.",
    nextAction: "Restore the receiving signature and seal scan for the courier packet."
  },
  {
    id: "storage-lane",
    lane: "Storage release lane",
    owner: "Biorepository Operations",
    focus: "Freezer posture, thaw approvals, and release-safe storage alignment",
    status: "yellow",
    note: "Storage and release status drifted on one active specimen group.",
    nextAction: "Reconcile freezer shelf B12 with the release queue before disposition."
  },
  {
    id: "consent-lane",
    lane: "Consent evidence lane",
    owner: "Quality Systems",
    focus: "Consent packet freshness, attachment completeness, and review-safe evidence posture",
    status: "yellow",
    note: "Consent evidence is recoverable, but still incomplete for one active packet.",
    nextAction: "Attach the missing signed consent document before the next quality checkpoint."
  }
] as const;

export const releasePosturePackets = [
  {
    packetId: "SCC-11",
    lane: "Accession correction",
    owner: "Clinical Lab Operations",
    status: "red",
    completenessScore: 59,
    decisionNote: "Accession posture is too weak to call specimen custody release-safe.",
    blocker: "One barcode mismatch remains unresolved inside the active intake packet.",
    launchWindowHours: 6
  },
  {
    packetId: "SCC-18",
    lane: "Courier transfer repair",
    owner: "Pathology Logistics",
    status: "red",
    completenessScore: 61,
    decisionNote: "Transfer evidence is stale enough to weaken handoff confidence.",
    blocker: "Receiving signature and seal verification are both missing in the courier packet.",
    launchWindowHours: 8
  },
  {
    packetId: "SCC-24",
    lane: "Storage reconciliation",
    owner: "Biorepository Operations",
    status: "yellow",
    completenessScore: 76,
    decisionNote: "Storage posture is mostly visible, but one specimen still conflicts with release state.",
    blocker: "Freezer-to-release alignment has not been reconciled for shelf B12.",
    launchWindowHours: 14
  },
  {
    packetId: "SCC-31",
    lane: "Consent packet refresh",
    owner: "Quality Systems",
    status: "yellow",
    completenessScore: 81,
    decisionNote: "Consent evidence is nearly complete, but still missing the latest signed attachment.",
    blocker: "Secondary review remains exposed until the final consent document is attached.",
    launchWindowHours: 18
  }
] as const;
