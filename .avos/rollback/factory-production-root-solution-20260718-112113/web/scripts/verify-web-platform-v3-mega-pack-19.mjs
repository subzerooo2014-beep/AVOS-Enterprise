import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const required = [
  "src/app/priority-focus-center/page.tsx",
  "src/components/priority-focus-center/priority-focus-center.tsx",
  "src/components/priority-focus-center/priority-focus-center.module.css",
  "src/data/priority-focus-center.ts",
  "src/store/priority-focus-center-store.ts",
];

const missing = required.filter((file) => !fs.existsSync(path.join(root, file)));
const read = (file) => fs.readFileSync(path.join(root, file), "utf8");
const component = missing.length ? "" : read(required[1]);
const data = missing.length ? "" : read(required[3]);

const checks = {
  requiredFilesPresent: missing.length === 0,
  centerReady: component.includes("PriorityFocusCenter"),
  queueReady: component.includes("EXECUTIVE FOCUS QUEUE"),
  filteringReady: component.includes("visiblePriorities"),
  progressReady: component.includes("item.progress"),
  intelligenceReady: component.includes("AVOS FOCUS INTELLIGENCE"),
  prioritiesSeeded: (data.match(/id: "FP-/g) ?? []).length >= 5,
};

const success = Object.values(checks).every(Boolean);

process.stdout.write(JSON.stringify({
  success,
  system: "AVOS Web Platform V3",
  megaPack: "Mega Pack 19",
  version: "3.19.0",
  classification: "enterprise-priority-focus-layer",
  checks,
  missing,
  healthStatus: success ? "healthy" : "unhealthy",
}));

if (!success) process.exit(1);
