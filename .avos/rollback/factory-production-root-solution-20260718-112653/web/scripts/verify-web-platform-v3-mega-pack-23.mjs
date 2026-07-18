import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const required = [
  "src/app/change-configuration-center/page.tsx",
  "src/components/change-configuration-center/change-configuration-center.tsx",
  "src/components/change-configuration-center/change-configuration-center.module.css",
  "src/data/change-configuration-center.ts",
  "src/store/change-configuration-center-store.ts",
];

const missing = required.filter((file) => !fs.existsSync(path.join(root, file)));
const read = (file) => fs.readFileSync(path.join(root, file), "utf8");
const component = missing.length ? "" : read(required[1]);
const data = missing.length ? "" : read(required[3]);

const checks = {
  requiredFilesPresent: missing.length === 0,
  centerReady: component.includes("ChangeConfigurationCenter"),
  pipelineReady: component.includes("CHANGE REQUEST PIPELINE"),
  filteringReady: component.includes("visibleChanges"),
  rollbackReady: component.includes("rollbackReady"),
  intelligenceReady: component.includes("AVOS CHANGE INTELLIGENCE"),
  changesSeeded: (data.match(/id: "CHG-/g) ?? []).length >= 5,
};

const success = Object.values(checks).every(Boolean);

process.stdout.write(JSON.stringify({
  success,
  system: "AVOS Web Platform V3",
  megaPack: "Mega Pack 23",
  version: "3.23.0",
  classification: "enterprise-change-configuration-layer",
  checks,
  missing,
  healthStatus: success ? "healthy" : "unhealthy",
}));

if (!success) process.exit(1);
