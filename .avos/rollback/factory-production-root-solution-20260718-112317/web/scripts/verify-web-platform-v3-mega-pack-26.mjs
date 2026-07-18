import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const required = [
  "src/app/revenue-margin-intelligence/page.tsx",
  "src/components/revenue-margin-intelligence/revenue-margin-intelligence-center.tsx",
  "src/components/revenue-margin-intelligence/revenue-margin-intelligence.module.css",
  "src/data/revenue-margin-intelligence.ts",
  "src/store/revenue-margin-intelligence-store.ts",
];

const missing = required.filter((file) => !fs.existsSync(path.join(root, file)));
const read = (file) => fs.readFileSync(path.join(root, file), "utf8");
const component = missing.length ? "" : read(required[1]);
const data = missing.length ? "" : read(required[3]);

const checks = {
  requiredFilesPresent: missing.length === 0,
  centerReady: component.includes("RevenueMarginIntelligenceCenter"),
  matrixReady: component.includes("REVENUE MARGIN MATRIX"),
  filteringReady: component.includes("visibleRecords"),
  pricingReady: component.includes("pricingMode"),
  intelligenceReady: component.includes("AVOS REVENUE INTELLIGENCE"),
  recordsSeeded: (data.match(/id: "RM-/g) ?? []).length >= 5,
};

const success = Object.values(checks).every(Boolean);

process.stdout.write(JSON.stringify({
  success,
  system: "AVOS Web Platform V3",
  megaPack: "Mega Pack 26",
  version: "3.26.0",
  classification: "enterprise-revenue-margin-intelligence-layer",
  checks,
  missing,
  healthStatus: success ? "healthy" : "unhealthy",
}));

if (!success) process.exit(1);
