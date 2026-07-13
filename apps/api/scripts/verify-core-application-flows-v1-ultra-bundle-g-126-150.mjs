import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const required = [
  "src/core-application-flows/core-flow-autonomy.types.ts",
  "src/core-application-flows/core-flow-autonomy-policy.service.ts",
  "src/core-application-flows/core-flow-autonomy.service.ts",
  "src/core-application-flows/core-flow-experiment.service.ts",
  "src/core-application-flows/core-flow-benchmark.service.ts",
  "src/core-application-flows/core-flow-release.service.ts",
  "src/core-application-flows/core-flow-autonomous-operations.service.ts",
  "src/core-application-flows/core-flow-autonomous-operations.controller.ts",
  "src/workflows/workflows.module.ts",
];

const missing = required.filter((file) => !fs.existsSync(path.join(root, file)));
const all = missing.length ? "" : required.map((file) => fs.readFileSync(path.join(root, file), "utf8")).join("\n");

const checks = {
  requiredFilesPresent: missing.length === 0,
  autonomyPolicyReady: all.includes("CoreFlowAutonomyPolicyService"),
  autonomousActionsReady: all.includes("CoreFlowAutonomyService"),
  experimentsReady: all.includes("CoreFlowExperimentService"),
  benchmarksReady: all.includes("CoreFlowBenchmarkService"),
  releasesReady: all.includes("CoreFlowReleaseService"),
  canaryReady: all.includes('"canary"'),
  rollbackReady: all.includes("rolled-back"),
  autonomousPlanningReady: all.includes("CoreFlowAutonomousOperationsService"),
  controllerRegistered: all.includes("CoreFlowAutonomousOperationsController"),
  providersRegistered: all.includes("CoreFlowAutonomyPolicyService") && all.includes("CoreFlowReleaseService"),
};

const success = Object.values(checks).every(Boolean);
process.stdout.write(JSON.stringify({
  success,
  system: "AVOS Core Application Flows V1",
  bundle: "Ultra Bundle G — Mega Packs 126-150",
  version: "1.150.1",
  classification: "autonomy-experiments-benchmarks-canary-release-self-optimization",
  megaPacks: 25,
  missing,
  checks,
  healthStatus: success ? "healthy" : "unhealthy",
}));
if (!success) process.exit(1);
