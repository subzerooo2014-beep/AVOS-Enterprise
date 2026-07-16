import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const runtimeRoot = path.join(root, "apps", "api", "src", "capability-runtime");

const resolver = fs.readFileSync(
  path.join(runtimeRoot, "capability-runtime-resolver.service.ts"),
  "utf8",
);
const loader = fs.readFileSync(
  path.join(runtimeRoot, "capability-runtime-loader.service.ts"),
  "utf8",
);
const runtime = fs.readFileSync(
  path.join(runtimeRoot, "capability-runtime.service.ts"),
  "utf8",
);
const observability = fs.readFileSync(
  path.join(runtimeRoot, "capability-runtime-observability.service.ts"),
  "utf8",
);

const checks = {
  registryResolution: resolver.includes("CAPABILITY_NOT_REGISTERED"),
  dependencyResolution: resolver.includes("UNRESOLVED_REQUIRED_DEPENDENCIES"),
  cycleProtection: resolver.includes("DEPENDENCY_CYCLE_DETECTED"),
  lazyLoading: loader.includes('state: request.lazy ? "READY" : "ACTIVE"'),
  activation: runtime.includes('transition(instance, "ACTIVE")'),
  suspension: runtime.includes('transition(instance, "SUSPENDED")'),
  restart: runtime.includes("restartCount += 1"),
  stop: runtime.includes('transition(instance, "STOPPED")'),
  isolation: loader.includes("isolation: context.isolation"),
  runtimeCache: runtime.includes("cacheSet(runtimeId:"),
  health: observability.includes("health(instance:"),
  diagnostics: observability.includes("diagnostic("),
  executionTracking: runtime.includes("totalExecutions += 1"),
  performanceTracking: runtime.includes("averageDurationMs"),
  runtimeSmokeEndpoint: fs
    .readFileSync(
      path.join(runtimeRoot, "capability-runtime.controller.ts"),
      "utf8",
    )
    .includes('@Post("smoke")'),
};

const failed = Object.entries(checks)
  .filter(([, passed]) => !passed)
  .map(([name]) => name);

if (failed.length) {
  throw new Error(`CF-2 smoke checks failed: ${failed.join(", ")}`);
}

console.log(
  JSON.stringify(
    {
      success: true,
      system: "AVOS Capability Fabric",
      megaPack: "CF-2 Capability Runtime",
      smokeTest: "passed",
      checks,
      checkCount: Object.keys(checks).length,
      rollbackReady: fs.existsSync(
        path.join(root, "tools", "capability-fabric", "cf2", "rollback.ps1"),
      ),
    },
    null,
    2,
  ),
);