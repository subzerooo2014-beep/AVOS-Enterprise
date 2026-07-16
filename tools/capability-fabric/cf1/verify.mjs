import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const featureRoot = path.join(root, "apps", "api", "src", "capability-fabric");
const appModule = path.join(root, "apps", "api", "src", "app.module.ts");

const requiredFiles = [
  "capability-fabric.types.ts",
  "capability-fabric.registry.ts",
  "capability-foundation-validator.service.ts",
  "capability-dependency-graph.service.ts",
  "capability-registry.service.ts",
  "capability-fabric.controller.ts",
  "capability-fabric.module.ts",
  "index.ts",
];

const missing = requiredFiles.filter(
  (file) => !fs.existsSync(path.join(featureRoot, file)),
);

if (missing.length) {
  throw new Error(`Missing CF-1 files: ${missing.join(", ")}`);
}

const types = fs.readFileSync(
  path.join(featureRoot, "capability-fabric.types.ts"),
  "utf8",
);
const registry = fs.readFileSync(
  path.join(featureRoot, "capability-fabric.registry.ts"),
  "utf8",
);
const service = fs.readFileSync(
  path.join(featureRoot, "capability-registry.service.ts"),
  "utf8",
);
const controller = fs.readFileSync(
  path.join(featureRoot, "capability-fabric.controller.ts"),
  "utf8",
);
const app = fs.readFileSync(appModule, "utf8");

const requiredTokens = [
  "CapabilityDigitalDNA",
  "CapabilityContract",
  "CapabilityDependency",
  "CapabilityPolicyBinding",
  "CapabilityPermission",
  "CapabilityEventDefinition",
  "CapabilityMetricDefinition",
  "CapabilityHealthDefinition",
  "CapabilityRuntimeDescriptor",
  "CapabilitySecurityDescriptor",
  "CapabilityVersionRecord",
  "CapabilityEvolutionRecord",
  "CapabilityRegistrySnapshot",
];

for (const token of requiredTokens) {
  if (!types.includes(token)) {
    throw new Error(`Missing Digital DNA token: ${token}`);
  }
}

const pillars = [
  "CAPABILITY_DIGITAL_DNA",
  "CAPABILITY_IDENTITY",
  "CAPABILITY_MANIFEST",
  "CAPABILITY_METADATA",
  "CAPABILITY_CONTRACTS",
  "CAPABILITY_LIFECYCLE",
  "CAPABILITY_VERSIONING",
  "CAPABILITY_DEPENDENCIES",
  "CAPABILITY_POLICIES",
  "CAPABILITY_PERMISSIONS",
  "CAPABILITY_EVENTS",
  "CAPABILITY_METRICS",
  "CAPABILITY_HEALTH",
  "CAPABILITY_RUNTIME_DESCRIPTOR",
  "CAPABILITY_SECURITY_DESCRIPTOR",
  "CAPABILITY_VALIDATION",
  "CAPABILITY_REGISTRY",
  "CAPABILITY_DEPENDENCY_GRAPH",
];

for (const pillar of pillars) {
  if (!registry.includes(`"${pillar}"`)) {
    throw new Error(`Missing CF-1 pillar: ${pillar}`);
  }
}

for (const method of [
  "register(input:",
  "transitionStatus(",
  "evolve(",
  "releaseVersion(",
  "dependencyGraph()",
  "snapshot():",
]) {
  if (!service.includes(method)) {
    throw new Error(`Missing registry operation: ${method}`);
  }
}

for (const route of [
  '@Controller("capability-fabric")',
  '@Get("status")',
  '@Post("capabilities")',
  '@Patch("capabilities/:key/status")',
  '@Post("capabilities/:key/evolve")',
  '@Post("capabilities/:key/versions")',
  '@Get("dependency-graph")',
  '@Get("snapshot")',
  '@Post("smoke")',
]) {
  if (!controller.includes(route)) {
    throw new Error(`Missing API route: ${route}`);
  }
}

if (
  !app.includes(
    'import { CapabilityFabricModule } from "./capability-fabric/capability-fabric.module";',
  ) ||
  !app.includes("CapabilityFabricModule,")
) {
  throw new Error("CapabilityFabricModule is not registered in app.module.ts");
}

console.log(
  JSON.stringify(
    {
      success: true,
      system: "AVOS Capability Fabric",
      megaPack: "CF-1 Capability Foundation",
      verification: "passed",
      requiredFiles: requiredFiles.length,
      digitalDNATokens: requiredTokens.length,
      pillars: pillars.length,
      routes: 9,
      foundationFirst: true,
    },
    null,
    2,
  ),
);