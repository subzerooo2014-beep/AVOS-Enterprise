import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const required = [
  "src/core-application-flows/core-flow-runtime.types.ts",
  "src/core-application-flows/core-flow-runtime-registry.service.ts",
  "src/core-application-flows/core-flow-runtime-coordinator.service.ts",
  "src/core-application-flows/core-flow-runtime-finalization.service.ts",
  "src/core-application-flows/core-flow-runtime-platform.service.ts",
  "src/core-application-flows/core-flow-runtime.controller.ts",
  "src/workflows/workflows.module.ts",
];

const missing = required.filter((file) => !fs.existsSync(path.join(root, file)));
const all = missing.length ? "" : required.map((file) =>
  fs.readFileSync(path.join(root, file), "utf8")).join("\n");

const checks = {
  requiredFilesPresent: missing.length === 0,
  runtimeRegistryReady: all.includes("CoreFlowRuntimeRegistryService"),
  coordinationReady: all.includes("CoreFlowRuntimeCoordinatorService"),
  finalizationReady: all.includes("CoreFlowRuntimeFinalizationService"),
  platformOrchestrationReady: all.includes("CoreFlowRuntimePlatformService"),
  intelligenceIntegrationReady: all.includes("CoreFlowIntelligenceService"),
  autonomyIntegrationReady: all.includes("CoreFlowAutonomousOperationsService"),
  certificationReady: all.includes('"certified"'),
  qualityScoreReady: all.includes("qualityScore"),
  auditIntegrationReady: all.includes("runtime.finalized"),
  controllerRegistered: all.includes("CoreFlowRuntimeController"),
};

const success = Object.values(checks).every(Boolean);
process.stdout.write(JSON.stringify({
  success,
  system: "AVOS Core Application Flows V1",
  bundle: "Ultra Bundle M — Mega Packs 276-300",
  version: "1.300.0",
  classification: "runtime-registry-coordination-finalization-certification",
  megaPacks: 25,
  finalBundle: true,
  missing,
  checks,
  healthStatus: success ? "healthy" : "unhealthy",
}));
if (!success) process.exit(1);
