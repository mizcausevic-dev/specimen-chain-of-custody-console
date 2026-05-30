import { describe, expect, it } from "vitest";

import {
  custodyLane,
  payload,
  releasePosture,
  summary,
  transferGaps,
  verification
} from "./specimenChainOfCustodyConsoleService.js";

describe("specimenChainOfCustodyConsoleService", () => {
  it("returns the summary metrics", () => {
    expect(summary().specimens).toBe(2);
    expect(summary().gaps).toBe(6);
  });

  it("returns one custody-lane item per packet", () => {
    expect(custodyLane()).toHaveLength(4);
  });

  it("returns sorted findings and release posture packets", () => {
    expect(transferGaps()[0]?.severity).toBe("high");
    expect(releasePosture()).toHaveLength(4);
  });

  it("returns verification and payload", () => {
    expect(verification().length).toBeGreaterThan(3);
    expect(payload().sample).toBeDefined();
  });
});
