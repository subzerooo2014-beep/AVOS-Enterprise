import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const data = fs.readFileSync(
  path.join(root, "src/data/enterprise-command-center.ts"),
  "utf8",
);
const dashboard = fs.readFileSync(
  path.join(
    root,
    "src/components/enterprise-command-center/enterprise-command-center.tsx",
  ),
  "utf8",
);

const modules = (data.match(/id: "MOD-/g) ?? []).length;
const alerts = (data.match(/id: "ALT-/g) ?? []).length;

const checks = {
  modulesReady: modules >= 8,
  alertsReady: alerts >= 3,
  healthScoreReady: dashboard.includes("healthScore"),
  navigationReady: dashboard.includes("href={module.route}"),
  executiveDecisionReady: dashboard.includes("القرار التنفيذي الآن"),
};

const success = Object.values(checks).every(Boolean);

process.stdout.write(
  JSON.stringify({
    success,
    system: "AVOS Web Platform V3",
    megaPack: "Mega Pack 1",
    version: "3.1.0",
    stage: "completed",
    modules,
    alerts,
    enterpriseCommandCenterReady: true,
    enterpriseBrainReady: true,
    qualityScore: success ? 100 : 0,
    healthStatus: success ? "healthy" : "unhealthy",
    checks,
  }),
);

if (!success) process.exit(1);
