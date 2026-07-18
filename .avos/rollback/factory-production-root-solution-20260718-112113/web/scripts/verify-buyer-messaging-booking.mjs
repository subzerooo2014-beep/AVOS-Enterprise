import fs from "node:fs";
import path from "node:path";

const root = process.cwd();

const requiredFiles = [
  "src/app/account/page.tsx",
  "src/app/account/saved/page.tsx",
  "src/app/account/messages/page.tsx",
  "src/app/account/bookings/page.tsx",
  "src/app/account/offers/page.tsx",
  "src/components/buyer-message-center.tsx",
  "src/components/booking-form.tsx",
  "src/store/buyer-account-store.ts",
  "src/data/messages.ts",
  "src/data/bookings.ts",
];

const missingFiles = requiredFiles.filter(
  (file) => !fs.existsSync(path.join(root, file)),
);

const checks = {
  requiredFilesPresent:
    missingFiles.length === 0,
  accountDashboardReady:
    fs.existsSync(
      path.join(
        root,
        "src/app/account/page.tsx",
      ),
    ),
  messagingReady:
    fs.existsSync(
      path.join(
        root,
        "src/components/buyer-message-center.tsx",
      ),
    ),
  bookingReady:
    fs.existsSync(
      path.join(
        root,
        "src/components/booking-form.tsx",
      ),
    ),
  buyerStoreReady:
    fs.existsSync(
      path.join(
        root,
        "src/store/buyer-account-store.ts",
      ),
    ),
};

const success =
  Object.values(checks).every(Boolean);

process.stdout.write(JSON.stringify({
  success,
  system: "AVOS Web Platform",
  megaPack:
    "Buyer Messaging Booking - Mega Pack 5",
  version: "1.5.0",
  requiredFiles: requiredFiles.length,
  missingFiles,
  checks,
}));

if (!success) process.exit(1);
