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

  const item = service.createWorkItem({
    blueprintId: "blueprint:enterprise-product",
    projectName: "AVOS Enterprise Product",
    requestedBy: "system:smoke-test",
    priority: "critical",
    dependencies: [
      "capability:identity",
      "capability:governance",
      "capability:observability",
    ],
    estimatedUnits: 20,
    maxRetries: 2,
  });

  service.approve(item.id, {
    approvedBy: "human:khalifa",
  });

  const completed = await service.execute(item.id);
  const certification = service.certify(
    item.id,
    "human:khalifa",
  );
  const verification = service.verification();

  if (completed.status !== "completed") {
    throw new Error(`Unexpected work status: ${completed.status}`);
  }

  if (completed.qualityScore !== 100) {
    throw new Error(`Unexpected quality score: ${completed.qualityScore}`);
  }

  if (!certification.certified) {
    throw new Error(
      `Certification failed: ${certification.findings.join(", ")}`,
    );
  }

  console.log(
    JSON.stringify(
      {
        stage: "completed",
        packs: verification.packs,
        projectName: completed.projectName,
        workItemStatus: completed.status,
        qualityScore: completed.qualityScore,
        certified: certification.certified,
        certificationScore: certification.score,
        telemetryEvents: service.telemetryEvents().length,
        completedJobs: service.analytics().completedJobs,
        runtimeReady: verification.healthy,
        humanFinalAuthority: verification.humanFinalAuthority,
      },
      null,
      2,
    ),
  );
}

void main();
