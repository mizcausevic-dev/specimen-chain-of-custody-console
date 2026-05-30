export type ScopeKind = "SPECIMEN" | "SITE" | "HANDOFF" | "STORAGE" | "LAB";
export type RiskHealth = "HEALTHY" | "WATCH" | "CRITICAL";
export type SnapshotStatus = "CURRENT" | "STALE";
export type GapStatus = "ADDED" | "REMOVED" | "CHANGED" | "DEGRADED";
export type ControlFamily =
  | "Labeling"
  | "Temperature"
  | "Custody"
  | "Storage"
  | "Consent"
  | "Transport"
  | "Release";

export interface SpecimenCustodySnapshot {
  id: string;
  name: string;
  scope: ScopeKind;
  riskStatus: RiskHealth;
  snapshotStatus: SnapshotStatus;
  controlPath: string;
  owner: string;
  specimenCount: number;
  transferTouchpoints: number;
  collectedAt: string;
}

export interface SpecimenCustodyGap {
  id: string;
  snapshotId: string;
  resourcePath: string;
  scope: ScopeKind;
  controlFamily: ControlFamily;
  status: GapStatus;
  expectedState: string;
  observedState: string;
  gapWindowHours: number;
  blocksApproval?: boolean;
  note?: string;
}

export interface SpecimenCustodyExport {
  snapshots?: SpecimenCustodySnapshot[];
  gaps?: SpecimenCustodyGap[];
}

export type FindingSeverity = "high" | "medium" | "low" | "info";

export type FindingCode =
  | "no-current-specimen-snapshot"
  | "stale-specimen-snapshot"
  | "labeling-integrity-gap"
  | "temperature-excursion"
  | "custody-signoff-missing"
  | "storage-release-mismatch"
  | "transport-seal-gap"
  | "consent-packet-stale"
  | "stale-gap-window";

export interface Finding {
  code: FindingCode;
  severity: FindingSeverity;
  message: string;
  subject: string;
  subjectName?: string;
  scope?: ScopeKind;
  controlFamily?: ControlFamily;
}

export interface PostureReport {
  generatedAt: string;
  specimens: number;
  currentSnapshots: number;
  gaps: number;
  blockingGaps: number;
  temperatureGaps: number;
  handoffGaps: number;
  findingsList: Finding[];
  ok: boolean;
}

export interface PostureOptions {
  now?: string;
  staleGapAfterHours?: number;
}
