import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const requiredFiles = [
  "src/app/enterprise-command-center/page.tsx",
  "src/components/enterprise-command-center/enterprise-command-center.tsx",
  "src/components/enterprise-command-center/enterprise-command-center.module.css",
  "src/data/enterprise-command-center.ts",
];

const missing = requiredFiles.filter(
  (file) => !fs.existsSync(path.join(root, file)),
);

const read = (file) =>
  fs.readFileSync(path.join(root, file), "utf8");

const page = missing.length ? "" : read(requiredFiles[0]);
const dashboard = missing.length ? "" : read(requiredFiles[1]);
const data = missing.length ? "" : read(requiredFiles[3]);

const checks = {
  requiredFilesPresent: missing.length === 0,
  routeReady: page.includes("EnterpriseCommandCenter"),
  systemMapReady: dashboard.includes("ENTERPRISE SYSTEM MAP"),
  enterpriseBrainReady: dashboard.includes("AVOS ENTERPRISE BRAIN"),
  alertCenterReady: dashboard.includes("LIVE ENTERPRISE ALERTS"),
  modulesSeeded: (data.match(/id: "MOD-/g) ?? []).length >= 8,
  alertsSeeded: (data.match(/id: "ALT-/g) ?? []).length >= 3,
};

const success = Object.values(checks).every(Boolean);

process.stdout.write(
  JSON.stringify({
    success,
    system: "AVOS Web Platform V3",
    megaPack: "Mega Pack 1",
    version: "3.1.0",
    classification: "unified-enterprise-command-center-layer",
    checks,
    missing,
    healthStatus: success ? "healthy" : "unhealthy",
  }),
);

if (!success) process.exit(1);
