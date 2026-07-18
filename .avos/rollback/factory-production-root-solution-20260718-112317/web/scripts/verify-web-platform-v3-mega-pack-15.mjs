import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const required = [
  "src/app/user-role-experience/page.tsx",
  "src/components/user-role-experience/user-role-experience-center.tsx",
  "src/components/user-role-experience/user-role-experience.module.css",
  "src/data/user-role-experience.ts",
  "src/store/user-role-experience-store.ts",
];

const missing = required.filter((file) => !fs.existsSync(path.join(root, file)));
const read = (file) => fs.readFileSync(path.join(root, file), "utf8");
const component = missing.length ? "" : read(required[1]);
const data = missing.length ? "" : read(required[3]);

const checks = {
  requiredFilesPresent: missing.length === 0,
  centerReady: component.includes("UserRoleExperienceCenter"),
  directoryReady: component.includes("ENTERPRISE USER DIRECTORY"),
  filteringReady: component.includes("visibleUsers"),
  mfaReady: component.includes("mfaEnabled"),
  permissionsReady: component.includes("permissions"),
  usersSeeded: (data.match(/id: "USR-/g) ?? []).length >= 5,
};

const success = Object.values(checks).every(Boolean);
process.stdout.write(JSON.stringify({
  success,
  system: "AVOS Web Platform V3",
  megaPack: "Mega Pack 15",
  version: "3.15.0",
  checks,
  missing,
  healthStatus: success ? "healthy" : "unhealthy",
}));
if (!success) process.exit(1);
