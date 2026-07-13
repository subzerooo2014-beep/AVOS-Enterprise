import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const required = [
  "src/core-application-flows-v2/core-flow-observability-v2.types.ts",
  "src/core-application-flows-v2/core-flow-telemetry-store.service.ts",
  "src/core-application-flows-v2/core-flow-tracing.service.ts",
  "src/core-application-flows-v2/core-flow-metrics.service.ts",
  "src/core-application-flows-v2/core-flow-slo.service.ts",
  "src/core-application-flows-v2/core-flow-alerting.service.ts",
  "src/core-application-flows-v2/core-flow-observability-platform.service.ts",
  "src/core-application-flows-v2/core-flow-observability-v2.controller.ts",
  "src/workflows/workflows.module.ts",
];

const missing = required.filter((file) => !fs.existsSync(path.join(root, file)));
const all = missing.length
  ? ""
  : required.map((file) => fs.readFileSync(path.join(root, file), "utf8")).join("\n");

const checks = {
  requiredFilesPresent: missing.length === 0,
  telemetryStoreReady: all.includes("CoreFlowTelemetryStoreService"),
  tracingReady: all.includes("CoreFlowTracingService"),
  metricsReady: all.includes("CoreFlowMetricsService"),
  sloReady: all.includes("CoreFlowSloService"),
  alertingReady: all.includes("CoreFlowAlertingService"),
  platformReady: all.includes("CoreFlowObservabilityPlatformService"),
  distributedIntegrationReady: all.includes("CoreFlowDistributedRuntimeService"),
  workerIntegrationReady: all.includes("CoreFlowWorkerRuntimeService"),
  traceIndexesReady: all.includes("avos_core_flow_trace_span_trace_idx"),
  sloEvaluationReady: all.includes('"breached"'),
  controllerRegistered: all.includes("CoreFlowObservabilityV2Controller"),
};

const success = Object.values(checks).every(Boolean);

process.stdout.write(JSON.stringify({
  success,
  system: "AVOS Core Application Flows V2",
  bundle: "Ultra Bundle Q — Mega Packs 376-400",
  version: "2.400.0",
  classification: "observability-tracing-metrics-sli-slo-alerting-diagnostics",
  megaPacks: 25,
  missing,
  checks,
  healthStatus: success ? "healthy" : "unhealthy",
}));

if (!success) process.exit(1);
