import { Module } from '@nestjs/common';
import { Aeos12Controller } from './aeos-1.2.controller';
import { Aeos12OrchestratorService } from './aeos-1.2-orchestrator.service';
import { EnterpriseMissionRegistryService } from './mission-goal/enterprise-mission-registry.service';
import { StrategicGoalEngineService } from './mission-goal/strategic-goal-engine.service';
import { ObjectiveHierarchyManagerService } from './mission-goal/objective-hierarchy-manager.service';
import { KpiAlignmentEngineService } from './mission-goal/kpi-alignment-engine.service';
import { InitiativeRegistryService } from './mission-goal/initiative-registry.service';
import { BusinessPriorityEngineService } from './mission-goal/business-priority-engine.service';
import { GoalDependencyGraphService } from './mission-goal/goal-dependency-graph.service';
import { MissionTimelineService } from './mission-goal/mission-timeline.service';
import { EnterpriseObjectiveHealthService } from './mission-goal/enterprise-objective-health.service';
import { GoalCertificationService } from './mission-goal/goal-certification.service';
import { DecisionEngineService } from './decision-intelligence/decision-engine.service';
import { ExplainableDecisionEngineService } from './decision-intelligence/explainable-decision-engine.service';
import { DecisionMemoryService } from './decision-intelligence/decision-memory.service';
import { DecisionTraceabilityService } from './decision-intelligence/decision-traceability.service';
import { DecisionConfidenceScoreService } from './decision-intelligence/decision-confidence-score.service';
import { MultiScenarioEvaluatorService } from './decision-intelligence/multi-scenario-evaluator.service';
import { RiskAwareDecisionEngineService } from './decision-intelligence/risk-aware-decision-engine.service';
import { HumanApprovalIntegrationService } from './decision-intelligence/human-approval-integration.service';
import { DecisionLearningService } from './decision-intelligence/decision-learning.service';
import { DecisionCertificationService } from './decision-intelligence/decision-certification.service';
import { StrategicPlannerService } from './autonomous-planning/strategic-planner.service';
import { TacticalPlannerService } from './autonomous-planning/tactical-planner.service';
import { OperationalPlannerService } from './autonomous-planning/operational-planner.service';
import { ResourcePlannerService } from './autonomous-planning/resource-planner.service';
import { CapacityPlannerService } from './autonomous-planning/capacity-planner.service';
import { ScheduleOptimizerService } from './autonomous-planning/schedule-optimizer.service';
import { DependencyPlannerService } from './autonomous-planning/dependency-planner.service';
import { ConstraintSolverService } from './autonomous-planning/constraint-solver.service';
import { PlanVerificationService } from './autonomous-planning/plan-verification.service';
import { PlanHealthService } from './autonomous-planning/plan-health.service';
import { ExecutiveAgentService } from './multi-agent-coordination/executive-agent.service';
import { FinanceAgentService } from './multi-agent-coordination/finance-agent.service';
import { OperationsAgentService } from './multi-agent-coordination/operations-agent.service';
import { SalesAgentService } from './multi-agent-coordination/sales-agent.service';
import { MarketingAgentService } from './multi-agent-coordination/marketing-agent.service';
import { HrAgentService } from './multi-agent-coordination/hr-agent.service';
import { LegalAgentService } from './multi-agent-coordination/legal-agent.service';
import { ComplianceAgentService } from './multi-agent-coordination/compliance-agent.service';
import { CoordinationEngineService } from './multi-agent-coordination/coordination-engine.service';
import { ConflictResolverService } from './multi-agent-coordination/conflict-resolver.service';
import { EnterpriseMissionExecutorService } from './execution-intelligence/enterprise-mission-executor.service';
import { AdaptiveExecutionEngineService } from './execution-intelligence/adaptive-execution-engine.service';
import { ExecutionOptimizerService } from './execution-intelligence/execution-optimizer.service';
import { ContinuousFeedbackLoopService } from './execution-intelligence/continuous-feedback-loop.service';
import { GoalAchievementTrackerService } from './execution-intelligence/goal-achievement-tracker.service';
import { RecoveryPlannerService } from './execution-intelligence/recovery-planner.service';
import { ExecutionLearningService } from './execution-intelligence/execution-learning.service';
import { ExecutionAnalyticsService } from './execution-intelligence/execution-analytics.service';
import { AutonomousImprovementService } from './execution-intelligence/autonomous-improvement.service';
import { ExecutiveDashboardService } from './execution-intelligence/executive-dashboard.service';

@Module({
  controllers: [Aeos12Controller],
  providers: [
    Aeos12OrchestratorService,
    EnterpriseMissionRegistryService,
    StrategicGoalEngineService,
    ObjectiveHierarchyManagerService,
    KpiAlignmentEngineService,
    InitiativeRegistryService,
    BusinessPriorityEngineService,
    GoalDependencyGraphService,
    MissionTimelineService,
    EnterpriseObjectiveHealthService,
    GoalCertificationService,
    DecisionEngineService,
    ExplainableDecisionEngineService,
    DecisionMemoryService,
    DecisionTraceabilityService,
    DecisionConfidenceScoreService,
    MultiScenarioEvaluatorService,
    RiskAwareDecisionEngineService,
    HumanApprovalIntegrationService,
    DecisionLearningService,
    DecisionCertificationService,
    StrategicPlannerService,
    TacticalPlannerService,
    OperationalPlannerService,
    ResourcePlannerService,
    CapacityPlannerService,
    ScheduleOptimizerService,
    DependencyPlannerService,
    ConstraintSolverService,
    PlanVerificationService,
    PlanHealthService,
    ExecutiveAgentService,
    FinanceAgentService,
    OperationsAgentService,
    SalesAgentService,
    MarketingAgentService,
    HrAgentService,
    LegalAgentService,
    ComplianceAgentService,
    CoordinationEngineService,
    ConflictResolverService,
    EnterpriseMissionExecutorService,
    AdaptiveExecutionEngineService,
    ExecutionOptimizerService,
    ContinuousFeedbackLoopService,
    GoalAchievementTrackerService,
    RecoveryPlannerService,
    ExecutionLearningService,
    ExecutionAnalyticsService,
    AutonomousImprovementService,
    ExecutiveDashboardService,
  ],
  exports: [Aeos12OrchestratorService],
})
export class Aeos12StrategyDecisionIntelligenceModule {}
