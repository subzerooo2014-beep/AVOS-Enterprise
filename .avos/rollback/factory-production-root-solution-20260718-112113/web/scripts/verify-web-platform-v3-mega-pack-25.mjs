import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const required = [
  "src/app/capacity-demand-intelligence/page.tsx",
  "src/components/capacity-demand-intelligence/capacity-demand-intelligence-center.tsx",
  "src/components/capacity-demand-intelligence/capacity-demand-intelligence.module.css",
  "src/data/capacity-demand-intelligence.ts",
  "src/store/capacity-demand-intelligence-store.ts",
];

const missing = required.filter((file) => !fs.existsSync(path.join(root, file)));
const read = (file) => fs.readFileSync(path.join(root, file), "utf8");
const component = missing.length ? "" : read(required[1]);
const data = missing.length ? "" : read(required[3]);

const checks = {
  requiredFilesPresent: missing.length === 0,
  centerReady: component.includes("CapacityDemandIntelligenceCenter"),
  matrixReady: component.includes("CAPACITY DEMAND MATRIX"),
  filteringReady: component.includes("visibleRecords"),
  forecastingReady: component.includes("forecastDemand"),
  intelligenceReady: component.includes("AVOS CAPACITY INTELLIGENCE"),
  recordsSeeded: (data.match(/id: "CD-/g) ?? []).length >= 5,
};

const success = Object.values(checks).every(Boolean);

process.stdout.write(JSON.stringify({
  success,
  system: "AVOS Web Platform V3",
  megaPack: "Mega Pack 25",
  version: "3.25.0",
  classification: "enterprise-capacity-demand-intelligence-layer",
  checks,
  missing,
  healthStatus: success ? "healthy" : "unhealthy",
}));

if (!success) process.exit(1);
