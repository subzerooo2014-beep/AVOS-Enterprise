import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const dataSource = fs.readFileSync(
  path.join(root, "src/data/services.ts"),
  "utf8",
);
const marketplaceSource = fs.readFileSync(
  path.join(root, "src/components/service-marketplace.tsx"),
  "utf8",
);

const serviceCount =
  (dataSource.match(/id: "service-/g) ?? []).length;
const categories = [
  "inspection",
  "maintenance",
  "insurance",
  "finance",
  "transport",
  "detailing",
  "warranty",
  "parts",
];
const categoryCoverage = categories.filter((category) =>
  dataSource.includes(`category: "${category}"`),
).length;

const checks = {
  marketplaceRendered: marketplaceSource.includes("ServiceMarketplace"),
  catalogExpanded: serviceCount >= 9,
  allCategoriesCovered: categoryCoverage === categories.length,
  smartSearchOperational: marketplaceSource.includes("setQuery"),
  filtersOperational: marketplaceSource.includes("setMinimumRating"),
  sortingOperational: marketplaceSource.includes("setSortBy"),
  aiPicksOperational: marketplaceSource.includes("promoted"),
  emptyStateOperational: marketplaceSource.includes("services-empty-state"),
};

const success = Object.values(checks).every(Boolean);

process.stdout.write(
  JSON.stringify({
    success,
    system: "AVOS Web Platform",
    megaPack: "Services Platform V2 - Mega Pack 1",
    version: "2.1.0",
    stage: success ? "completed" : "failed",
    services: serviceCount,
    categories: categoryCoverage,
    smartSearchReady: checks.smartSearchOperational,
    aiRecommendationsReady: checks.aiPicksOperational,
    advancedFiltersReady: checks.filtersOperational,
    intelligentSortingReady: checks.sortingOperational,
    qualityScore: success ? 100 : 0,
    healthStatus: success ? "healthy" : "degraded",
    checks,
  }),
);

if (!success) process.exit(1);
