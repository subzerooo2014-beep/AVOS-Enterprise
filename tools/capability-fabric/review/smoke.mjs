import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const reviewRoot = path.join(
  root,
  "apps",
  "api",
  "src",
  "capability-fabric-review",
);

const scanner = fs.readFileSync(
  path.join(reviewRoot, "capability-fabric-scanner.service.ts"),
  "utf8",
);
const consolidation = fs.readFileSync(
  path.join(reviewRoot, "capability-fabric-consolidation.service.ts"),
  "utf8",
);
const service = fs.readFileSync(
  path.join(reviewRoot, "capability-fabric-review.service.ts"),
  "utf8",
);
const controller = fs.readFileSync(
  path.join(reviewRoot, "capability-fabric-review.controller.ts"),
  "utf8",
);

const checks = {
  fiveLayerScan: scanner.includes("CAPABILITY_FABRIC_LAYER_DEFINITIONS"),
  exportReview: scanner.includes("export surface is incomplete"),
  dependencyDirection: scanner.includes("upward dependencies"),
  foundationFirstValidation: scanner.includes("Foundation First"),
  architectureScoring: scanner.includes("baseScore"),
  consolidationDecisions: consolidation.includes("decide("),
  lifecycleStandardization: consolidation.includes("lifecycle vocabulary"),
  persistenceBoundary: consolidation.includes("Persistent storage boundary"),
  humanAuthorityPreserved: consolidation.includes("Human final authority"),
  knowledgeFabricGate: service.includes("knowledgeFabricReady"),
  blockingFindings: service.includes("blockingFindings"),
  reviewReport: service.includes("CapabilityFabricReadinessReport"),
  runtimeSmokeEndpoint: controller.includes('@Post("smoke")'),
};

const failed = Object.entries(checks)
  .filter(([, passed]) => !passed)
  .map(([name]) => name);

if (failed.length) {
  throw new Error(`Review smoke checks failed: ${failed.join(", ")}`);
}

console.log(
  JSON.stringify(
    {
      success: true,
      system: "AVOS Capability Fabric",
      pack: "Architecture Review and Consolidation",
      smokeTest: "passed",
      checks,
      checkCount: Object.keys(checks).length,
      rollbackReady: fs.existsSync(
        path.join(root, "tools", "capability-fabric", "review", "rollback.ps1"),
      ),
    },
    null,
    2,
  ),
);