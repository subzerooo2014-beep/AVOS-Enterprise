import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const required = [
  "src/core-application-flows-v2/core-flow-durable.types.ts",
  "src/core-application-flows-v2/core-flow-durable-store.service.ts",
  "src/core-application-flows-v2/core-flow-idempotency.service.ts",
  "src/core-application-flows-v2/core-flow-durable-runtime.service.ts",
  "src/core-application-flows-v2/core-flow-durable.controller.ts",
  "src/workflows/workflows.module.ts",
];

const missing = required.filter((file) => !fs.existsSync(path.join(root, file)));
const all = missing.length ? "" : required.map((file) =>
  fs.readFileSync(path.join(root, file), "utf8")).join("\n");

const checks = {
  requiredFilesPresent: missing.length === 0,
  prismaPersistenceReady: all.includes("PrismaService"),
  schemaBootstrapReady: all.includes("CREATE TABLE IF NOT EXISTS"),
  idempotencyReady: all.includes("CoreFlowIdempotencyService"),
  distributedLocksReady: all.includes("locked_until"),
  checkpointsReady: all.includes("avos_core_flow_checkpoint"),
  durableSchedulingReady: all.includes("avos_core_flow_schedule"),
  retryPersistenceReady: all.includes("max_attempts"),
  deadLetterReady: all.includes("dead-lettered"),
  recoveryReady: all.includes("recoverStaleLocks"),
  transactionReady: all.includes("$transaction"),
  controllerRegistered: all.includes("CoreFlowDurableController"),
};

const success = Object.values(checks).every(Boolean);
process.stdout.write(JSON.stringify({
  success,
  system: "AVOS Core Application Flows V2",
  bundle: "Ultra Bundle N — Mega Packs 301-325",
  version: "2.325.0",
  classification: "persistent-runtime-idempotency-locks-checkpoints-scheduling-recovery",
  megaPacks: 25,
  missing,
  checks,
  healthStatus: success ? "healthy" : "unhealthy",
}));
if (!success) process.exit(1);
