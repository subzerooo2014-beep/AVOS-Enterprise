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
const appModule = path.join(root, "apps", "api", "src", "app.module.ts");

const requiredFiles = [
  "capability-orchestration.types.ts",
  "capability-orchestration.registry.ts",
  "capability-discovery.service.ts",
  "capability-routing.service.ts",
  "capability-composition-graph.service.ts",
  "capability-orchestration-registry.service.ts",
  "capability-orchestration.service.ts",
  "capability-orchestration.controller.ts",
  "capability-orchestration.module.ts",
  "index.ts",
];

const missing = requiredFiles.filter(
  (file) => !fs.existsSync(path.join(orchestrationRoot, file)),
);

if (missing.length) {
  throw new Error(`Missing CF-3 files: ${missing.join(", ")}`);
}

const registry = fs.readFileSync(
  path.join(orchestrationRoot, "capability-orchestration.registry.ts"),
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
const moduleFile = fs.readFileSync(
  path.join(orchestrationRoot, "capability-orchestration.module.ts"),
  "utf8",
);
const app = fs.readFileSync(appModule, "utf8");

const pillars = [
  "CAPABILITY_GRAPH",
  "CAPABILITY_COMPOSITION",
  "CAPABILITY_PIPELINE",
  "CAPABILITY_CHAINING",
  "CAPABILITY_MESH",
  "CAPABILITY_ROUTING",
  "CAPABILITY_DISCOVERY",
  "DYNAMIC_RESOLUTION",
  "AI_ASSISTED_SELECTION",
  "FALLBACK_CHAINS",
  "EXECUTION_PLANNER",
  "CAPABILITY_SCHEDULING_FOUNDATION",
  "CAPABILITY_COORDINATION",
  "PARALLEL_EXECUTION",
  "DISTRIBUTED_CALL_FOUNDATION",
  "COMPENSATION_FOUNDATION",
];

for (const pillar of pillars) {
  if (!registry.includes(`"${pillar}"`)) {
    throw new Error(`Missing CF-3 pillar: ${pillar}`);
  }
}

for (const operation of [
  "discover(query:",
  "registerRoute(",
  "resolveRoute(",
  "async execute(",
  "snapshot():",
]) {
  if (!service.includes(operation)) {
    throw new Error(`Missing orchestration operation: ${operation}`);
  }
}

for (const route of [
  '@Controller("capability-fabric/orchestration")',
  '@Post("definitions")',
  '@Post("definitions/:key/activate")',
  '@Get("definitions/:key/plan")',
  '@Post("discover")',
  '@Post("routes")',
  '@Post("routes/:routeKey/resolve")',
  '@Post("execute")',
  '@Get("executions")',
  '@Get("snapshot")',
  '@Post("smoke")',
]) {
  if (!controller.includes(route)) {
    throw new Error(`Missing CF-3 API route: ${route}`);
  }
}

if (
  !moduleFile.includes(
    "imports: [CapabilityFabricModule, CapabilityRuntimeModule]",
  )
) {
  throw new Error("CapabilityOrchestrationModule is not connected to CF-1 and CF-2.");
}

if (
  !app.includes(
    'import { CapabilityOrchestrationModule } from "./capability-orchestration/capability-orchestration.module";',
  ) ||
  !app.includes("CapabilityOrchestrationModule,")
) {
  throw new Error("CapabilityOrchestrationModule is not registered in app.module.ts");
}

console.log(
  JSON.stringify(
    {
      success: true,
      system: "AVOS Capability Fabric",
      megaPack: "CF-3 Capability Orchestration",
      verification: "passed",
      requiredFiles: requiredFiles.length,
      pillars: pillars.length,
      routes: 11,
      cf1Connected: true,
      cf2Connected: true,
      foundationFirst: true,
    },
    null,
    2,
  ),
);