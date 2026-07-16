import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const runtimeRoot = path.join(root, "apps", "api", "src", "capability-runtime");
const appModule = path.join(root, "apps", "api", "src", "app.module.ts");

const requiredFiles = [
  "capability-runtime.types.ts",
  "capability-runtime.registry.ts",
  "capability-runtime-context.service.ts",
  "capability-runtime-resolver.service.ts",
  "capability-runtime-loader.service.ts",
  "capability-runtime-observability.service.ts",
  "capability-runtime-cache.service.ts",
  "capability-runtime.service.ts",
  "capability-runtime.controller.ts",
  "capability-runtime.module.ts",
  "index.ts",
];

const missing = requiredFiles.filter(
  (file) => !fs.existsSync(path.join(runtimeRoot, file)),
);

if (missing.length) {
  throw new Error(`Missing CF-2 files: ${missing.join(", ")}`);
}

const registry = fs.readFileSync(
  path.join(runtimeRoot, "capability-runtime.registry.ts"),
  "utf8",
);
const service = fs.readFileSync(
  path.join(runtimeRoot, "capability-runtime.service.ts"),
  "utf8",
);
const controller = fs.readFileSync(
  path.join(runtimeRoot, "capability-runtime.controller.ts"),
  "utf8",
);
const moduleFile = fs.readFileSync(
  path.join(runtimeRoot, "capability-runtime.module.ts"),
  "utf8",
);
const app = fs.readFileSync(appModule, "utf8");

const pillars = [
  "RUNTIME_CONTEXT",
  "RUNTIME_RESOLUTION",
  "DEPENDENCY_RESOLUTION",
  "LAZY_LOADING",
  "CAPABILITY_LOADING",
  "CAPABILITY_ACTIVATION",
  "CAPABILITY_SUSPENSION",
  "CAPABILITY_RESTART",
  "CAPABILITY_STOP",
  "RUNTIME_ISOLATION",
  "RESOURCE_ALLOCATION",
  "RUNTIME_CACHE",
  "RUNTIME_HEALTH",
  "RUNTIME_DIAGNOSTICS",
  "PERFORMANCE_TRACKING",
];

for (const pillar of pillars) {
  if (!registry.includes(`"${pillar}"`)) {
    throw new Error(`Missing CF-2 pillar: ${pillar}`);
  }
}

for (const operation of [
  "load(request:",
  "activate(runtimeId:",
  "suspend(runtimeId:",
  "restart(runtimeId:",
  "stop(runtimeId:",
  "checkHealth(runtimeId:",
  "async execute(",
  "cacheSet(runtimeId:",
  "snapshot():",
]) {
  if (!service.includes(operation)) {
    throw new Error(`Missing runtime operation: ${operation}`);
  }
}

for (const route of [
  '@Controller("capability-fabric/runtime")',
  '@Post("instances")',
  '@Post("instances/:runtimeId/activate")',
  '@Post("instances/:runtimeId/suspend")',
  '@Post("instances/:runtimeId/restart")',
  '@Post("instances/:runtimeId/stop")',
  '@Get("instances/:runtimeId/health")',
  '@Get("instances/:runtimeId/diagnostics")',
  '@Post("execute")',
  '@Get("snapshot")',
  '@Post("smoke")',
]) {
  if (!controller.includes(route)) {
    throw new Error(`Missing CF-2 API route: ${route}`);
  }
}

if (!moduleFile.includes("imports: [CapabilityFabricModule]")) {
  throw new Error("CapabilityRuntimeModule is not connected to CF-1.");
}

if (
  !app.includes(
    'import { CapabilityRuntimeModule } from "./capability-runtime/capability-runtime.module";',
  ) ||
  !app.includes("CapabilityRuntimeModule,")
) {
  throw new Error("CapabilityRuntimeModule is not registered in app.module.ts");
}

console.log(
  JSON.stringify(
    {
      success: true,
      system: "AVOS Capability Fabric",
      megaPack: "CF-2 Capability Runtime",
      verification: "passed",
      requiredFiles: requiredFiles.length,
      pillars: pillars.length,
      routes: 11,
      cf1Connected: true,
      foundationFirst: true,
    },
    null,
    2,
  ),
);