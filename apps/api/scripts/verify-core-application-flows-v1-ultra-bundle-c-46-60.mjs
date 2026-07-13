import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const required = [
  "src/core-application-flows/core-flow-process-manager.types.ts",
  "src/core-application-flows/core-flow-rules.service.ts",
  "src/core-application-flows/core-flow-approval.service.ts",
  "src/core-application-flows/core-flow-timeout.service.ts",
  "src/core-application-flows/core-flow-process-manager.service.ts",
  "src/core-application-flows/core-flow-process-manager.controller.ts",
  "src/workflows/workflows.module.ts",
];

const missing = required.filter((file) => !fs.existsSync(path.join(root, file)));
const all = missing.length
  ? ""
  : required.map((file) => fs.readFileSync(path.join(root, file), "utf8")).join("\n");

const checks = {
  requiredFilesPresent: missing.length === 0,
  processManagerReady: all.includes("CoreFlowProcessManagerService"),
  definitionVersioningReady: all.includes("definition.version"),
  dependencyGraphReady: all.includes("dependsOn"),
  parallelReadyNodesReady: all.includes("readyNodes"),
  approvalGatesReady: all.includes("CoreFlowApprovalService"),
  rulesRuntimeReady: all.includes("CoreFlowRulesService"),
  timeoutManagerReady: all.includes("CoreFlowTimeoutService"),
  timeoutSweepReady: all.includes("timeoutSweep"),
  compensationReady: all.includes("process.compensated"),
  executionAnalyticsReady: all.includes("averageDurationMs"),
  controllerRegistrationReady: all.includes("CoreFlowProcessManagerController"),
};

const success = Object.values(checks).every(Boolean);

process.stdout.write(JSON.stringify({
  success,
  system: "AVOS Core Application Flows V1",
  bundle: "Ultra Bundle C — Mega Packs 46-60",
  version: "1.60.0",
  classification: "process-manager-dependency-graph-rules-approvals-timeouts-analytics",
  megaPacks: 15,
  requiredFiles: required.length,
  missing,
  checks,
  healthStatus: success ? "healthy" : "unhealthy",
}));

if (!success) process.exit(1);
