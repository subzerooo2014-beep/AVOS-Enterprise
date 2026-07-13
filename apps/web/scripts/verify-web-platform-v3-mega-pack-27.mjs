import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const required = [
  "src/app/customer-value-retention/page.tsx",
  "src/components/customer-value-retention/customer-value-retention-center.tsx",
  "src/components/customer-value-retention/customer-value-retention.module.css",
  "src/data/customer-value-retention.ts",
  "src/store/customer-value-retention-store.ts",
];

const missing = required.filter((file) => !fs.existsSync(path.join(root, file)));
const read = (file) => fs.readFileSync(path.join(root, file), "utf8");
const component = missing.length ? "" : read(required[1]);
const data = missing.length ? "" : read(required[3]);

const checks = {
  requiredFilesPresent: missing.length === 0,
  centerReady: component.includes("CustomerValueRetentionCenter"),
  matrixReady: component.includes("CUSTOMER VALUE MATRIX"),
  filteringReady: component.includes("visibleCustomers"),
  churnReady: component.includes("churnRisk"),
  intelligenceReady: component.includes("AVOS RETENTION INTELLIGENCE"),
  customersSeeded: (data.match(/id: "CV-/g) ?? []).length >= 5,
};

const success = Object.values(checks).every(Boolean);

process.stdout.write(JSON.stringify({
  success,
  system: "AVOS Web Platform V3",
  megaPack: "Mega Pack 27",
  version: "3.27.0",
  classification: "enterprise-customer-value-retention-intelligence-layer",
  checks,
  missing,
  healthStatus: success ? "healthy" : "unhealthy",
}));

if (!success) process.exit(1);
