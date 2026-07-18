import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const required = [
  "src/app/finance-cockpit/page.tsx",
  "src/app/executive-strategy-center/page.tsx",
  "src/app/ai-growth-center/page.tsx",
  "src/app/global-operations-center/page.tsx",
  "src/app/enterprise-digital-twin/page.tsx",
  "src/components/enterprise-bundle-29-33/enterprise-bundle-center.tsx",
  "src/components/enterprise-bundle-29-33/enterprise-bundle-center.module.css",
  "src/data/enterprise-bundle-29-33.ts",
];

const missing = required.filter((file) => !fs.existsSync(path.join(root, file)));
const read = (file) => fs.readFileSync(path.join(root, file), "utf8");
const component = missing.length ? "" : read(required[5]);
const data = missing.length ? "" : read(required[7]);

const checks = {
  requiredFilesPresent: missing.length === 0,
  sharedCenterReady: component.includes("EnterpriseBundleCenter"),
  financeReady: data.includes("FIN-2901"),
  strategyReady: data.includes("STR-3001"),
  growthReady: data.includes("GRW-3101"),
  operationsReady: data.includes("OPS-3201"),
  digitalTwinReady: data.includes("DT-3301"),
  intelligenceReady: component.includes("AVOS ENTERPRISE INTELLIGENCE"),
};

const success = Object.values(checks).every(Boolean);

process.stdout.write(JSON.stringify({
  success,
  system: "AVOS Web Platform V3",
  bundle: "Mega Packs 29-33",
  version: "3.33.0",
  classification: "enterprise-executive-intelligence-bundle",
  centers: 5,
  checks,
  missing,
  healthStatus: success ? "healthy" : "unhealthy",
}));

if (!success) process.exit(1);
