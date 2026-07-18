import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const required = [
  "src/app/dashboard-widgets/page.tsx",
  "src/components/dashboard-widgets/dashboard-widgets-center.tsx",
  "src/components/dashboard-widgets/dashboard-widgets.module.css",
  "src/data/dashboard-widgets.ts",
  "src/store/dashboard-widgets-store.ts",
];

const missing = required.filter((file) => !fs.existsSync(path.join(root, file)));
const read = (file) => fs.readFileSync(path.join(root, file), "utf8");
const component = missing.length ? "" : read(required[1]);
const data = missing.length ? "" : read(required[3]);
const store = missing.length ? "" : read(required[4]);

const checks = {
  requiredFilesPresent: missing.length === 0,
  widgetCenterReady: component.includes("DashboardWidgetsCenter"),
  filteringReady: component.includes("visibleWidgets"),
  compactModeReady: component.includes("compactMode") && store.includes("toggleCompactMode"),
  pinningReady: component.includes("pinnedOnly"),
  categoriesReady: data.includes("widgetCategoryLabels"),
  widgetsSeeded: (data.match(/id: "DW-/g) ?? []).length >= 6,
};

const success = Object.values(checks).every(Boolean);

process.stdout.write(JSON.stringify({
  success,
  system: "AVOS Web Platform V3",
  megaPack: "Mega Pack 6",
  version: "3.6.0",
  classification: "global-dashboard-widgets-layer",
  checks,
  missing,
  healthStatus: success ? "healthy" : "unhealthy",
}));

if (!success) process.exit(1);
