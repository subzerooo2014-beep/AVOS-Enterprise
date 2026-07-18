import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const requiredFiles = [
  "src/app/service-quality/page.tsx",
  "src/components/service-quality/service-quality-dashboard.tsx",
  "src/components/service-quality/service-quality.module.css",
  "src/data/service-quality.ts",
  "src/store/service-quality-store.ts",
];

const missing = requiredFiles.filter(
  (file) => !fs.existsSync(path.join(root, file)),
);

const read = (file) =>
  fs.readFileSync(path.join(root, file), "utf8");

const page = missing.length
  ? ""
  : read("src/app/service-quality/page.tsx");
const dashboard = missing.length
  ? ""
  : read(
      "src/components/service-quality/service-quality-dashboard.tsx",
    );
const data = missing.length
  ? ""
  : read("src/data/service-quality.ts");
const store = missing.length
  ? ""
  : read("src/store/service-quality-store.ts");
const styles = missing.length
  ? ""
  : read(
      "src/components/service-quality/service-quality.module.css",
    );

const checks = {
  requiredFilesPresent: missing.length === 0,
  routeReady:
    page.includes("ServiceQualityDashboard") &&
    page.includes("جودة الخدمات"),
  qualityCommandCenterReady:
    dashboard.includes("ServiceQualityDashboard") &&
    dashboard.includes("QUALITY CASE COMMAND"),
  voiceOfCustomerReady:
    dashboard.includes("VOICE OF CUSTOMER") &&
    data.includes("qualitySurveys"),
  recoveryEngineReady:
    dashboard.includes("AVOS AI RECOVERY PLAN") &&
    data.includes("recoveryPlan"),
  rootCauseIntelligenceReady:
    dashboard.includes("ROOT CAUSE INTELLIGENCE") &&
    data.includes("rootCause"),
  smartFilteringReady:
    dashboard.includes("visibleCases") &&
    store.includes("resetFilters"),
  responsiveExperienceReady:
    styles.includes("@media (max-width: 760px)"),
};

const success = Object.values(checks).every(Boolean);

process.stdout.write(
  JSON.stringify({
    success,
    system: "AVOS Web Platform",
    megaPack: "Services Platform V2 - Mega Pack 5",
    version: "2.5.0",
    classification:
      "service-quality-customer-experience-recovery-layer",
    requiredFiles: requiredFiles.length,
    missing,
    checks,
    healthStatus: success ? "healthy" : "unhealthy",
  }),
);

if (!success) {
  process.exit(1);
}
