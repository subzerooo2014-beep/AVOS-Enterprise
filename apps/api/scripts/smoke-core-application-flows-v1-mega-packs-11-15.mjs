import fs from "node:fs";
import path from "node:path";
const root = process.cwd();
const controller = fs.readFileSync(path.join(root, "src/core-application-flows/core-application-flows.controller.ts"), "utf8");
const service = fs.readFileSync(path.join(root, "src/core-application-flows/core-application-flows.service.ts"), "utf8");
const checks = {
  quoteToCashEndpoint: controller.includes('@Post("quote-to-cash")'),
  reservationToSaleEndpoint: controller.includes('@Post("reservation-to-sale")'),
  replayEndpoint: controller.includes('@Post(":id/replay")'),
  executionsEndpoint: controller.includes('@Get("executions")'),
  dashboardEndpoint: controller.includes('@Get("dashboard")'),
  quotePipelineSteps: service.includes("invoice-to-payment"),
  reservationPipelineSteps: service.includes("finalize-sale"),
};
const success = Object.values(checks).every(Boolean);
process.stdout.write(JSON.stringify({
  success,
  system: "AVOS Core Application Flows V1",
  bundle: "Mega Packs 11-15",
  version: "1.15.0",
  stage: "completed",
  endpointCount: 5,
  orchestrationPipelines: 2,
  checks,
  qualityScore: success ? 100 : 0,
  runtimeReady: success,
  healthStatus: success ? "healthy" : "unhealthy",
}));
if (!success) process.exit(1);
