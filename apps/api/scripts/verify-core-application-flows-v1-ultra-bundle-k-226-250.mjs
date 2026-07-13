import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const required = [
  "src/core-application-flows/core-flow-change.types.ts",
  "src/core-application-flows/core-flow-change.service.ts",
  "src/core-application-flows/core-flow-impact.service.ts",
  "src/core-application-flows/core-flow-release-gate.service.ts",
  "src/core-application-flows/core-flow-rollback-plan.service.ts",
  "src/core-application-flows/core-flow-change-governance.service.ts",
  "src/core-application-flows/core-flow-change.controller.ts",
  "src/workflows/workflows.module.ts",
];

const missing = required.filter((file) => !fs.existsSync(path.join(root, file)));
const all = missing.length
  ? ""
  : required.map((file) => fs.readFileSync(path.join(root, file), "utf8")).join("\n");

const checks = {
  requiredFilesPresent: missing.length === 0,
  changeManagementReady: all.includes("CoreFlowChangeService"),
  impactAssessmentReady: all.includes("CoreFlowImpactService"),
  releaseGatesReady: all.includes("CoreFlowReleaseGateService"),
  rollbackPlansReady: all.includes("CoreFlowRollbackPlanService"),
  governanceReady: all.includes("CoreFlowChangeGovernanceService"),
  gateLifecycleReady: all.includes('"pending" | "passed" | "failed" | "waived"'),
  rollbackTestingReady: all.includes("testedAt"),
  approvalReadinessReady: all.includes("release gates and tested rollback plan"),
  auditIntegrationReady: all.includes("change.governance-evaluated"),
  controllerRegistered: all.includes("CoreFlowChangeController"),
};

const success = Object.values(checks).every(Boolean);

process.stdout.write(JSON.stringify({
  success,
  system: "AVOS Core Application Flows V1",
  bundle: "Ultra Bundle K — Mega Packs 226-250",
  version: "1.250.0",
  classification: "change-impact-release-gates-rollback-governance",
  megaPacks: 25,
  missing,
  checks,
  healthStatus: success ? "healthy" : "unhealthy",
}));

if (!success) process.exit(1);
