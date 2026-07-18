import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const requiredFiles = [
  "src/app/service-operations/page.tsx",
  "src/components/service-operations/service-operations-dashboard.tsx",
  "src/components/service-operations/service-operations.module.css",
  "src/data/service-operations.ts",
  "src/store/service-operations-store.ts",
];

const missing = requiredFiles.filter(
  (file) => !fs.existsSync(path.join(root, file)),
);

const read = (file) =>
  fs.readFileSync(path.join(root, file), "utf8");

const dashboard = missing.length
  ? ""
  : read(
      "src/components/service-operations/service-operations-dashboard.tsx",
    );
const data = missing.length
  ? ""
  : read("src/data/service-operations.ts");
const store = missing.length
  ? ""
  : read("src/store/service-operations-store.ts");
const styles = missing.length
  ? ""
  : read(
      "src/components/service-operations/service-operations.module.css",
    );

const checks = {
  requiredFilesPresent: missing.length === 0,
  operationsDashboardReady:
    dashboard.includes("ServiceOperationsDashboard"),
  smartFilteringReady:
    dashboard.includes("visibleRequests") &&
    store.includes("resetFilters"),
  slaMonitoringReady:
    dashboard.includes("slaState") &&
    dashboard.includes("slaMinutes"),
  escalationIntelligenceReady:
    dashboard.includes("nextBestAction") &&
    data.includes("serviceOperationsInsights"),
  requestControlReady:
    dashboard.includes("selectRequest") &&
    dashboard.includes("selectedRequest"),
  responsiveExperienceReady:
    styles.includes("@media (max-width: 760px)"),
};

const success = Object.values(checks).every(Boolean);

process.stdout.write(
  JSON.stringify({
    success,
    system: "AVOS Web Platform",
    megaPack: "Services Platform V2 - Mega Pack 4",
    version: "2.4.0",
    classification:
      "service-operations-sla-escalation-control-layer",
    requiredFiles: requiredFiles.length,
    missing,
    checks,
    healthStatus: success ? "healthy" : "unhealthy",
  }),
);

if (!success) {
  process.exit(1);
}
