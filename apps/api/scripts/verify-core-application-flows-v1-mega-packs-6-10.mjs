import fs from "node:fs";
import path from "node:path";
const root = process.cwd();
const required = [
  "src/inventory/inventory.service.ts",
  "src/inventory/inventory.controller.ts",
  "src/sales/sales.service.ts",
  "src/sales/sales.controller.ts",
  "src/events/events.service.ts",
  "src/workflows/workflows.service.ts",
];
const missing = required.filter((file) => !fs.existsSync(path.join(root, file)));
const all = missing.length ? "" : required.map((file) => fs.readFileSync(path.join(root, file), "utf8")).join("\n");
const checks = {
  requiredFilesPresent: missing.length === 0,
  inventoryReserveReady: all.includes("inventory-reserve"),
  inventoryReleaseReady: all.includes("inventory-release"),
  inventorySoldReady: all.includes("inventory-sold"),
  salesFinalizationReady: all.includes("sale-finalization"),
  workflowIntegrationReady: all.includes("completeStep"),
  eventIntegrationReady: all.includes("SaleCompleted"),
  statusTransitionsReady: all.includes("ensureTransition"),
  idempotencyReady: all.includes("resolveIdempotencyKey"),
};
const success = Object.values(checks).every(Boolean);
process.stdout.write(JSON.stringify({
  success,
  system: "AVOS Core Application Flows V1",
  bundle: "Mega Packs 6-10",
  version: "1.10.0",
  classification: "inventory-sales-workflow-event-hardening",
  missing,
  checks,
  healthStatus: success ? "healthy" : "unhealthy",
}));
if (!success) process.exit(1);
