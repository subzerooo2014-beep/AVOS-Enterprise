import fs from "node:fs";
import path from "node:path";

const root = process.cwd();

const requiredFiles = [
  "src/app/vehicles/page.tsx",
  "src/app/vehicles/[slug]/page.tsx",
  "src/components/vehicle-card.tsx",
  "src/components/vehicle-filters.tsx",
  "src/components/vehicle-marketplace.tsx",
  "src/data/vehicles.ts",
  "src/lib/vehicle-search.ts",
  "src/store/vehicle-search-store.ts",
];

const missing = requiredFiles.filter(
  (file) => !fs.existsSync(path.join(root, file)),
);

const vehiclesSource = fs.readFileSync(
  path.join(root, "src/data/vehicles.ts"),
  "utf8",
);

const checks = {
  requiredFilesPresent: missing.length === 0,
  vehicleDatasetPresent:
    vehiclesSource.includes("veh-001") &&
    vehiclesSource.includes("veh-008"),
  marketplaceRoutePresent: fs.existsSync(
    path.join(root, "src/app/vehicles/page.tsx"),
  ),
  detailsRoutePresent: fs.existsSync(
    path.join(
      root,
      "src/app/vehicles/[slug]/page.tsx",
    ),
  ),
  zustandStorePresent: fs.existsSync(
    path.join(
      root,
      "src/store/vehicle-search-store.ts",
    ),
  ),
};

const success = Object.values(checks).every(Boolean);

process.stdout.write(
  JSON.stringify({
    success,
    system: "AVOS Web Platform",
    megaPack: "Vehicle Marketplace Core - Mega Pack 2",
    version: "1.2.0",
    requiredFiles: requiredFiles.length,
    missingFiles: missing,
    checks,
  }),
);

if (!success) {
  process.exit(1);
}
