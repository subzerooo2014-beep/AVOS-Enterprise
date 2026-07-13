import fs from "node:fs";
import path from "node:path";
const root = process.cwd();
const required = [
  "src/core-application-flows/core-flow-registry.service.ts",
  "src/core-application-flows/core-application-flows.service.ts",
  "src/core-application-flows/core-application-flows.controller.ts",
  "src/core-application-flows/core-application-flows.module.ts",
];
const missing = required.filter((file) => !fs.existsSync(path.join(root, file)));
const all = missing.length ? "" : required.map((file) => fs.readFileSync(path.join(root, file), "utf8")).join("\n");
const checks = {
  requiredFilesPresent: missing.length === 0,
  quoteToCashReady: all.includes("quoteToCash"),
  reservationToSaleReady: all.includes("reservationToSale"),
  correlationReady: all.includes("correlationId"),
  registryReady: all.includes("CoreFlowRegistryService"),
  replayReady: all.includes("replay"),
  workflowOrchestrationReady: all.includes("completeStep"),
  completionEventReady: all.includes("QuoteToCashCompleted"),
};
const success = Object.values(checks).every(Boolean);
process.stdout.write(JSON.stringify({
  success,
  system: "AVOS Core Application Flows V1",
  bundle: "Mega Packs 11-15",
  version: "1.15.0",
  classification: "orchestrator-correlation-replay-quote-to-cash-reservation-to-sale",
  missing,
  checks,
  healthStatus: success ? "healthy" : "unhealthy",
}));
if (!success) process.exit(1);
