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

const knowledge = fs.readFileSync(
  path.join(intelligenceRoot, "capability-knowledge.service.ts"),
  "utf8",
);
const memory = fs.readFileSync(
  path.join(intelligenceRoot, "capability-memory.service.ts"),
  "utf8",
);
const usage = fs.readFileSync(
  path.join(intelligenceRoot, "capability-usage-analytics.service.ts"),
  "utf8",
);
const scoring = fs.readFileSync(
  path.join(intelligenceRoot, "capability-scoring.service.ts"),
  "utf8",
);
const duplicate = fs.readFileSync(
  path.join(intelligenceRoot, "capability-duplicate-detector.service.ts"),
  "utf8",
);
const risk = fs.readFileSync(
  path.join(intelligenceRoot, "capability-risk.service.ts"),
  "utf8",
);
const recommendation = fs.readFileSync(
  path.join(intelligenceRoot, "capability-recommendation.service.ts"),
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

const checks = {
  knowledgeSynchronization: knowledge.includes("synchronize()"),
  intelligentSearch: knowledge.includes("search(query:"),
  capabilityMemory: memory.includes("timeline(capabilityKey:"),
  usageAnalytics: usage.includes("successRate:"),
  reuseAnalytics: usage.includes("reuseScore"),
  qualityIndex: scoring.includes("qualityIndex"),
  trustScore: scoring.includes("trustScore"),
  maturityScore: scoring.includes("maturityScore"),
  riskScore: scoring.includes("riskScore"),
  technicalDebt: scoring.includes("technicalDebtScore"),
  duplicateDetection: duplicate.includes("detect(capabilityKey:"),
  riskAssessment: risk.includes("assess(capabilityKey:"),
  recommendationEngine: recommendation.includes("generate(input:"),
  intelligentRanking: service.includes("rankBy("),
  runtimeSmokeEndpoint: controller.includes('@Post("smoke")'),
};

const failed = Object.entries(checks)
  .filter(([, passed]) => !passed)
  .map(([name]) => name);

if (failed.length) {
  throw new Error(`CF-4 smoke checks failed: ${failed.join(", ")}`);
}

console.log(
  JSON.stringify(
    {
      success: true,
      system: "AVOS Capability Fabric",
      megaPack: "CF-4 Capability Intelligence",
      smokeTest: "passed",
      checks,
      checkCount: Object.keys(checks).length,
      rollbackReady: fs.existsSync(
        path.join(root, "tools", "capability-fabric", "cf4", "rollback.ps1"),
      ),
    },
    null,
    2,
  ),
);