import fs from "node:fs";
import path from "node:path";

const root = process.cwd();

const requiredFiles = [
  "src/app/seller/page.tsx",
  "src/app/seller/inventory/page.tsx",
  "src/app/seller/leads/page.tsx",
  "src/app/seller/listings/new/page.tsx",
  "src/components/seller-lead-board.tsx",
  "src/components/smart-listing-form.tsx",
  "src/components/finance-calculator.tsx",
  "src/components/smart-offer-panel.tsx",
  "src/lib/commerce-intelligence.ts",
];

const missingFiles = requiredFiles.filter(
  (file) => !fs.existsSync(path.join(root, file)),
);

const commerce = fs.readFileSync(
  path.join(root, "src/lib/commerce-intelligence.ts"),
  "utf8",
);

const checks = {
  requiredFilesPresent: missingFiles.length === 0,
  sellerWorkspaceReady: fs.existsSync(
    path.join(root, "src/app/seller/page.tsx"),
  ),
  leadBoardReady: fs.existsSync(
    path.join(root, "src/components/seller-lead-board.tsx"),
  ),
  financeReady:
    commerce.includes("calculateFinanceQuote"),
  negotiationReady:
    commerce.includes("calculateSmartOffer"),
};

const success = Object.values(checks).every(Boolean);

process.stdout.write(JSON.stringify({
  success,
  system: "AVOS Web Platform",
  megaPack:
    "Seller Commerce Lead Intelligence - Mega Pack 4",
  version: "1.4.0",
  requiredFiles: requiredFiles.length,
  missingFiles,
  checks,
}));

if (!success) process.exit(1);
