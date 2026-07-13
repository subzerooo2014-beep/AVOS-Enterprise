import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const required = [
  "src/app/enterprise-workspace/page.tsx",
  "src/components/enterprise-workspace/enterprise-workspace.tsx",
  "src/components/enterprise-workspace/enterprise-workspace.module.css",
  "src/data/enterprise-workspace.ts",
  "src/store/enterprise-workspace-store.ts",
];

const missing = required.filter((file) => !fs.existsSync(path.join(root, file)));
const read = (file) => fs.readFileSync(path.join(root, file), "utf8");
const component = missing.length ? "" : read(required[1]);
const data = missing.length ? "" : read(required[3]);

const checks = {
  requiredFilesPresent: missing.length === 0,
  navigationReady: component.includes("workspaceModules.map"),
  commandPaletteReady: component.includes("Ctrl K"),
  notificationsReady: component.includes("workspaceNotifications"),
  activityReady: component.includes("workspaceActivities"),
  favoritesReady: component.includes("favoritesOnly"),
  recentReady: component.includes("recentModules"),
  modulesSeeded: (data.match(/id: "WS-/g) ?? []).length >= 6,
};

const success = Object.values(checks).every(Boolean);
process.stdout.write(JSON.stringify({
  success,
  system: "AVOS Web Platform V3",
  group: "Group 1",
  megaPacks: ["2", "3", "4", "5"],
  version: "3.5.0",
  checks,
  missing,
  healthStatus: success ? "healthy" : "unhealthy",
}));
if (!success) process.exit(1);
