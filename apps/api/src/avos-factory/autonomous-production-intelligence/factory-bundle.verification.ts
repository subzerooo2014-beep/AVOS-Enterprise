import { AutonomousFactoryOrchestratorService } from "./autonomous-factory-orchestrator.service";
import { FactoryAnalyticsService } from "./factory-analytics.service";
import { FactoryCertificationService } from "./factory-certification.service";
import { FactoryQueueService } from "./factory-queue.service";
import { FactoryResourceAllocationService } from "./factory-resource-allocation.service";
import { FactoryTelemetryService } from "./factory-telemetry.service";
import { IntelligentBuildPlannerService } from "./intelligent-build-planner.service";

function createService() {
  return new AutonomousFactoryOrchestratorService(
    new FactoryQueueService(),
    new IntelligentBuildPlannerService(),
    new FactoryResourceAllocationService(),
    new FactoryTelemetryService(),
    new FactoryAnalyticsService(),
    new FactoryCertificationService(),
  );
}

async function main() {
  const service = createService();
  const verification = service.verification();

  const requiredCapabilities = [
    "autonomous-factory-orchestrator",
    "production-queue-engine",
    "intelligent-build-planner",
    "parallel-generation-engine",
    "resource-allocation-engine",
    "production-telemetry",
    "enterprise-production-analytics",
    "quality-certification",
    "human-approval-gate",
  ];

  const missing = requiredCapabilities.filter(
    (capability) => !verification.capabilities.includes(capability),
  );

  if (!verification.healthy) {
    throw new Error("Factory bundle verification reported unhealthy state.");
  }

  if (!verification.humanFinalAuthority) {
    throw new Error("Human Final Authority must remain enabled.");
  }

  if (verification.packs.join(",") !== "10,11,12,13,14,15") {
    throw new Error("Bundle does not include all expected mega packs.");
  }

  if (missing.length > 0) {
    throw new Error(`Missing capabilities: ${missing.join(", ")}`);
  }

  console.log(
    JSON.stringify(
      {
        stage: "verified",
        classification: verification.classification,
        version: verification.version,
        packs: verification.packs,
        capabilities: verification.capabilities.length,
        healthy: verification.healthy,
        humanFinalAuthority: verification.humanFinalAuthority,
      },
      null,
      2,
    ),
  );
}

void main();
