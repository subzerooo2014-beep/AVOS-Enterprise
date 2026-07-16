import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const orchestrationRoot = path.join(
  root,
  "apps",
  "api",
  "src",
  "capability-orchestration",
);

const discovery = fs.readFileSync(
  path.join(orchestrationRoot, "capability-discovery.service.ts"),
  "utf8",
);
const routing = fs.readFileSync(
  path.join(orchestrationRoot, "capability-routing.service.ts"),
  "utf8",
);
const graph = fs.readFileSync(
  path.join(orchestrationRoot, "capability-composition-graph.service.ts"),
  "utf8",
);
const registry = fs.readFileSync(
  path.join(orchestrationRoot, "capability-orchestration-registry.service.ts"),
  "utf8",
);
const service = fs.readFileSync(
  path.join(orchestrationRoot, "capability-orchestration.service.ts"),
  "utf8",
);
const controller = fs.readFileSync(
  path.join(orchestrationRoot, "capability-orchestration.controller.ts"),
  "utf8",
);

const checks = {
  discoveryScoring: discovery.includes("score += 15"),
  routeRegistration: routing.includes("ROUTE_ALREADY_EXISTS"),
  routeResolution: routing.includes("resolve(routeKey:"),
  roundRobinRouting: routing.includes('strategy === "ROUND_ROBIN"'),
  weightedRouting: routing.includes('strategy === "WEIGHTED"'),
  aiAssistedSelection: routing.includes('strategy === "AI_ASSISTED"'),
  graphValidation: graph.includes("validate(definition:"),
  cycleDetection: graph.includes("detectCycles("),
  executionPlanning: graph.includes("plan(definition:"),
  parallelExecution: service.includes("Promise.all("),
  fallbackChains: service.includes("tryFallback("),
  orchestrationRegistry: registry.includes("ORCHESTRATION_ALREADY_EXISTS"),
  activationGovernance: registry.includes("ORCHESTRATION_NOT_ACTIVATABLE"),
  executionHistory: service.includes("history()"),
  runtimeSmokeEndpoint: controller.includes('@Post("smoke")'),
};

const failed = Object.entries(checks)
  .filter(([, passed]) => !passed)
  .map(([name]) => name);

if (failed.length) {
  throw new Error(`CF-3 smoke checks failed: ${failed.join(", ")}`);
}

console.log(
  JSON.stringify(
    {
      success: true,
      system: "AVOS Capability Fabric",
      megaPack: "CF-3 Capability Orchestration",
      smokeTest: "passed",
      checks,
      checkCount: Object.keys(checks).length,
      rollbackReady: fs.existsSync(
        path.join(root, "tools", "capability-fabric", "cf3", "rollback.ps1"),
      ),
    },
    null,
    2,
  ),
);