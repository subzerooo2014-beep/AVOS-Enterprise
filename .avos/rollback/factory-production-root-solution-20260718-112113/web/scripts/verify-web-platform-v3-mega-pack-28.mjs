import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const required = [
  "src/app/loyalty-membership-intelligence/page.tsx",
  "src/components/loyalty-membership-intelligence/loyalty-membership-intelligence-center.tsx",
  "src/components/loyalty-membership-intelligence/loyalty-membership-intelligence.module.css",
  "src/data/loyalty-membership-intelligence.ts",
  "src/store/loyalty-membership-intelligence-store.ts",
];

const missing = required.filter((file) => !fs.existsSync(path.join(root, file)));
const read = (file) => fs.readFileSync(path.join(root, file), "utf8");
const component = missing.length ? "" : read(required[1]);
const data = missing.length ? "" : read(required[3]);

const checks = {
  requiredFilesPresent: missing.length === 0,
  centerReady: component.includes("LoyaltyMembershipIntelligenceCenter"),
  matrixReady: component.includes("LOYALTY MEMBER MATRIX"),
  filteringReady: component.includes("visibleMembers"),
  pointsReady: component.includes("member.points"),
  intelligenceReady: component.includes("AVOS LOYALTY INTELLIGENCE"),
  membersSeeded: (data.match(/id: "LM-/g) ?? []).length >= 5,
};

const success = Object.values(checks).every(Boolean);

process.stdout.write(JSON.stringify({
  success,
  system: "AVOS Web Platform V3",
  megaPack: "Mega Pack 28",
  version: "3.28.0",
  classification: "enterprise-loyalty-membership-intelligence-layer",
  checks,
  missing,
  healthStatus: success ? "healthy" : "unhealthy",
}));

if (!success) process.exit(1);
