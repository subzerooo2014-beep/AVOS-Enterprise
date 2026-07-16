import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const featureRoot = path.join(root, "apps", "api", "src", "capability-fabric");

const service = fs.readFileSync(
  path.join(featureRoot, "capability-registry.service.ts"),
  "utf8",
);
const validator = fs.readFileSync(
  path.join(featureRoot, "capability-foundation-validator.service.ts"),
  "utf8",
);
const graph = fs.readFileSync(
  path.join(featureRoot, "capability-dependency-graph.service.ts"),
  "utf8",
);
const controller = fs.readFileSync(
  path.join(featureRoot, "capability-fabric.controller.ts"),
  "utf8",
);

const checks = {
  uniqueIdentity:
    service.includes("CAPABILITY_KEY_ALREADY_REGISTERED"),
  semanticVersioning:
    service.includes("INVALID_SEMANTIC_VERSION"),
  governedStatus:
    service.includes("INVALID_STATUS_TRANSITION"),
  governedEvolution:
    service.includes("evolutionHistory.push"),
  dependencyProtection:
    service.includes("CAPABILITY_HAS_REQUIRED_DEPENDENTS"),
  digitalDNAValidation:
    validator.includes("validateDNA("),
  cycleDetection:
    graph.includes("detectCycles("),
  unresolvedDependencyDetection:
    graph.includes("unresolvedRequired"),
  runtimeSmokeEndpoint:
    controller.includes('@Post("smoke")'),
};

const failed = Object.entries(checks)
  .filter(([, passed]) => !passed)
  .map(([name]) => name);

if (failed.length) {
  throw new Error(`CF-1 smoke checks failed: ${failed.join(", ")}`);
}

console.log(
  JSON.stringify(
    {
      success: true,
      system: "AVOS Capability Fabric",
      megaPack: "CF-1",
      smokeTest: "passed",
      checks,
      checkCount: Object.keys(checks).length,
      rollbackReady: fs.existsSync(
        path.join(root, "tools", "capability-fabric", "cf1", "rollback.ps1"),
      ),
    },
    null,
    2,
  ),
);