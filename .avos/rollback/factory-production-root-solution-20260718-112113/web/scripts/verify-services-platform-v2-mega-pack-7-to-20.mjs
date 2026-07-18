import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const slugs = [
  "service-marketplace-intelligence",
  "service-pricing-revenue",
  "service-capacity-dispatch",
  "service-fleet-operations",
  "service-parts-supply",
  "service-workforce",
  "service-compliance-safety",
  "service-contracts-sla",
  "service-customer-lifecycle",
  "service-partner-growth",
  "service-risk-resilience",
  "service-automation-center",
  "service-ai-copilot",
  "service-executive-command",
];

const requiredFiles = [
  "src/components/service-platform-accelerated/service-platform-accelerated-dashboard.tsx",
  "src/components/service-platform-accelerated/service-platform-accelerated.module.css",
  "src/data/service-platform-accelerated.ts",
  ...slugs.map((slug) => `src/app/${slug}/page.tsx`),
];

const missing = requiredFiles.filter(
  (file) => !fs.existsSync(path.join(root, file)),
);

const dashboard = missing.length
  ? ""
  : fs.readFileSync(
      path.join(
        root,
        "src/components/service-platform-accelerated/service-platform-accelerated-dashboard.tsx",
      ),
      "utf8",
    );

const data = missing.length
  ? ""
  : fs.readFileSync(
      path.join(root, "src/data/service-platform-accelerated.ts"),
      "utf8",
    );

const checks = {
  requiredFilesPresent: missing.length === 0,
  allRoutesReady: slugs.every((slug) =>
    fs.existsSync(path.join(root, `src/app/${slug}/page.tsx`)),
  ),
  sharedDashboardReady:
    dashboard.includes("ServicePlatformAcceleratedDashboard") &&
    dashboard.includes("AVOS AI DECISION ENGINE"),
  allMegaPacksRegistered:
    Array.from({ length: 14 }, (_, index) => index + 7).every(
      (pack) => data.includes(`megaPack: ${pack}`),
    ),
  responsiveExperienceReady: fs
    .readFileSync(
      path.join(
        root,
        "src/components/service-platform-accelerated/service-platform-accelerated.module.css",
      ),
      "utf8",
    )
    .includes("@media (max-width: 720px)"),
};

const success = Object.values(checks).every(Boolean);

process.stdout.write(
  JSON.stringify({
    success,
    system: "AVOS Web Platform",
    bundle: "Services Platform V2 - Mega Pack 7 to 20",
    version: "2.20.0",
    classification:
      "accelerated-multi-domain-services-operating-layer",
    routes: slugs.length,
    requiredFiles: requiredFiles.length,
    missing,
    checks,
    healthStatus: success ? "healthy" : "unhealthy",
  }),
);

if (!success) process.exit(1);
