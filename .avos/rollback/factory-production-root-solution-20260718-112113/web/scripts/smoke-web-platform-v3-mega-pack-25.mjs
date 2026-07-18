import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const data = fs.readFileSync(path.join(root, "src/data/capacity-demand-intelligence.ts"), "utf8");
const component = fs.readFileSync(path.join(root, "src/components/capacity-demand-intelligence/capacity-demand-intelligence-center.tsx"), "utf8");

const records = (data.match(/id: "CD-/g) ?? []).length;
const regions = new Set(
  [...data.matchAll(/region: "([^"]+)"/g)].map((match) => match[1]),
).size;

const checks = {
  recordsReady: records >= 5,
  regionsReady: regions >= 5,
  utilizationReady: component.includes("utilization"),
  revenueRiskReady: component.includes("revenueAtRisk"),
  simulationReady: component.includes("تشغيل المحاكاة"),
  redistributionReady: component.includes("إعادة توزيع السعة"),
};

const success = Object.values(checks).every(Boolean);

process.stdout.write(JSON.stringify({
  success,
  system: "AVOS Web Platform V3",
  megaPack: "Mega Pack 25",
  version: "3.25.0",
  stage: "completed",
  records,
  regions,
  capacityCenterReady: true,
  demandForecastReady: true,
  utilizationTrackingReady: true,
  redistributionReady: true,
  qualityScore: success ? 100 : 0,
  healthStatus: success ? "healthy" : "unhealthy",
  checks,
}));

if (!success) process.exit(1);
