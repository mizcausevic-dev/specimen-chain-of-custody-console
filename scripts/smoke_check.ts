import assert from "node:assert/strict";

import app from "../src/app.js";

const server = app.listen(5522, "127.0.0.1");

const routes = [
  "/",
  "/custody-lane",
  "/transfer-gaps",
  "/release-posture",
  "/verification",
  "/docs",
  "/api/dashboard/summary",
  "/api/custody-lane",
  "/api/transfer-gaps",
  "/api/release-posture",
  "/api/verification",
  "/api/sample"
];

try {
  for (const route of routes) {
    const response = await fetch(`http://127.0.0.1:5522${route}`);
    assert.equal(response.status, 200, route);
  }
  console.log("Smoke check passed.");
} finally {
  server.close();
}
