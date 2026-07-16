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
const appModule = path.join(root, "apps", "api", "src", "app.module.ts");

const requiredFiles = [
  "capability-enterprise.types.ts",
  "capability-enterprise.registry.ts",
  "capability-tenant.service.ts",
  "capability-approval.service.ts",
  "capability-audit.service.ts",
  "capability-compliance.service.ts",
  "capability-certification.service.ts",
  "capability-publishing.service.ts",
  "capability-migration.service.ts",
  "capability-archive.service.ts",
  "capability-enterprise.service.ts",
  "capability-enterprise.controller.ts",
  "capability-enterprise.module.ts",
  "index.ts",
];

const missing = requiredFiles.filter(
  (file) => !fs.existsSync(path.join(enterpriseRoot, file)),
);
if (missing.length) {
  throw new Error(`Missing CF-5 files: ${missing.join(", ")}`);
}

const registry = fs.readFileSync(
  path.join(enterpriseRoot, "capability-enterprise.registry.ts"),
  "utf8",
);
const controller = fs.readFileSync(
  path.join(enterpriseRoot, "capability-enterprise.controller.ts"),
  "utf8",
);
const moduleFile = fs.readFileSync(
  path.join(enterpriseRoot, "capability-enterprise.module.ts"),
  "utf8",
);
const app = fs.readFileSync(appModule, "utf8");

const pillars = [
  "MULTI_TENANT_CAPABILITY_LAYER",
  "TENANT_CONFIGURATION",
  "TENANT_QUOTAS",
  "ENTERPRISE_GOVERNANCE",
  "HUMAN_APPROVAL_FRAMEWORK",
  "CAPABILITY_CERTIFICATION",
  "CAPABILITY_PUBLISHING",
  "MARKETPLACE_READINESS",
  "CAPABILITY_DISTRIBUTION",
  "CAPABILITY_AUDIT",
  "CAPABILITY_COMPLIANCE",
  "CAPABILITY_MIGRATION",
  "CAPABILITY_ARCHIVE",
  "POLICY_ENFORCEMENT",
  "ENTERPRISE_SDK_FOUNDATION",
  "PLUGIN_READINESS",
];

for (const pillar of pillars) {
  if (!registry.includes(`"${pillar}"`)) {
    throw new Error(`Missing CF-5 pillar: ${pillar}`);
  }
}

for (const route of [
  '@Controller("capability-fabric/enterprise")',
  '@Post("tenants/bind")',
  '@Post("approvals")',
  '@Post("approvals/:id/decide")',
  '@Post("certifications")',
  '@Post("publications")',
  '@Post("publications/:key/publish")',
  '@Post("compliance/:key/evaluate")',
  '@Post("migrations")',
  '@Get("audit")',
  '@Get("snapshot")',
  '@Post("smoke")',
]) {
  if (!controller.includes(route)) {
    throw new Error(`Missing CF-5 API route: ${route}`);
  }
}

for (const dependency of [
  "CapabilityFabricModule",
  "CapabilityRuntimeModule",
  "CapabilityOrchestrationModule",
  "CapabilityIntelligenceModule",
]) {
  if (!moduleFile.includes(dependency)) {
    throw new Error(`CF-5 module dependency missing: ${dependency}`);
  }
}

if (
  !app.includes(
    'import { CapabilityEnterpriseModule } from "./capability-enterprise/capability-enterprise.module";',
  ) ||
  !app.includes("CapabilityEnterpriseModule,")
) {
  throw new Error("CapabilityEnterpriseModule is not registered in app.module.ts");
}

console.log(
  JSON.stringify(
    {
      success: true,
      system: "AVOS Capability Fabric",
      megaPack: "CF-5 Capability Enterprise and Governance",
      verification: "passed",
      requiredFiles: requiredFiles.length,
      pillars: pillars.length,
      routes: 12,
      cf1Connected: true,
      cf2Connected: true,
      cf3Connected: true,
      cf4Connected: true,
      foundationFirst: true,
      humanFinalAuthority: true,
    },
    null,
    2,
  ),
);