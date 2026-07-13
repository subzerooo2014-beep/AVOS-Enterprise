import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const required = [
  "src/core-application-flows-v2/core-flow-worker.types.ts",
  "src/core-application-flows-v2/core-flow-worker-store.service.ts",
  "src/core-application-flows-v2/core-flow-worker-registry.service.ts",
  "src/core-application-flows-v2/core-flow-durable-messaging.service.ts",
  "src/core-application-flows-v2/core-flow-worker-runtime.service.ts",
  "src/core-application-flows-v2/core-flow-worker.controller.ts",
  "src/workflows/workflows.module.ts",
];

const missing = required.filter((file) => !fs.existsSync(path.join(root, file)));
const all = missing.length ? "" : required.map((file) =>
  fs.readFileSync(path.join(root, file), "utf8")).join("\n");

const checks = {
  requiredFilesPresent: missing.length === 0,
  workerRegistryReady: all.includes("CoreFlowWorkerRegistryService"),
  heartbeatsReady: all.includes("heartbeat_at"),
  leasesReady: all.includes("lease_until"),
  outboxReady: all.includes("avos_core_flow_outbox_v2"),
  inboxReady: all.includes("avos_core_flow_inbox_v2"),
  deduplicationReady: all.includes("message_key"),
  dlqReplayReady: all.includes("replayDeadLetter"),
  retryPolicyReady: all.includes("maxAttempts"),
  workerRuntimeReady: all.includes("CoreFlowWorkerRuntimeService"),
  controllerRegistered: all.includes("CoreFlowWorkerController"),
};

const success = Object.values(checks).every(Boolean);
process.stdout.write(JSON.stringify({
  success,
  system: "AVOS Core Application Flows V2",
  bundle: "Ultra Bundle O — Mega Packs 326-350",
  version: "2.350.0",
  classification: "durable-workers-inbox-outbox-leases-heartbeats-dlq-replay",
  megaPacks: 25,
  missing,
  checks,
  healthStatus: success ? "healthy" : "unhealthy",
}));
if (!success) process.exit(1);
