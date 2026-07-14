import { Body, Controller, Get, Post } from "@nestjs/common";
import { AutonomousIntelligenceDecisionService } from "./autonomous-intelligence-decision.service";
import { StrategicGoalService } from "./services/strategic-goal.service";
import { MissionPlannerService } from "./services/mission-planner.service";
import { RoadmapPlannerService } from "./services/roadmap-planner.service";
import { ResourcePlannerService } from "./services/resource-planner.service";
import { ExecutionPlannerService } from "./services/execution-planner.service";
import { DependencyPlannerService } from "./services/dependency-planner.service";
import { RiskPlannerService } from "./services/risk-planner.service";
import { BudgetPlannerService } from "./services/budget-planner.service";
import { DecisionNodeService } from "./services/decision-node.service";
import { DecisionEdgeService } from "./services/decision-edge.service";
import { DecisionMemoryService } from "./services/decision-memory.service";
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

@Controller("autonomous-intelligence-decision")
export class AutonomousIntelligenceDecisionController {
  constructor(
    private readonly os: AutonomousIntelligenceDecisionService,
    private readonly goals: StrategicGoalService,
    private readonly missions: MissionPlannerService,
    private readonly roadmaps: RoadmapPlannerService,
    private readonly resources: ResourcePlannerService,
    private readonly executions: ExecutionPlannerService,
    private readonly dependencies: DependencyPlannerService,
    private readonly risks: RiskPlannerService,
    private readonly budgets: BudgetPlannerService,
    private readonly decisionNodes: DecisionNodeService,
    private readonly decisionEdges: DecisionEdgeService,
    private readonly decisionMemory: DecisionMemoryService,
    private readonly decisionLineage: DecisionLineageService,
    private readonly agents: AgentRegistryService,
    private readonly coordinator: AgentCoordinatorService,
    private readonly tasks: TaskDistributionService,
    private readonly consensus: ConsensusEngineService,
    private readonly negotiation: AgentNegotiationService,
    private readonly simulator: ScenarioSimulatorService,
    private readonly decisions: DecisionEngineService,
    private readonly executive: ExecutiveIntelligenceService,
    private readonly dashboard: DecisionDashboardService,
  ) {}

  @Get("health") health(){ return this.os.health(); }
  @Post("strategic-goals") strategicGoal(@Body() body:any){ return {success:true,goal:this.goals.create(body)}; }
  @Post("mission-plans") missionPlan(@Body() body:any){ return {success:true,plan:this.missions.create(body)}; }
  @Post("roadmap-plans") roadmapPlan(@Body() body:any){ return {success:true,plan:this.roadmaps.create(body)}; }
  @Post("resource-plans") resourcePlan(@Body() body:any){ return {success:true,plan:this.resources.create(body)}; }
  @Post("execution-plans") executionPlan(@Body() body:any){ return {success:true,plan:this.executions.create(body)}; }
  @Post("dependency-plans") dependencyPlan(@Body() body:any){ return {success:true,plan:this.dependencies.create(body)}; }
  @Post("risk-plans") riskPlan(@Body() body:any){ return {success:true,plan:this.risks.create(body)}; }
  @Post("budget-plans") budgetPlan(@Body() body:any){ return {success:true,plan:this.budgets.create(body)}; }
  @Post("decision-graph/nodes") decisionNode(@Body() body:any){ return {success:true,node:this.decisionNodes.create(body)}; }
  @Post("decision-graph/edges") decisionEdge(@Body() body:any){ return {success:true,edge:this.decisionEdges.create(body)}; }
  @Post("decision-memory") memory(@Body() body:any){ return {success:true,memory:this.decisionMemory.create(body)}; }
  @Post("decision-lineage") lineage(@Body() body:any){ return {success:true,lineage:this.decisionLineage.create(body)}; }
  @Post("agents") agent(@Body() body:any){ return {success:true,agent:this.agents.create(body)}; }
  @Post("agent-coordination") coordination(@Body() body:any){ return {success:true,result:this.coordinator.create(body)}; }
  @Post("agent-tasks") agentTask(@Body() body:any){ return {success:true,task:this.tasks.create(body)}; }
  @Post("consensus") consensusSession(@Body() body:any){ return {success:true,result:this.consensus.create(body)}; }
  @Post("agent-negotiation") negotiationSession(@Body() body:any){ return {success:true,result:this.negotiation.create(body)}; }
  @Post("simulations") simulation(@Body() body:any){ return {success:true,simulation:this.simulator.create(body)}; }
  @Post("decisions") decision(@Body() body:any){ return {success:true,decision:this.decisions.create(body)}; }
  @Post("executive-intelligence") executiveIntelligence(@Body() body:any){ return {success:true,result:this.executive.create(body)}; }
  @Get("operations/dashboard") operations(){ return {success:true,dashboard:this.dashboard.summary()}; }
}
