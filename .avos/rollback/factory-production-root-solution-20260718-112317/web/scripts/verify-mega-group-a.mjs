import fs from "node:fs";
import path from "node:path";

const root = process.cwd();

const requiredFiles = [
  "src/app/auctions/page.tsx",
  "src/app/auctions/[slug]/page.tsx",
  "src/app/parts/page.tsx",
  "src/app/parts/[slug]/page.tsx",
  "src/app/rentals/page.tsx",
  "src/app/rentals/[slug]/page.tsx",
  "src/app/search/page.tsx",
  "src/components/live-bid-panel.tsx",
  "src/components/global-search-box.tsx",
  "src/lib/global-search.ts",
  "src/store/auction-store.ts",
];

const missingFiles = requiredFiles.filter(
  (file) => !fs.existsSync(path.join(root, file)),
);

const checks = {
  requiredFilesPresent:
    missingFiles.length === 0,
  auctionsReady:
    fs.existsSync(
      path.join(
        root,
        "src/app/auctions/page.tsx",
      ),
    ),
  partsReady:
    fs.existsSync(
      path.join(
        root,
        "src/app/parts/page.tsx",
      ),
    ),
  rentalsReady:
    fs.existsSync(
      path.join(
        root,
        "src/app/rentals/page.tsx",
      ),
    ),
  universalSearchReady:
    fs.existsSync(
      path.join(
        root,
        "src/lib/global-search.ts",
      ),
    ),
  autoBidReady:
    fs.existsSync(
      path.join(
        root,
        "src/store/auction-store.ts",
      ),
    ),
};

const success =
  Object.values(checks).every(Boolean);

process.stdout.write(JSON.stringify({
  success,
  system: "AVOS Web Platform",
  megaGroup: "Mega Group A - Packs 7-10",
  version: "1.10.0",
  requiredFiles: requiredFiles.length,
  missingFiles,
  checks,
}));

if (!success) process.exit(1);
