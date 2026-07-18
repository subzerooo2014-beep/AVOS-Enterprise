import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const required = [
  "src/app/security-threat-center/page.tsx",
  "src/app/customer-experience-command/page.tsx",
  "src/app/sustainability-impact-center/page.tsx",
  "src/app/market-expansion-center/page.tsx",
  "src/app/commercial-launch-readiness/page.tsx",
  "src/components/enterprise-bundle-39-43/enterprise-bundle-center.tsx",
  "src/components/enterprise-bundle-39-43/enterprise-bundle-center.module.css",
  "src/data/enterprise-bundle-39-43.ts",
];

const missing = required.filter((file) => !fs.existsSync(path.join(root, file)));
const read = (file) => fs.readFileSync(path.join(root, file), "utf8");
const component = missing.length ? "" : read(required[5]);
const data = missing.length ? "" : read(required[7]);

const checks = {
  requiredFilesPresent: missing.length === 0,
  sharedCenterReady: component.includes("EnterpriseBundleCenter"),
  securityReady: data.includes("SEC-3901"),
  experienceReady: data.includes("CEX-4001"),
  sustainabilityReady: data.includes("SUS-4101"),
  expansionReady: data.includes("EXP-4201"),
  launchReady: data.includes("LCH-4301"),
  intelligenceReady: component.includes("AVOS ENTERPRISE INTELLIGENCE"),
};

const success = Object.values(checks).every(Boolean);

process.stdout.write(JSON.stringify({
  success,
  system: "AVOS Web Platform V3",
  bundle: "Mega Packs 39-43",
  version: "3.43.0",
  classification: "enterprise-security-experience-expansion-launch-bundle",
  centers: 5,
  checks,
  missing,
  healthStatus: success ? "healthy" : "unhealthy",
}));

if (!success) process.exit(1);
