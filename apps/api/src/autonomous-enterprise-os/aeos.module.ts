import { Aeos12StrategyDecisionIntelligenceModule } from './strategy-decision-intelligence/aeos-1.2.module';
import { AeosCertificationService } from "./aeos-certification.service";
import { AeosVerificationService } from "./aeos-verification.service";
import { Module } from "@nestjs/common";
import { AeosController } from "./aeos.controller";
import { AutonomousPlannerService } from "./autonomous-planner.service";
import { ContinuousLearningService } from "./continuous-learning.service";
import { EnterpriseAgentOrchestratorService } from "./enterprise-agent-orchestrator.service";
import { EnterpriseFeedbackLoopService } from "./enterprise-feedback-loop.service";
import { EnterpriseGoalManagerService } from "./enterprise-goal-manager.service";
import { HumanApprovalGateService } from "./human-approval-gate.service";
import { MultiObjectiveDecisionEngineService } from "./multi-objective-decision-engine.service";
import { PolicyAwareAutomationService } from "./policy-aware-automation.service";
import { PredictiveOperationsService } from "./predictive-operations.service";
import { ResourceOptimizationService } from "./resource-optimization.service";
import { SelfHealingCoordinatorService } from "./self-healing-coordinator.service";
import { UrpAutonomousExecutionService } from "./urp-autonomous-execution.service";

import { AeosProductionModule } from "./production-hardening/aeos-production.module";
@Module({
  imports: [
    Aeos12StrategyDecisionIntelligenceModule,AeosProductionModule],
  controllers: [AeosController],
  providers: [
    EnterpriseGoalManagerService,
    AutonomousPlannerService,
    MultiObjectiveDecisionEngineService,
    EnterpriseAgentOrchestratorService,
    ResourceOptimizationService,
    PredictiveOperationsService,
    SelfHealingCoordinatorService,
    ContinuousLearningService,
    EnterpriseFeedbackLoopService,
    PolicyAwareAutomationService,
    HumanApprovalGateService,
    UrpAutonomousExecutionService,
    AeosVerificationService,
    AeosCertificationService,
  ],
  exports: [
    EnterpriseGoalManagerService,
    AutonomousPlannerService,
    MultiObjectiveDecisionEngineService,
    EnterpriseAgentOrchestratorService,
    PolicyAwareAutomationService,
    HumanApprovalGateService,
    UrpAutonomousExecutionService,
    AeosVerificationService,
    AeosCertificationService,
  ],
})
export class AeosModule {}
