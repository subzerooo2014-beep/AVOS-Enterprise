import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const required = [
  "src/app/incident-response-center/page.tsx",
  "src/components/incident-response-center/incident-response-center.tsx",
  "src/components/incident-response-center/incident-response-center.module.css",
  "src/data/incident-response-center.ts",
  "src/store/incident-response-center-store.ts",
];

const missing = required.filter((file) => !fs.existsSync(path.join(root, file)));
const read = (file) => fs.readFileSync(path.join(root, file), "utf8");
const component = missing.length ? "" : read(required[1]);
const data = missing.length ? "" : read(required[3]);

const checks = {
  requiredFilesPresent: missing.length === 0,
  centerReady: component.includes("IncidentResponseCenter"),
  responseQueueReady: component.includes("INCIDENT RESPONSE QUEUE"),
  filteringReady: component.includes("visibleIncidents"),
  playbookReady: component.includes("تشغيل Playbook"),
  intelligenceReady: component.includes("AVOS INCIDENT INTELLIGENCE"),
  incidentsSeeded: (data.match(/id: "INC-/g) ?? []).length >= 5,
};

const success = Object.values(checks).every(Boolean);

process.stdout.write(JSON.stringify({
  success,
  system: "AVOS Web Platform V3",
  megaPack: "Mega Pack 20",
  version: "3.20.0",
  classification: "enterprise-incident-response-layer",
  checks,
  missing,
  healthStatus: success ? "healthy" : "unhealthy",
}));

if (!success) process.exit(1);
