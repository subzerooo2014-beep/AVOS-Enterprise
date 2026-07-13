import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const required = [
  "src/core-application-flows/core-flow-standards.types.ts",
  "src/core-application-flows/core-flow-standards-registry.service.ts",
  "src/core-application-flows/core-flow-conformance.service.ts",
  "src/core-application-flows/core-flow-certification.service.ts",
  "src/core-application-flows/core-flow-compatibility.service.ts",
  "src/core-application-flows/core-flow-standards-governance.service.ts",
  "src/core-application-flows/core-flow-standards.controller.ts",
  "src/workflows/workflows.module.ts",
];

const missing = required.filter((file) => !fs.existsSync(path.join(root, file)));
const all = missing.length
  ? ""
  : required.map((file) => fs.readFileSync(path.join(root, file), "utf8")).join("\n");

const checks = {
  requiredFilesPresent: missing.length === 0,
  standardsRegistryReady: all.includes("CoreFlowStandardsRegistryService"),
  conformanceReady: all.includes("CoreFlowConformanceService"),
  certificationReady: all.includes("CoreFlowCertificationService"),
  compatibilityReady: all.includes("CoreFlowCompatibilityService"),
  governanceReady: all.includes("CoreFlowStandardsGovernanceService"),
  certificateLifecycleReady: all.includes('"issued" | "suspended" | "revoked" | "expired"'),
  standardLifecycleReady: all.includes('"draft"') && all.includes('"deprecated"'),
  compatibilityIssuesReady: all.includes("missing-field:"),
  auditIntegrationReady: all.includes("standards.certification-evaluated"),
  controllerRegistered: all.includes("CoreFlowStandardsController"),
};

const success = Object.values(checks).every(Boolean);

process.stdout.write(JSON.stringify({
  success,
  system: "AVOS Core Application Flows V1",
  bundle: "Ultra Bundle J — Mega Packs 201-225",
  version: "1.225.0",
  classification: "standards-conformance-certification-compatibility-governance",
  megaPacks: 25,
  missing,
  checks,
  healthStatus: success ? "healthy" : "unhealthy",
}));

if (!success) process.exit(1);
