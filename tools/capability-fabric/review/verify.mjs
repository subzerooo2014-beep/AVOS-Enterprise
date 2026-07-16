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
const appModule = path.join(root, "apps", "api", "src", "app.module.ts");

const requiredFiles = [
  "capability-fabric-review.types.ts",
  "capability-fabric-review.registry.ts",
  "capability-fabric-scanner.service.ts",
  "capability-fabric-consolidation.service.ts",
  "capability-fabric-review.service.ts",
  "capability-fabric-review.controller.ts",
  "capability-fabric-review.module.ts",
  "index.ts",
];

const missing = requiredFiles.filter(
  (file) => !fs.existsSync(path.join(reviewRoot, file)),
);

if (missing.length) {
  throw new Error(`Missing review pack files: ${missing.join(", ")}`);
}

const registry = fs.readFileSync(
  path.join(reviewRoot, "capability-fabric-review.registry.ts"),
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
const app = fs.readFileSync(appModule, "utf8");

const pillars = [
  "LAYER_COMPLETENESS_REVIEW",
  "MODULE_BOUNDARY_REVIEW",
  "DEPENDENCY_DIRECTION_REVIEW",
  "CONTRACT_CONSISTENCY_REVIEW",
  "FOUNDATION_FIRST_VALIDATION",
  "DUPLICATION_ANALYSIS",
  "RUNTIME_ALIGNMENT_REVIEW",
  "ORCHESTRATION_ALIGNMENT_REVIEW",
  "INTELLIGENCE_ALIGNMENT_REVIEW",
  "ENTERPRISE_GOVERNANCE_REVIEW",
  "PUBLIC_API_REVIEW",
  "DOCUMENTATION_REVIEW",
  "CONSOLIDATION_DECISIONS",
  "READINESS_SCORING",
  "KNOWLEDGE_FABRIC_GATE",
];

for (const pillar of pillars) {
  if (!registry.includes(`"${pillar}"`)) {
    throw new Error(`Missing review pillar: ${pillar}`);
  }
}

for (const operation of [
  "run(repoRoot",
  "getReviews()",
  "getReport()",
  "snapshot():",
]) {
  if (!service.includes(operation)) {
    throw new Error(`Missing review operation: ${operation}`);
  }
}

for (const route of [
  '@Controller("capability-fabric/review")',
  '@Get("status")',
  '@Post("run")',
  '@Get("layers")',
  '@Get("report")',
  '@Get("snapshot")',
  '@Post("smoke")',
]) {
  if (!controller.includes(route)) {
    throw new Error(`Missing review API route: ${route}`);
  }
}

if (
  !app.includes(
    'import { CapabilityFabricReviewModule } from "./capability-fabric-review/capability-fabric-review.module";',
  ) ||
  !app.includes("CapabilityFabricReviewModule,")
) {
  throw new Error("CapabilityFabricReviewModule is not registered in app.module.ts");
}

console.log(
  JSON.stringify(
    {
      success: true,
      system: "AVOS Capability Fabric",
      pack: "Architecture Review and Consolidation",
      verification: "passed",
      requiredFiles: requiredFiles.length,
      pillars: pillars.length,
      routes: 7,
      foundationFirst: true,
      layersExpected: 5,
    },
    null,
    2,
  ),
);