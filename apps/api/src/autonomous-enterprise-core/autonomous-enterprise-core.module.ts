import { Module } from "@nestjs/common";
import { AutonomousEnterpriseCoreController } from "./autonomous-enterprise-core.controller";
import { AutonomousEnterpriseCoreService } from "./autonomous-enterprise-core.service";

import { EvolutionProposalService } from "./services/evolution-proposal.service";
import { EvolutionApprovalService } from "./services/evolution-approval.service";
import { EvolutionExecutionService } from "./services/evolution-execution.service";
import { ReleaseAdvisorService } from "./services/release-advisor.service";
import { ReleaseReadinessService } from "./services/release-readiness.service";
import { PerformanceDnaService } from "./services/performance-dna.service";
import { DecisionDnaService } from "./services/decision-dna.service";
import { AutonomousOptimizationService } from "./services/autonomous-optimization.service";
import { LearningCycleService } from "./services/learning-cycle.service";
import { ContinuousLearningService } from "./services/continuous-learning.service";
import { EnterpriseCoachService } from "./services/enterprise-coach.service";
import { StrategicPlannerService } from "./services/strategic-planner.service";
import { DecisionGraphExtensionService } from "./services/decision-graph-extension.service";
import { WorkflowEvolutionService } from "./services/workflow-evolution.service";
import { ArchitectureEvolutionService } from "./services/architecture-evolution.service";
import { ResourceOptimizationService } from "./services/resource-optimization.service";
import { GovernanceIntelligenceService } from "./services/governance-intelligence.service";
import { PolicyEvolutionService } from "./services/policy-evolution.service";
import { ExecutiveAiBrainService } from "./services/executive-ai-brain.service";
import { TransformationPlanService } from "./services/transformation-plan.service";
import { CapabilityEvolutionService } from "./services/capability-evolution.service";
import { RiskAdaptationService } from "./services/risk-adaptation.service";
import { AutonomousReviewService } from "./services/autonomous-review.service";
import { EvolutionMetricsService } from "./services/evolution-metrics.service";
import { AutonomousEnterpriseDashboardService } from "./services/autonomous-enterprise-dashboard.service";

import { SelfEvolutionRuntime } from "./runtime/self-evolution.runtime";
import { ReleaseAdvisorRuntime } from "./runtime/release-advisor.runtime";
import { PerformanceDnaRuntime } from "./runtime/performance-dna.runtime";
import { DecisionDnaRuntime } from "./runtime/decision-dna.runtime";
import { AutonomousOptimizationRuntime } from "./runtime/autonomous-optimization.runtime";
import { ContinuousLearningRuntime } from "./runtime/continuous-learning.runtime";
import { EnterpriseCoachRuntime } from "./runtime/enterprise-coach.runtime";
import { ExecutiveAiBrainRuntime } from "./runtime/executive-ai-brain.runtime";

@Module({
  controllers:[AutonomousEnterpriseCoreController],
  providers:[
    AutonomousEnterpriseCoreService,
    EvolutionProposalService,EvolutionApprovalService,EvolutionExecutionService,ReleaseAdvisorService,
    ReleaseReadinessService,PerformanceDnaService,DecisionDnaService,AutonomousOptimizationService,
    LearningCycleService,ContinuousLearningService,EnterpriseCoachService,StrategicPlannerService,
    DecisionGraphExtensionService,WorkflowEvolutionService,ArchitectureEvolutionService,ResourceOptimizationService,
    GovernanceIntelligenceService,PolicyEvolutionService,ExecutiveAiBrainService,TransformationPlanService,
    CapabilityEvolutionService,RiskAdaptationService,AutonomousReviewService,EvolutionMetricsService,
    AutonomousEnterpriseDashboardService,
    SelfEvolutionRuntime,ReleaseAdvisorRuntime,PerformanceDnaRuntime,DecisionDnaRuntime,
    AutonomousOptimizationRuntime,ContinuousLearningRuntime,EnterpriseCoachRuntime,ExecutiveAiBrainRuntime
  ],
  exports:[AutonomousEnterpriseCoreService],
})
export class AutonomousEnterpriseCoreModule {}
