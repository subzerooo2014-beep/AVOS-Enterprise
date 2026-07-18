import fs from "node:fs";
import path from "node:path";
const root = process.cwd();
const required = [
  "src/app/sovereign-intelligence-center/page.tsx",
  "src/app/autonomous-operations-center/page.tsx",
  "src/app/digital-twin-command/page.tsx",
  "src/app/innovation-venture-lab/page.tsx",
  "src/app/ecosystem-economy-center/page.tsx",
  "src/components/enterprise-bundle-44-48/enterprise-bundle-center.tsx",
  "src/components/enterprise-bundle-44-48/enterprise-bundle-center.module.css",
  "src/data/enterprise-bundle-44-48.ts",
];
const missing = required.filter((file) => !fs.existsSync(path.join(root, file)));
const read = (file) => fs.readFileSync(path.join(root, file), "utf8");
const component = missing.length ? "" : read(required[5]);
const data = missing.length ? "" : read(required[7]);
const checks = {
  requiredFilesPresent: missing.length === 0,
  sharedCenterReady: component.includes("EnterpriseBundleCenter"),
  sovereignReady: data.includes("SVG-4401"),
  autonomousReady: data.includes("AUT-4501"),
  digitalTwinReady: data.includes("TWN-4601"),
  innovationReady: data.includes("INV-4701"),
  ecosystemReady: data.includes("ECO-4801"),
  intelligenceReady: component.includes("AVOS ENTERPRISE INTELLIGENCE"),
};
const success = Object.values(checks).every(Boolean);
process.stdout.write(JSON.stringify({ success, system: "AVOS Web Platform V3", bundle: "Mega Packs 44-48", version: "3.48.0", classification: "sovereign-autonomous-digital-twin-innovation-ecosystem-bundle", centers: 5, checks, missing, healthStatus: success ? "healthy" : "unhealthy" }));
if (!success) process.exit(1);
