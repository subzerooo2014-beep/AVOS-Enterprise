import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const required = [
  "src/app/enterprise-settings/page.tsx",
  "src/components/enterprise-settings/enterprise-settings-center.tsx",
  "src/components/enterprise-settings/enterprise-settings.module.css",
  "src/data/enterprise-settings.ts",
  "src/store/enterprise-settings-store.ts",
];

const missing = required.filter((file) => !fs.existsSync(path.join(root, file)));
const read = (file) => fs.readFileSync(path.join(root, file), "utf8");
const component = missing.length ? "" : read(required[1]);
const data = missing.length ? "" : read(required[3]);

const checks = {
  requiredFilesPresent: missing.length === 0,
  centerReady: component.includes("EnterpriseSettingsCenter"),
  filteringReady: component.includes("visibleSettings"),
  categoriesReady: data.includes("settingCategoryLabels"),
  settingsSeeded: (data.match(/id: "SET-/g) ?? []).length >= 6,
};

const success = Object.values(checks).every(Boolean);
process.stdout.write(JSON.stringify({
  success,
  system: "AVOS Web Platform V3",
  megaPack: "Mega Pack 14",
  version: "3.14.0",
  checks,
  missing,
  healthStatus: success ? "healthy" : "unhealthy",
}));
if (!success) process.exit(1);
