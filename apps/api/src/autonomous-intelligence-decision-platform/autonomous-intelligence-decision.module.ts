import { Module } from "@nestjs/common";
import { AutonomousIntelligenceDecisionController } from "./autonomous-intelligence-decision.controller";
import { AutonomousIntelligenceDecisionService } from "./autonomous-intelligence-decision.service";

import { StrategicGoalService } from "./services/strategic-goal.service";
import { MissionPlannerService } from "./services/mission-planner.service";
import { RoadmapPlannerService } from "./services/roadmap-planner.service";
import { ResourcePlannerService } from "./services/resource-planner.service";
import { ExecutionPlannerService } from "./services/execution-planner.service";
import { DependencyPlannerService } from "./services/dependency-planner.service";
import { RiskPlannerService } from "./services/risk-planner.service";
import { BudgetPlannerService } from "./services/budget-planner.service";
import { DecisionGraphService } from "./services/decision-graph.service";
import { DecisionNodeService } from "./services/decision-node.service";
import { DecisionEdgeService } from "./services/decision-edge.service";
import { DecisionMemoryService } from "./services/decision-memory.service";
import { DecisionHistoryService } from "./services/decision-history.service";
import { DecisionConfidenceService } from "./services/decision-confidence.service";
import { DecisionExplainabilityService } from "./services/decision-explainability.service";
import { DecisionLineageService } from "./services/decision-lineage.service";
import { AgentRegistryService } from "./services/agent-registry.service";
import { AgentCoordinatorService } from "./services/agent-coordinator.service";
import { TaskDistributionService } from "./services/task-distribution.service";
import { ConsensusEngineService } from "./services/consensus-engine.service";
import { AgentNegotiationService } from "./services/agent-negotiation.service";
import { ScenarioSimulatorService } from "./services/scenario-simulator.service";
import { DecisionEngineService } from "./services/decision-engine.service";
import { ExecutiveIntelligenceService } from "./services/executive-intelligence.service";
import { DecisionDashboardService } from "./services/decision-dashboard.service";

import { StrategicPlannerRuntime } from "./runtime/strategic-planner.runtime";
import { DecisionGraphRuntime } from "./runtime/decision-graph.runtime";
import { MultiAgentCoordinatorRuntime } from "./runtime/multi-agent-coordinator.runtime";
import { ConsensusRuntime } from "./runtime/consensus.runtime";
import { ScenarioSimulatorRuntime } from "./runtime/scenario-simulator.runtime";
import { DecisionEngineRuntime } from "./runtime/decision-engine.runtime";
import { OptimizationRuntime } from "./runtime/optimization.runtime";
import { ExecutiveIntelligenceRuntime } from "./runtime/executive-intelligence.runtime";

@Module({
  controllers:[AutonomousIntelligenceDecisionController],
  providers:[
    AutonomousIntelligenceDecisionService,
    StrategicGoalService,MissionPlannerService,RoadmapPlannerService,ResourcePlannerService,
    ExecutionPlannerService,DependencyPlannerService,RiskPlannerService,BudgetPlannerService,
    DecisionGraphService,DecisionNodeService,DecisionEdgeService,DecisionMemoryService,
    DecisionHistoryService,DecisionConfidenceService,DecisionExplainabilityService,DecisionLineageService,
    AgentRegistryService,AgentCoordinatorService,TaskDistributionService,ConsensusEngineService,
    AgentNegotiationService,ScenarioSimulatorService,DecisionEngineService,ExecutiveIntelligenceService,
    DecisionDashboardService,
    StrategicPlannerRuntime,DecisionGraphRuntime,MultiAgentCoordinatorRuntime,ConsensusRuntime,
    ScenarioSimulatorRuntime,DecisionEngineRuntime,OptimizationRuntime,ExecutiveIntelligenceRuntime
  ],
  exports:[AutonomousIntelligenceDecisionService],
})
export class AutonomousIntelligenceDecisionModule {}
