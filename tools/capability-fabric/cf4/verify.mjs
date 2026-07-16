import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const intelligenceRoot = path.join(
  root,
  "apps",
  "api",
  "src",
  "capability-intelligence",
);
const appModule = path.join(root, "apps", "api", "src", "app.module.ts");

const requiredFiles = [
  "capability-intelligence.types.ts",
  "capability-intelligence.registry.ts",
  "capability-knowledge.service.ts",
  "capability-memory.service.ts",
  "capability-usage-analytics.service.ts",
  "capability-scoring.service.ts",
  "capability-duplicate-detector.service.ts",
  "capability-risk.service.ts",
  "capability-recommendation.service.ts",
  "capability-intelligence.service.ts",
  "capability-intelligence.controller.ts",
  "capability-intelligence.module.ts",
  "index.ts",
];

const missing = requiredFiles.filter(
  (file) => !fs.existsSync(path.join(intelligenceRoot, file)),
);

if (missing.length) {
  throw new Error(`Missing CF-4 files: ${missing.join(", ")}`);
}

const registry = fs.readFileSync(
  path.join(intelligenceRoot, "capability-intelligence.registry.ts"),
  "utf8",
);
const service = fs.readFileSync(
  path.join(intelligenceRoot, "capability-intelligence.service.ts"),
  "utf8",
);
const controller = fs.readFileSync(
  path.join(intelligenceRoot, "capability-intelligence.controller.ts"),
  "utf8",
);
const moduleFile = fs.readFileSync(
  path.join(intelligenceRoot, "capability-intelligence.module.ts"),
  "utf8",
);
const app = fs.readFileSync(appModule, "utf8");

const pillars = [
  "CAPABILITY_KNOWLEDGE",
  "CAPABILITY_MEMORY",
  "USAGE_ANALYTICS",
  "QUALITY_INDEX",
  "TRUST_SCORE",
  "MATURITY_MODEL",
  "RISK_ASSESSMENT",
  "TECHNICAL_DEBT_DETECTION",
  "DUPLICATE_DETECTION",
  "REUSE_INTELLIGENCE",
  "EVOLUTION_SUGGESTIONS",
  "RECOMMENDATION_ENGINE",
  "HEALTH_TREND_ANALYSIS",
  "PERFORMANCE_INTELLIGENCE",
  "INTELLIGENT_RANKING",
  "CAPABILITY_INSIGHTS_API",
];

for (const pillar of pillars) {
  if (!registry.includes(`"${pillar}"`)) {
    throw new Error(`Missing CF-4 pillar: ${pillar}`);
  }
}

for (const operation of [
  "synchronizeKnowledge()",
  "analyze(capabilityKey:",
  "analyzeAll()",
  "rankBy(",
  "knowledgeSearch(query:",
  "memoryTimeline(capabilityKey:",
  "snapshot():",
]) {
  if (!service.includes(operation)) {
    throw new Error(`Missing intelligence operation: ${operation}`);
  }
}

for (const route of [
  '@Controller("capability-fabric/intelligence")',
  '@Post("knowledge/synchronize")',
  '@Get("knowledge/search")',
  '@Post("capabilities/:key/analyze")',
  '@Post("analyze-all")',
  '@Get("capabilities/:key/insight")',
  '@Get("capabilities/:key/memory")',
  '@Get("ranking")',
  '@Get("snapshot")',
  '@Post("smoke")',
]) {
  if (!controller.includes(route)) {
    throw new Error(`Missing CF-4 API route: ${route}`);
  }
}

if (
  !moduleFile.includes("CapabilityFabricModule") ||
  !moduleFile.includes("CapabilityRuntimeModule") ||
  !moduleFile.includes("CapabilityOrchestrationModule")
) {
  throw new Error("CapabilityIntelligenceModule is not connected to CF-1, CF-2, and CF-3.");
}

if (
  !app.includes(
    'import { CapabilityIntelligenceModule } from "./capability-intelligence/capability-intelligence.module";',
  ) ||
  !app.includes("CapabilityIntelligenceModule,")
) {
  throw new Error("CapabilityIntelligenceModule is not registered in app.module.ts");
}

console.log(
  JSON.stringify(
    {
      success: true,
      system: "AVOS Capability Fabric",
      megaPack: "CF-4 Capability Intelligence",
      verification: "passed",
      requiredFiles: requiredFiles.length,
      pillars: pillars.length,
      routes: 10,
      cf1Connected: true,
      cf2Connected: true,
      cf3Connected: true,
      foundationFirst: true,
    },
    null,
    2,
  ),
);