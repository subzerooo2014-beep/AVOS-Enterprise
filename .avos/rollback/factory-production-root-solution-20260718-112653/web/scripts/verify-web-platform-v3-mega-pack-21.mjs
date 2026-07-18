import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const required = [
  "src/app/recovery-resilience-center/page.tsx",
  "src/components/recovery-resilience-center/recovery-resilience-center.tsx",
  "src/components/recovery-resilience-center/recovery-resilience-center.module.css",
  "src/data/recovery-resilience-center.ts",
  "src/store/recovery-resilience-center-store.ts",
];

const missing = required.filter((file) => !fs.existsSync(path.join(root, file)));
const read = (file) => fs.readFileSync(path.join(root, file), "utf8");
const component = missing.length ? "" : read(required[1]);
const data = missing.length ? "" : read(required[3]);

const checks = {
  requiredFilesPresent: missing.length === 0,
  centerReady: component.includes("RecoveryResilienceCenter"),
  libraryReady: component.includes("RESILIENCE SCENARIO LIBRARY"),
  filteringReady: component.includes("visibleScenarios"),
  recoveryMetricsReady: component.includes("currentRto"),
  intelligenceReady: component.includes("AVOS RESILIENCE INTELLIGENCE"),
  scenariosSeeded: (data.match(/id: "RR-/g) ?? []).length >= 5,
};

const success = Object.values(checks).every(Boolean);

process.stdout.write(JSON.stringify({
  success,
  system: "AVOS Web Platform V3",
  megaPack: "Mega Pack 21",
  version: "3.21.0",
  classification: "enterprise-recovery-resilience-layer",
  checks,
  missing,
  healthStatus: success ? "healthy" : "unhealthy",
}));

if (!success) process.exit(1);
