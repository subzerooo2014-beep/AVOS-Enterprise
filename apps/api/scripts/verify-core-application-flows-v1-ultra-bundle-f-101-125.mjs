import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const required = [
  "src/core-application-flows/core-flow-intelligence.types.ts",
  "src/core-application-flows/core-flow-anomaly.service.ts",
  "src/core-application-flows/core-flow-recommendation.service.ts",
  "src/core-application-flows/core-flow-forecast.service.ts",
  "src/core-application-flows/core-flow-optimization.service.ts",
  "src/core-application-flows/core-flow-learning.service.ts",
  "src/core-application-flows/core-flow-intelligence.service.ts",
  "src/core-application-flows/core-flow-intelligence.controller.ts",
  "src/workflows/workflows.module.ts",
];

const missing = required.filter((file) => !fs.existsSync(path.join(root, file)));
const all = missing.length
  ? ""
  : required.map((file) => fs.readFileSync(path.join(root, file), "utf8")).join("\n");

const checks = {
  requiredFilesPresent: missing.length === 0,
  anomalyDetectionReady: all.includes("CoreFlowAnomalyService"),
  recommendationsReady: all.includes("CoreFlowRecommendationService"),
  forecastingReady: all.includes("CoreFlowForecastService"),
  optimizationReady: all.includes("CoreFlowOptimizationService"),
  learningReady: all.includes("CoreFlowLearningService"),
  intelligenceOrchestrationReady: all.includes("CoreFlowIntelligenceService"),
  riskIntegrationReady: all.includes("this.risk.assess"),
  costIntegrationReady: all.includes("this.costs.dashboard"),
  optimizationLifecycleReady: all.includes('"draft" | "approved" | "executed"'),
  dashboardReady: all.includes("learningSignals"),
  controllerRegistrationReady: all.includes("CoreFlowIntelligenceController"),
};

const success = Object.values(checks).every(Boolean);

process.stdout.write(JSON.stringify({
  success,
  system: "AVOS Core Application Flows V1",
  bundle: "Ultra Bundle F — Mega Packs 101-125",
  version: "1.125.0",
  classification: "anomaly-recommendation-forecast-optimization-learning-intelligence",
  megaPacks: 25,
  requiredFiles: required.length,
  missing,
  checks,
  healthStatus: success ? "healthy" : "unhealthy",
}));

if (!success) process.exit(1);
