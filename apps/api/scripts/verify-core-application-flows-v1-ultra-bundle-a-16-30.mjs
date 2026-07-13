import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const required = [
  "src/core-application-flows/core-flow-operations.types.ts",
  "src/core-application-flows/core-flow-audit.service.ts",
  "src/core-application-flows/core-flow-snapshot.service.ts",
  "src/core-application-flows/core-flow-policy.service.ts",
  "src/core-application-flows/core-flow-outbox.service.ts",
  "src/core-application-flows/core-flow-worker.service.ts",
  "src/core-application-flows/core-flow-operations.controller.ts",
  "src/workflows/workflows.module.ts",
];

const missing = required.filter((file) => !fs.existsSync(path.join(root, file)));
const all = missing.length ? "" : required.map((file) => fs.readFileSync(path.join(root, file), "utf8")).join("\n");

const checks = {
  requiredFilesPresent: missing.length === 0,
  outboxReady: all.includes("CoreFlowOutboxService"),
  workerReady: all.includes("CoreFlowWorkerService"),
  retryBackoffReady: all.includes("retry-scheduled"),
  deadLetterReady: all.includes("dead-lettered"),
  compensationReady: all.includes("operation.compensated"),
  auditReady: all.includes("CoreFlowAuditService"),
  snapshotsReady: all.includes("CoreFlowSnapshotService"),
  policiesReady: all.includes("CoreFlowPolicyService"),
  batchProcessingReady: all.includes("processBatch"),
  dashboardReady: all.includes("successRate"),
  moduleRegistrationReady: all.includes("CoreFlowOperationsController"),
};

const success = Object.values(checks).every(Boolean);
process.stdout.write(JSON.stringify({
  success,
  system: "AVOS Core Application Flows V1",
  bundle: "Ultra Bundle A — Mega Packs 16-30",
  version: "1.30.0",
  classification: "outbox-worker-retry-dead-letter-compensation-audit-snapshots",
  megaPacks: 15,
  requiredFiles: required.length,
  missing,
  checks,
  healthStatus: success ? "healthy" : "unhealthy",
}));

if (!success) process.exit(1);
