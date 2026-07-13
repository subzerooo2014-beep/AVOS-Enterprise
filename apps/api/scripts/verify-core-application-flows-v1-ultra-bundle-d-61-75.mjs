import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const required = [
  "src/core-application-flows/core-flow-governance.types.ts",
  "src/core-application-flows/core-flow-risk.service.ts",
  "src/core-application-flows/core-flow-policy-engine.service.ts",
  "src/core-application-flows/core-flow-compliance.service.ts",
  "src/core-application-flows/core-flow-escalation.service.ts",
  "src/core-application-flows/core-flow-governance.service.ts",
  "src/core-application-flows/core-flow-governance.controller.ts",
  "src/workflows/workflows.module.ts",
];

const missing = required.filter((file) => !fs.existsSync(path.join(root, file)));
const all = missing.length
  ? ""
  : required.map((file) => fs.readFileSync(path.join(root, file), "utf8")).join("\n");

const checks = {
  requiredFilesPresent: missing.length === 0,
  riskAssessmentReady: all.includes("CoreFlowRiskService"),
  policyEngineReady: all.includes("CoreFlowPolicyEngineService"),
  allowDenyReviewReady: all.includes('"allow" | "deny" | "review"'),
  complianceEvidenceReady: all.includes("CoreFlowComplianceService"),
  evidencePackageReady: all.includes("overallStatus"),
  escalationReady: all.includes("CoreFlowEscalationService"),
  governanceOrchestrationReady: all.includes("CoreFlowGovernanceService"),
  approvalIntegrationReady: all.includes("governance-review"),
  auditIntegrationReady: all.includes("governance.evaluated"),
  dashboardReady: all.includes("generatedAt"),
  controllerRegistrationReady: all.includes("CoreFlowGovernanceController"),
};

const success = Object.values(checks).every(Boolean);

process.stdout.write(JSON.stringify({
  success,
  system: "AVOS Core Application Flows V1",
  bundle: "Ultra Bundle D — Mega Packs 61-75",
  version: "1.75.0",
  classification: "risk-policy-compliance-escalation-governance-evidence",
  megaPacks: 15,
  requiredFiles: required.length,
  missing,
  checks,
  healthStatus: success ? "healthy" : "unhealthy",
}));

if (!success) process.exit(1);
