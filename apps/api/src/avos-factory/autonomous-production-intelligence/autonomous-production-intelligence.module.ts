import { Module } from "@nestjs/common";
import { AutonomousFactoryController } from "./autonomous-factory.controller";
import { AutonomousFactoryOrchestratorService } from "./autonomous-factory-orchestrator.service";
import { FactoryAnalyticsService } from "./factory-analytics.service";
import { FactoryCertificationService } from "./factory-certification.service";
import { FactoryQueueService } from "./factory-queue.service";
import { FactoryResourceAllocationService } from "./factory-resource-allocation.service";
import { FactoryTelemetryService } from "./factory-telemetry.service";
import { IntelligentBuildPlannerService } from "./intelligent-build-planner.service";

@Module({
  controllers: [AutonomousFactoryController],
  providers: [
    FactoryQueueService,
    IntelligentBuildPlannerService,
    FactoryResourceAllocationService,
    FactoryTelemetryService,
    FactoryAnalyticsService,
    FactoryCertificationService,
    AutonomousFactoryOrchestratorService,
  ],
  exports: [AutonomousFactoryOrchestratorService],
})
export class AutonomousProductionIntelligenceModule {}
