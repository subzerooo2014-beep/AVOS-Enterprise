import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const required = [
  "src/app/ai-command-center/page.tsx",
  "src/components/ai-command-center/ai-command-center.tsx",
  "src/components/ai-command-center/ai-command-center.module.css",
  "src/data/ai-command-center.ts",
  "src/store/ai-command-center-store.ts",
];

const missing = required.filter((file) => !fs.existsSync(path.join(root, file)));
const read = (file) => fs.readFileSync(path.join(root, file), "utf8");
const component = missing.length ? "" : read(required[1]);
const data = missing.length ? "" : read(required[3]);

const checks = {
  requiredFilesPresent: missing.length === 0,
  commandCenterReady: component.includes("AiCommandCenter"),
  recommendationFeedReady: component.includes("AI RECOMMENDATION FEED"),
  alertsReady: component.includes("CRITICAL ALERTS"),
  agendaReady: component.includes("SMART AGENDA"),
  multiOrganizationReady: component.includes("MULTI-ORGANIZATION OVERVIEW"),
  chatReady: component.includes("عزم — المساعد التنفيذي"),
  recommendationsSeeded: (data.match(/id: "REC-/g) ?? []).length >= 4,
};

const success = Object.values(checks).every(Boolean);

process.stdout.write(JSON.stringify({
  success,
  system: "AVOS Web Platform V3",
  megaPack: "Mega Pack 18",
  version: "3.18.0",
  classification: "ai-executive-command-center-layer",
  checks,
  missing,
  healthStatus: success ? "healthy" : "unhealthy",
}));

if (!success) process.exit(1);
