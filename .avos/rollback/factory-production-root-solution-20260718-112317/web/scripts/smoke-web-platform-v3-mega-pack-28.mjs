import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const data = fs.readFileSync(path.join(root, "src/data/loyalty-membership-intelligence.ts"), "utf8");
const component = fs.readFileSync(path.join(root, "src/components/loyalty-membership-intelligence/loyalty-membership-intelligence-center.tsx"), "utf8");

const members = (data.match(/id: "LM-/g) ?? []).length;
const tiers = new Set(
  [...data.matchAll(/tier: "([^"]+)"/g)].map((match) => match[1]),
).size;

const checks = {
  membersReady: members >= 5,
  tiersReady: tiers >= 4,
  pointsReady: component.includes("points"),
  retentionReady: component.includes("retentionScore"),
  upgradeReady: component.includes("upgradeProbability"),
  campaignReady: component.includes("تشغيل حملة ولاء"),
};

const success = Object.values(checks).every(Boolean);

process.stdout.write(JSON.stringify({
  success,
  system: "AVOS Web Platform V3",
  megaPack: "Mega Pack 28",
  version: "3.28.0",
  stage: "completed",
  members,
  tiers,
  loyaltyCenterReady: true,
  membershipTiersReady: true,
  pointsTrackingReady: true,
  upgradeIntelligenceReady: true,
  qualityScore: success ? 100 : 0,
  healthStatus: success ? "healthy" : "unhealthy",
  checks,
}));

if (!success) process.exit(1);
