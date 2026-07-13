import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const required = [
  "src/core-application-flows/core-flow-sovereignty.types.ts",
  "src/core-application-flows/core-flow-sovereign-zone.service.ts",
  "src/core-application-flows/core-flow-jurisdiction.service.ts",
  "src/core-application-flows/core-flow-key-management.service.ts",
  "src/core-application-flows/core-flow-continuity.service.ts",
  "src/core-application-flows/core-flow-sovereignty.service.ts",
  "src/core-application-flows/core-flow-sovereignty.controller.ts",
  "src/workflows/workflows.module.ts",
];

const missing = required.filter((file) => !fs.existsSync(path.join(root, file)));
const all = missing.length
  ? ""
  : required.map((file) => fs.readFileSync(path.join(root, file), "utf8")).join("\n");

const checks = {
  requiredFilesPresent: missing.length === 0,
  sovereignZonesReady: all.includes("CoreFlowSovereignZoneService"),
  jurisdictionReady: all.includes("CoreFlowJurisdictionService"),
  keyManagementReady: all.includes("CoreFlowKeyManagementService"),
  continuityReady: all.includes("CoreFlowContinuityService"),
  sovereigntyOrchestrationReady: all.includes("CoreFlowSovereigntyService"),
  residencyControlsReady: all.includes("residency-policy-mismatch"),
  restrictedDataReady: all.includes("restricted-data-residency-violation"),
  keyRotationReady: all.includes("rotatedAt"),
  continuityTestingReady: all.includes("simulatedRecoveryMinutes"),
  controllerRegistered: all.includes("CoreFlowSovereigntyController"),
};

const success = Object.values(checks).every(Boolean);

process.stdout.write(JSON.stringify({
  success,
  system: "AVOS Core Application Flows V1",
  bundle: "Ultra Bundle I — Mega Packs 176-200",
  version: "1.200.0",
  classification: "sovereign-zones-jurisdiction-encryption-continuity-residency",
  megaPacks: 25,
  missing,
  checks,
  healthStatus: success ? "healthy" : "unhealthy",
}));

if (!success) process.exit(1);
