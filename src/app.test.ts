import request from "supertest";
import { describe, expect, it } from "vitest";

import app from "./app.js";

describe("specimen-chain-of-custody app", () => {
  it("serves html routes", async () => {
    const htmlRoutes = ["/", "/custody-lane", "/transfer-gaps", "/release-posture", "/verification", "/docs"];
    for (const route of htmlRoutes) {
      const response = await request(app).get(route);
      expect(response.status).toBe(200);
      expect(response.headers["content-type"]).toContain("text/html");
    }
  });

  it("serves api routes", async () => {
    const apiRoutes = [
      "/api/dashboard/summary",
      "/api/custody-lane",
      "/api/transfer-gaps",
      "/api/release-posture",
      "/api/verification",
      "/api/sample"
    ];
    for (const route of apiRoutes) {
      const response = await request(app).get(route);
      expect(response.status).toBe(200);
      expect(response.headers["content-type"]).toContain("application/json");
    }
  });
});
