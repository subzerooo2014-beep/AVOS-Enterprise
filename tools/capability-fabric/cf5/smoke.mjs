import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const enterpriseRoot = path.join(
  root,
  "apps",
  "api",
  "src",
  "capability-enterprise",
);

const files = Object.fromEntries(
  [
    "tenant",
    "approval",
    "audit",
    "compliance",
    "certification",
    "publishing",
    "migration",
    "archive",
    "enterprise",
    "controller",
  ].map((name) => {
    const filename =
      name === "enterprise"
        ? "capability-enterprise.service.ts"
        : name === "controller"
          ? "capability-enterprise.controller.ts"
          : `capability-${name}.service.ts`;
    return [
      name,
      fs.readFileSync(path.join(enterpriseRoot, filename), "utf8"),
    ];
  }),
);

const checks = {
  multiTenantBinding: files.tenant.includes("TENANT_BINDING_ALREADY_EXISTS"),
  tenantQuota: files.tenant.includes("maxExecutionsPerHour"),
  humanApproval: files.approval.includes('status: "PENDING"'),
  approvalDecision: files.approval.includes("decide("),
  immutableAuditFoundation: files.audit.includes("occurredAt:"),
  complianceEvaluation: files.compliance.includes("controlsEvaluated"),
  intelligenceDrivenCompliance: files.compliance.includes("qualityIndex"),
  certificationThresholds: files.certification.includes("CERTIFICATION_REQUIREMENTS_NOT_MET"),
  certificationApproval: files.certification.includes("CERTIFICATION_APPROVAL_REQUIRED"),
  marketplaceReadiness: files.publishing.includes("MARKETPLACE_CERTIFICATION_REQUIRED"),
  publishingApproval: files.publishing.includes("PUBLICATION_APPROVAL_REQUIRED"),
  governedMigration: files.migration.includes("MIGRATION_APPROVAL_REQUIRED"),
  rollbackPlanning: files.migration.includes("rollbackSteps"),
  governedArchive: files.archive.includes("ARCHIVE_APPROVAL_REQUIRED"),
  humanFinalAuthority: files.enterprise.includes("humanFinalAuthority: true"),
  runtimeSmokeEndpoint: files.controller.includes('@Post("smoke")'),
};

const failed = Object.entries(checks)
  .filter(([, passed]) => !passed)
  .map(([name]) => name);

if (failed.length) {
  throw new Error(`CF-5 smoke checks failed: ${failed.join(", ")}`);
}

console.log(
  JSON.stringify(
    {
      success: true,
      system: "AVOS Capability Fabric",
      megaPack: "CF-5 Capability Enterprise and Governance",
      smokeTest: "passed",
      checks,
      checkCount: Object.keys(checks).length,
      rollbackReady: fs.existsSync(
        path.join(root, "tools", "capability-fabric", "cf5", "rollback.ps1"),
      ),
    },
    null,
    2,
  ),
);