import fs from "node:fs";
import path from "node:path";

const root = process.cwd();

const requiredFiles = [
  "src/app/vehicles/compare/page.tsx",
  "src/app/plates/page.tsx",
  "src/components/vehicle-ai-assistant.tsx",
  "src/components/comparison-tray.tsx",
  "src/components/vehicle-intelligence-panel.tsx",
  "src/components/vehicle-service-bundle.tsx",
  "src/lib/vehicle-intelligence.ts",
  "src/data/plates.ts",
];

const missingFiles = requiredFiles.filter(
  (file) => !fs.existsSync(path.join(root, file)),
);

const checks = {
  requiredFilesPresent: missingFiles.length === 0,
  aiAssistantPresent: fs
    .readFileSync(
      path.join(
        root,
        "src/components/vehicle-ai-assistant.tsx",
      ),
      "utf8",
    )
    .includes("AVOS Vehicle Intelligence"),
  comparisonRoutePresent: fs.existsSync(
    path.join(
      root,
      "src/app/vehicles/compare/page.tsx",
    ),
  ),
  plateMarketplacePresent: fs.existsSync(
    path.join(root, "src/app/plates/page.tsx"),
  ),
  ownershipEnginePresent: fs
    .readFileSync(
      path.join(
        root,
        "src/lib/vehicle-intelligence.ts",
      ),
      "utf8",
    )
    .includes("estimateOwnership"),
};

const success = Object.values(checks).every(Boolean);

process.stdout.write(
  JSON.stringify({
    success,
    system: "AVOS Web Platform",
    megaPack:
      "Intelligent Vehicle Experience - Mega Pack 3",
    version: "1.3.0",
    requiredFiles: requiredFiles.length,
    missingFiles,
    checks,
  }),
);

if (!success) {
  process.exit(1);
}
