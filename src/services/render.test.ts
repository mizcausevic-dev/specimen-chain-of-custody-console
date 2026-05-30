import { describe, expect, it } from "vitest";

import {
  renderCustodyLane,
  renderDocs,
  renderOverview,
  renderReleasePosture,
  renderTransferGaps,
  renderVerification
} from "./render.js";

describe("render", () => {
  it("renders the overview shell", () => {
    expect(renderOverview()).toContain("Specimen Chain Of Custody Console");
  });

  it("renders lane and gap views", () => {
    expect(renderCustodyLane()).toContain("Custody Lane");
    expect(renderTransferGaps()).toContain("Transfer Gaps");
    expect(renderReleasePosture()).toContain("Release Posture");
  });

  it("renders docs and verification", () => {
    expect(renderDocs()).toContain("/api/custody-lane");
    expect(renderDocs()).toContain("specimen-chain-of-custody-console");
    expect(renderVerification()).toContain("operator-safe claims");
  });
});
