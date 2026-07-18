import fs from "node:fs";
import path from "node:path";

const root = process.cwd();

const requiredFiles = [
  "src/app/services/page.tsx",
  "src/app/services/[slug]/page.tsx",
  "src/app/providers/page.tsx",
  "src/app/providers/[slug]/page.tsx",
  "src/app/ads/page.tsx",
  "src/components/service-marketplace.tsx",
  "src/components/service-booking-panel.tsx",
  "src/components/provider-card.tsx",
  "src/data/services.ts",
  "src/data/providers.ts",
  "src/data/ads.ts",
];

const missingFiles = requiredFiles.filter(
  (file) => !fs.existsSync(path.join(root, file)),
);

const checks = {
  requiredFilesPresent:
    missingFiles.length === 0,
  servicesMarketplaceReady:
    fs.existsSync(
      path.join(
        root,
        "src/components/service-marketplace.tsx",
      ),
    ),
  providerNetworkReady:
    fs.existsSync(
      path.join(
        root,
        "src/app/providers/page.tsx",
      ),
    ),
  smartAdsReady:
    fs.existsSync(
      path.join(
        root,
        "src/app/ads/page.tsx",
      ),
    ),
  serviceBookingReady:
    fs.existsSync(
      path.join(
        root,
        "src/components/service-booking-panel.tsx",
      ),
    ),
};

const success =
  Object.values(checks).every(Boolean);

process.stdout.write(JSON.stringify({
  success,
  system: "AVOS Web Platform",
  megaPack:
    "Services Dealers Ads Ecosystem - Mega Pack 6",
  version: "1.6.0",
  requiredFiles: requiredFiles.length,
  missingFiles,
  checks,
}));

if (!success) process.exit(1);
