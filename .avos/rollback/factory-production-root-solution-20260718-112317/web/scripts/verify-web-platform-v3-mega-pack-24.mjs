import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const required = [
  "src/app/service-health-observability/page.tsx",
  "src/components/service-health-observability/service-health-observability-center.tsx",
  "src/components/service-health-observability/service-health-observability.module.css",
  "src/data/service-health-observability.ts",
  "src/store/service-health-observability-store.ts",
];

const missing = required.filter((file) => !fs.existsSync(path.join(root, file)));
const read = (file) => fs.readFileSync(path.join(root, file), "utf8");
const component = missing.length ? "" : read(required[1]);
const data = missing.length ? "" : read(required[3]);

const checks = {
  requiredFilesPresent: missing.length === 0,
  centerReady: component.includes("ServiceHealthObservabilityCenter"),
  matrixReady: component.includes("SERVICE HEALTH MATRIX"),
  filteringReady: component.includes("visibleServices"),
  dependencyReady: component.includes("dependencies"),
  intelligenceReady: component.includes("AVOS OBSERVABILITY INTELLIGENCE"),
  servicesSeeded: (data.match(/id: "SH-/g) ?? []).length >= 5,
};

const success = Object.values(checks).every(Boolean);

process.stdout.write(JSON.stringify({
  success,
  system: "AVOS Web Platform V3",
  megaPack: "Mega Pack 24",
  version: "3.24.0",
  classification: "enterprise-service-health-observability-layer",
  checks,
  missing,
  healthStatus: success ? "healthy" : "unhealthy",
}));

if (!success) process.exit(1);
