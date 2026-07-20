import { Module } from "@nestjs/common";
import { AdaptiveGrowthApprovalGovernanceModule } from "../approval-governance/adaptive-growth-approval-governance.module";
import { AdaptiveGrowthExecutionCoreModule } from "../execution-core/adaptive-growth-execution-core.module";
import { AdaptiveGrowthAgentRegistryService } from "./adaptive-growth-agent-registry.service";
import { AdaptiveGrowthAlertService } from "./adaptive-growth-alert.service";
import { AdaptiveGrowthCapabilityDispatcherService } from "./adaptive-growth-capability-dispatcher.service";
import { AdaptiveGrowthCapabilityRegistryService } from "./adaptive-growth-capability-registry.service";
import { AdaptiveGrowthDisasterRecoveryService } from "./adaptive-growth-disaster-recovery.service";
import { AdaptiveGrowthEnterpriseEventBusService } from "./adaptive-growth-enterprise-event-bus.service";
import { AdaptiveGrowthEnterpriseOrchestratorService } from "./adaptive-growth-enterprise-orchestrator.service";
import { AdaptiveGrowthLearningEngineService } from "./adaptive-growth-learning-engine.service";
import { AdaptiveGrowthMetricsService } from "./adaptive-growth-metrics.service";
import { AdaptiveGrowthMultiAgentCoordinatorService } from "./adaptive-growth-multi-agent-coordinator.service";
import { AdaptiveGrowthPlatformHealthService } from "./adaptive-growth-platform-health.service";
import { AdaptiveGrowthPlatformSecurityService } from "./adaptive-growth-platform-security.service";
import { AdaptiveGrowthResilienceService } from "./adaptive-growth-resilience.service";
import { AdaptiveGrowthScalabilityService } from "./adaptive-growth-scalability.service";
import { AdaptiveGrowthStrategyOptimizerService } from "./adaptive-growth-strategy-optimizer.service";
import { AdaptiveGrowthUltimateArchitectureReviewService } from "./adaptive-growth-ultimate-architecture-review.service";
import { AdaptiveGrowthUltimateCertificationService } from "./adaptive-growth-ultimate-certification.service";
import { AdaptiveGrowthUltimateController } from "./adaptive-growth-ultimate.controller";
import { AdaptiveGrowthUltimateIdService } from "./adaptive-growth-ultimate-id.service";
import { AdaptiveGrowthUltimatePlatformService } from "./adaptive-growth-ultimate-platform.service";
import { AdaptiveGrowthUltimateReadinessService } from "./adaptive-growth-ultimate-readiness.service";
import { AdaptiveGrowthUltimateSmokeService } from "./adaptive-growth-ultimate-smoke.service";
import { AdaptiveGrowthUltimateStoreService } from "./adaptive-growth-ultimate-store.service";
import { AdaptiveGrowthUltimateVerificationService } from "./adaptive-growth-ultimate-verification.service";
import { AdaptiveGrowthWorkflowEngineService } from "./adaptive-growth-workflow-engine.service";
import { AdaptiveGrowthWorkflowSchedulerService } from "./adaptive-growth-workflow-scheduler.service";

@Module({
  imports: [
    AdaptiveGrowthExecutionCoreModule,
    AdaptiveGrowthApprovalGovernanceModule,
  ],
  controllers: [AdaptiveGrowthUltimateController],
  providers: [
    AdaptiveGrowthUltimateIdService,
    AdaptiveGrowthUltimateStoreService,
    AdaptiveGrowthCapabilityRegistryService,
    AdaptiveGrowthCapabilityDispatcherService,
    AdaptiveGrowthEnterpriseEventBusService,
    AdaptiveGrowthEnterpriseOrchestratorService,
    AdaptiveGrowthWorkflowEngineService,
    AdaptiveGrowthWorkflowSchedulerService,
    AdaptiveGrowthMetricsService,
    AdaptiveGrowthAlertService,
    AdaptiveGrowthPlatformHealthService,
    AdaptiveGrowthLearningEngineService,
    AdaptiveGrowthStrategyOptimizerService,
    AdaptiveGrowthAgentRegistryService,
    AdaptiveGrowthMultiAgentCoordinatorService,
    AdaptiveGrowthResilienceService,
    AdaptiveGrowthPlatformSecurityService,
    AdaptiveGrowthScalabilityService,
    AdaptiveGrowthDisasterRecoveryService,
    AdaptiveGrowthUltimatePlatformService,
    AdaptiveGrowthUltimateArchitectureReviewService,
    AdaptiveGrowthUltimateVerificationService,
    AdaptiveGrowthUltimateSmokeService,
    AdaptiveGrowthUltimateReadinessService,
    AdaptiveGrowthUltimateCertificationService,
  ],
  exports: [
    AdaptiveGrowthUltimatePlatformService,
    AdaptiveGrowthEnterpriseOrchestratorService,
    AdaptiveGrowthWorkflowEngineService,
  ],
})
export class AdaptiveGrowthUltimatePlatformModule {}