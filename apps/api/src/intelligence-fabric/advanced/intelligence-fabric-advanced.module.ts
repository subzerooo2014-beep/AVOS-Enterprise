import { Module } from "@nestjs/common";
import { IntelligenceFabricOrchestrationModule } from "../orchestration/intelligence-fabric-orchestration.module";
import { AdaptiveIntelligenceCoordinatorService } from "./if3/adaptive-intelligence-coordinator.service";
import { AdaptiveIntelligenceHealthService } from "./if3/adaptive-intelligence-health.service";
import { AdaptiveLearningMemoryService } from "./if3/adaptive-learning-memory.service";
import { IntelligenceAgentRegistryService } from "./if4/intelligence-agent-registry.service";
import { MultiAgentHealthService } from "./if4/multi-agent-health.service";
import { MultiAgentTaskOrchestratorService } from "./if4/multi-agent-task-orchestrator.service";
import { DecisionGovernanceService } from "./if5/decision-governance.service";
import { EnterpriseDecisionHealthService } from "./if5/enterprise-decision-health.service";
import { EnterpriseDecisionIntelligenceService } from "./if5/enterprise-decision-intelligence.service";
import { IntelligenceEvolutionEngineService } from "./if6/intelligence-evolution-engine.service";
import { IntelligenceFabricFinalCertificationService } from "./if6/intelligence-fabric-final-certification.service";
import { IntelligenceFabricFinalReviewService } from "./if6/intelligence-fabric-final-review.service";
import { IntelligenceFabricAdvancedController } from "./intelligence-fabric-advanced.controller";

@Module({
  imports: [IntelligenceFabricOrchestrationModule],
  controllers: [IntelligenceFabricAdvancedController],
  providers: [
    AdaptiveLearningMemoryService,
    AdaptiveIntelligenceCoordinatorService,
    AdaptiveIntelligenceHealthService,
    IntelligenceAgentRegistryService,
    MultiAgentTaskOrchestratorService,
    MultiAgentHealthService,
    EnterpriseDecisionIntelligenceService,
    DecisionGovernanceService,
    EnterpriseDecisionHealthService,
    IntelligenceEvolutionEngineService,
    IntelligenceFabricFinalReviewService,
    IntelligenceFabricFinalCertificationService,
  ],
  exports: [
    AdaptiveLearningMemoryService,
    AdaptiveIntelligenceCoordinatorService,
    AdaptiveIntelligenceHealthService,
    IntelligenceAgentRegistryService,
    MultiAgentTaskOrchestratorService,
    MultiAgentHealthService,
    EnterpriseDecisionIntelligenceService,
    DecisionGovernanceService,
    EnterpriseDecisionHealthService,
    IntelligenceEvolutionEngineService,
    IntelligenceFabricFinalReviewService,
    IntelligenceFabricFinalCertificationService,
  ],
})
export class IntelligenceFabricAdvancedModule {}