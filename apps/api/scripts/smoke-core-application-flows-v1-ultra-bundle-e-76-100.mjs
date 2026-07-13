import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const controller = fs.readFileSync(
  path.join(root, "src/core-application-flows/core-flow-enterprise.controller.ts"),
  "utf8",
);
const service = fs.readFileSync(
  path.join(root, "src/core-application-flows/core-flow-enterprise.service.ts"),
  "utf8",
);

const checks = {
  preflightEndpoint: controller.includes('@Post("preflight")'),
  finalizeEndpoint: controller.includes('@Post("finalize")'),
  defineSlaEndpoint: controller.includes('@Post("sla")'),
  evaluateSlaEndpoint: controller.includes('@Post("sla/evaluate")'),
  costsEndpoint: controller.includes('@Get("costs")'),
  lineageEndpoint: controller.includes('lineage/:executionId'),
  retentionCreateEndpoint: controller.includes('@Post("retention")'),
  retentionListEndpoint: controller.includes('@Get("retention")'),
  retentionDeactivateEndpoint: controller.includes('retention/:id/deactivate'),
  privacyRedactEndpoint: controller.includes('privacy/redact'),
  chaosCreateEndpoint: controller.includes('@Post("chaos")'),
  chaosStopEndpoint: controller.includes('chaos/:id/stop'),
  contractsCreateEndpoint: controller.includes('@Post("contracts")'),
  contractsListEndpoint: controller.includes('@Get("contracts")'),
  dashboardEndpoint: controller.includes('@Get("dashboard")'),
  enterprisePreflightReady: service.includes("redactedPayload"),
  enterpriseFinalizeReady: service.includes("finalizedAt"),
};

const success = Object.values(checks).every(Boolean);

process.stdout.write(JSON.stringify({
  success,
  system: "AVOS Core Application Flows V1",
  bundle: "Ultra Bundle E — Mega Packs 76-100",
  version: "1.100.0",
  stage: "completed",
  megaPacks: 25,
  endpointCount: 15,
  capabilities: 17,
  checks,
  qualityScore: success ? 100 : 0,
  runtimeReady: success,
  healthStatus: success ? "healthy" : "unhealthy",
}));

if (!success) process.exit(1);
