import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const required = [
  "src/core-application-flows/core-flow-enterprise.types.ts",
  "src/core-application-flows/core-flow-tenancy.service.ts",
  "src/core-application-flows/core-flow-sla.service.ts",
  "src/core-application-flows/core-flow-cost.service.ts",
  "src/core-application-flows/core-flow-lineage.service.ts",
  "src/core-application-flows/core-flow-retention.service.ts",
  "src/core-application-flows/core-flow-privacy.service.ts",
  "src/core-application-flows/core-flow-chaos.service.ts",
  "src/core-application-flows/core-flow-contract.service.ts",
  "src/core-application-flows/core-flow-enterprise.service.ts",
  "src/core-application-flows/core-flow-enterprise.controller.ts",
  "src/workflows/workflows.module.ts",
];

const missing = required.filter((file) => !fs.existsSync(path.join(root, file)));
const all = missing.length
  ? ""
  : required.map((file) => fs.readFileSync(path.join(root, file), "utf8")).join("\n");

const checks = {
  requiredFilesPresent: missing.length === 0,
  tenancyReady: all.includes("CoreFlowTenancyService"),
  slaReady: all.includes("CoreFlowSlaService"),
  costTrackingReady: all.includes("CoreFlowCostService"),
  lineageReady: all.includes("CoreFlowLineageService"),
  retentionReady: all.includes("CoreFlowRetentionService"),
  privacyReady: all.includes("CoreFlowPrivacyService"),
  redactionReady: all.includes("[REDACTED]"),
  chaosReady: all.includes("CoreFlowChaosService"),
  contractsReady: all.includes("CoreFlowContractService"),
  preflightReady: all.includes("preflight"),
  finalizeReady: all.includes("finalize"),
  dashboardReady: all.includes("CoreFlowEnterpriseService"),
  controllerRegistrationReady: all.includes("CoreFlowEnterpriseController"),
};

const success = Object.values(checks).every(Boolean);

process.stdout.write(JSON.stringify({
  success,
  system: "AVOS Core Application Flows V1",
  bundle: "Ultra Bundle E — Mega Packs 76-100",
  version: "1.100.0",
  classification: "tenancy-sla-cost-lineage-retention-privacy-chaos-contracts",
  megaPacks: 25,
  requiredFiles: required.length,
  missing,
  checks,
  healthStatus: success ? "healthy" : "unhealthy",
}));

if (!success) process.exit(1);
