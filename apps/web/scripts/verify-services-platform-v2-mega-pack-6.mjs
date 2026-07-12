import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const requiredFiles = [
  "src/app/service-provider-performance/page.tsx",
  "src/components/service-provider-performance/service-provider-performance-dashboard.tsx",
  "src/components/service-provider-performance/service-provider-performance.module.css",
  "src/data/service-provider-performance.ts",
  "src/store/service-provider-performance-store.ts",
];

const missing = requiredFiles.filter(
  (file) => !fs.existsSync(path.join(root, file)),
);

const read = (file) =>
  fs.readFileSync(path.join(root, file), "utf8");

const page = missing.length
  ? ""
  : read("src/app/service-provider-performance/page.tsx");
const dashboard = missing.length
  ? ""
  : read(
      "src/components/service-provider-performance/service-provider-performance-dashboard.tsx",
    );
const data = missing.length
  ? ""
  : read("src/data/service-provider-performance.ts");
const store = missing.length
  ? ""
  : read("src/store/service-provider-performance-store.ts");
const styles = missing.length
  ? ""
  : read(
      "src/components/service-provider-performance/service-provider-performance.module.css",
    );

const checks = {
  requiredFilesPresent: missing.length === 0,
  routeReady:
    page.includes("ServiceProviderPerformanceDashboard") &&
    page.includes("أداء مزودي الخدمات"),
  providerCommandCenterReady:
    dashboard.includes("PROVIDER NETWORK COMMAND") &&
    dashboard.includes("ServiceProviderPerformanceDashboard"),
  slaIntelligenceReady:
    dashboard.includes("SLA INCIDENT & ESCALATION CENTER") &&
    data.includes("slaCompliance"),
  escalationCenterReady:
    dashboard.includes("openEscalations") &&
    data.includes("SlaIncident"),
  providerAiDecisionReady:
    dashboard.includes("AVOS AI PROVIDER DECISION") &&
    data.includes("aiDecision"),
  smartFilteringReady:
    dashboard.includes("visibleProviders") &&
    store.includes("resetFilters"),
  responsiveExperienceReady:
    styles.includes("@media (max-width: 760px)"),
};

const success = Object.values(checks).every(Boolean);

process.stdout.write(
  JSON.stringify({
    success,
    system: "AVOS Web Platform",
    megaPack: "Services Platform V2 - Mega Pack 6",
    version: "2.6.0",
    classification:
      "provider-performance-sla-risk-escalation-layer",
    requiredFiles: requiredFiles.length,
    missing,
    checks,
    healthStatus: success ? "healthy" : "unhealthy",
  }),
);

if (!success) process.exit(1);
