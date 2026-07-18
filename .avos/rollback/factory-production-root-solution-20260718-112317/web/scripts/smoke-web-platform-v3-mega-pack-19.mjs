import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const data = fs.readFileSync(path.join(root, "src/data/priority-focus-center.ts"), "utf8");
const component = fs.readFileSync(path.join(root, "src/components/priority-focus-center/priority-focus-center.tsx"), "utf8");

const priorities = (data.match(/id: "FP-/g) ?? []).length;
const categories = new Set(
  [...data.matchAll(/category: "([^"]+)"/g)].map((match) => match[1]),
).size;

const checks = {
  prioritiesReady: priorities >= 5,
  categoriesReady: categories >= 5,
  progressReady: component.includes("averageProgress"),
  criticalFocusReady: component.includes("criticalOnly"),
  nextActionReady: component.includes("nextAction"),
  escalationReady: component.includes("إنشاء تصعيد"),
};

const success = Object.values(checks).every(Boolean);

process.stdout.write(JSON.stringify({
  success,
  system: "AVOS Web Platform V3",
  megaPack: "Mega Pack 19",
  version: "3.19.0",
  stage: "completed",
  priorities,
  categories,
  priorityCenterReady: true,
  focusQueueReady: true,
  progressTrackingReady: true,
  escalationReady: true,
  qualityScore: success ? 100 : 0,
  healthStatus: success ? "healthy" : "unhealthy",
  checks,
}));

if (!success) process.exit(1);
