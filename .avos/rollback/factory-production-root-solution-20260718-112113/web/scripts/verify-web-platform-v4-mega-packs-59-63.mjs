import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const required = [
  "src/app/strategic-planner-command/page.tsx",
  "src/app/resilience-laboratory/page.tsx",
  "src/app/enterprise-coach-center/page.tsx",
  "src/app/knowledge-academy-command/page.tsx",
  "src/app/legacy-modernization-command/page.tsx",
  "src/components/web-platform-v4-59-63/web-platform-v4-center.tsx",
  "src/components/web-platform-v4-59-63/web-platform-v4-center.module.css",
  "src/data/web-platform-v4-59-63.ts"
];

const missing = required.filter((file) => !fs.existsSync(path.join(root, file)));
const read = (file) => fs.readFileSync(path.join(root, file), "utf8");
const component = missing.length ? "" : read(required[5]);
const data = missing.length ? "" : read(required[7]);

const checks = {
  requiredFilesPresent: missing.length === 0,
  sharedCenterReady: component.includes("WebPlatformV4Center"),
  strategicPlannerReady: data.includes("STR-5901"),
  resilienceLabReady: data.includes("RES-6001"),
  enterpriseCoachReady: data.includes("COA-6101"),
  knowledgeAcademyReady: data.includes("KNO-6201"),
  legacyModernizationReady: data.includes("MOD-6301"),
  executiveIntelligenceReady: component.includes("AVOS EXECUTIVE INTELLIGENCE")
};

const success = Object.values(checks).every(Boolean);
process.stdout.write(JSON.stringify({
  success,
  system: "AVOS Web Platform V4",
  bundle: "Mega Packs 59-63",
  version: "4.63.0",
  classification: "strategy-resilience-coaching-knowledge-modernization-bundle",
  centers: 5,
  checks,
  missing,
  healthStatus: success ? "healthy" : "unhealthy"
}));

if (!success) process.exit(1);
