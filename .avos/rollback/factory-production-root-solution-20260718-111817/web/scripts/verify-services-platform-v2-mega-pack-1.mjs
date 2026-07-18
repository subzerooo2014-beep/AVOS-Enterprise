import fs from "node:fs";
import path from "node:path";

const root = process.cwd();

const requiredFiles = [
  "src/app/services/page.tsx",
  "src/components/service-marketplace.tsx",
  "src/components/service-card.tsx",
  "src/data/services.ts",
  "src/store/service-marketplace-store.ts",
];

const missingFiles = requiredFiles.filter(
  (file) => !fs.existsSync(path.join(root, file)),
);

const marketplace = fs.readFileSync(
  path.join(root, "src/components/service-marketplace.tsx"),
  "utf8",
);
const servicesData = fs.readFileSync(
  path.join(root, "src/data/services.ts"),
  "utf8",
);
const styles = fs.readFileSync(
  path.join(root, "src/app/globals.css"),
  "utf8",
);

const checks = {
  requiredFilesPresent: missingFiles.length === 0,
  smartSearchReady: marketplace.includes("services-smart-search"),
  categoryNavigationReady: marketplace.includes("service-category-strip"),
  aiRecommendationsReady: marketplace.includes("services-ai-picks"),
  advancedFiltersReady:
    marketplace.includes("minimumRating") &&
    marketplace.includes("openOnly") &&
    marketplace.includes("homeOnly"),
  intelligentSortingReady: marketplace.includes("sortBy"),
  expandedServiceCatalog:
    (servicesData.match(/id: "service-/g) ?? []).length >= 9,
  responsiveStylesReady:
    styles.includes("AVOS SERVICES PLATFORM V2") &&
    styles.includes("@media (max-width: 760px)"),
};

const success = Object.values(checks).every(Boolean);

process.stdout.write(
  JSON.stringify({
    success,
    system: "AVOS Web Platform",
    megaPack: "Services Platform V2 - Mega Pack 1",
    version: "2.1.0",
    classification: "intelligent-services-marketplace-layer",
    requiredFiles: requiredFiles.length,
    missingFiles,
    capabilities: Object.keys(checks).length,
    checks,
    healthStatus: success ? "healthy" : "degraded",
  }),
);

if (!success) process.exit(1);
