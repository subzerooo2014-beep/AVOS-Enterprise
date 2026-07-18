import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const required = [
  "src/app/compliance-governance-center/page.tsx",
  "src/app/partner-ecosystem-center/page.tsx",
  "src/app/workforce-talent-center/page.tsx",
  "src/app/knowledge-intelligence-center/page.tsx",
  "src/app/innovation-lab-center/page.tsx",
  "src/components/enterprise-bundle-34-38/enterprise-bundle-center.tsx",
  "src/components/enterprise-bundle-34-38/enterprise-bundle-center.module.css",
  "src/data/enterprise-bundle-34-38.ts",
];

const missing = required.filter((file) => !fs.existsSync(path.join(root, file)));
const read = (file) => fs.readFileSync(path.join(root, file), "utf8");
const component = missing.length ? "" : read(required[5]);
const data = missing.length ? "" : read(required[7]);

const checks = {
  requiredFilesPresent: missing.length === 0,
  sharedCenterReady: component.includes("EnterpriseBundleCenter"),
  complianceReady: data.includes("CMP-3401"),
  partnersReady: data.includes("PRT-3501"),
  workforceReady: data.includes("WRK-3601"),
  knowledgeReady: data.includes("KNW-3701"),
  innovationReady: data.includes("INV-3801"),
  intelligenceReady: component.includes("AVOS ENTERPRISE INTELLIGENCE"),
};

const success = Object.values(checks).every(Boolean);

process.stdout.write(JSON.stringify({
  success,
  system: "AVOS Web Platform V3",
  bundle: "Mega Packs 34-38",
  version: "3.38.0",
  classification: "enterprise-governance-ecosystem-innovation-bundle",
  centers: 5,
  checks,
  missing,
  healthStatus: success ? "healthy" : "unhealthy",
}));

if (!success) process.exit(1);
