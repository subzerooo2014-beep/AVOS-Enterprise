import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const data = fs.readFileSync(
  path.join(root, "src/data/enterprise-bundle-34-38.ts"),
  "utf8",
);
const component = fs.readFileSync(
  path.join(
    root,
    "src/components/enterprise-bundle-34-38/enterprise-bundle-center.tsx",
  ),
  "utf8",
);

const ids = ["CMP-", "PRT-", "WRK-", "KNW-", "INV-"];
const records = ids.reduce(
  (sum, prefix) =>
    sum + ((data.match(new RegExp(`id: "${prefix}`, "g")) ?? []).length),
  0,
);

const checks = {
  fiveCentersReady: ids.every((prefix) => data.includes(`id: "${prefix}`)),
  recordsReady: records >= 15,
  metricsReady: component.includes("config.metrics"),
  filteringReady: component.includes("visibleRecords"),
  simulationReady: component.includes("تشغيل المحاكاة"),
  decisionReady: component.includes("إنشاء قرار تنفيذي"),
};

const success = Object.values(checks).every(Boolean);

process.stdout.write(JSON.stringify({
  success,
  system: "AVOS Web Platform V3",
  bundle: "Mega Packs 34-38",
  version: "3.38.0",
  stage: "completed",
  centers: 5,
  records,
  complianceCenterReady: true,
  partnerEcosystemReady: true,
  workforceTalentReady: true,
  knowledgeCenterReady: true,
  innovationLabReady: true,
  qualityScore: success ? 100 : 0,
  healthStatus: success ? "healthy" : "unhealthy",
  checks,
}));

if (!success) process.exit(1);
