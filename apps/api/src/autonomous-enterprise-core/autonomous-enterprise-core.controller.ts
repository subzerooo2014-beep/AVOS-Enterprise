import { Body, Controller, Get, Post } from "@nestjs/common";
import { AutonomousEnterpriseCoreService } from "./autonomous-enterprise-core.service";
import { EvolutionProposalService } from "./services/evolution-proposal.service";
import { EvolutionApprovalService } from "./services/evolution-approval.service";
import { EvolutionExecutionService } from "./services/evolution-execution.service";
import { ReleaseAdvisorService } from "./services/release-advisor.service";
import { PerformanceDnaService } from "./services/performance-dna.service";
import { DecisionDnaService } from "./services/decision-dna.service";
import { AutonomousOptimizationService } from "./services/autonomous-optimization.service";
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
import { AutonomousEnterpriseDashboardService } from "./services/autonomous-enterprise-dashboard.service";

@Controller("autonomous-enterprise-core")
export class AutonomousEnterpriseCoreController {
  constructor(
    private readonly os: AutonomousEnterpriseCoreService,
    private readonly proposals: EvolutionProposalService,
    private readonly approvals: EvolutionApprovalService,
    private readonly executions: EvolutionExecutionService,
    private readonly releaseAdvisor: ReleaseAdvisorService,
    private readonly performanceDna: PerformanceDnaService,
    private readonly decisionDna: DecisionDnaService,
    private readonly optimization: AutonomousOptimizationService,
    private readonly learning: ContinuousLearningService,
    private readonly coach: EnterpriseCoachService,
    private readonly strategicPlanner: StrategicPlannerService,
    private readonly decisionGraph: DecisionGraphExtensionService,
    private readonly workflowEvolution: WorkflowEvolutionService,
    private readonly architectureEvolution: ArchitectureEvolutionService,
    private readonly resourceOptimization: ResourceOptimizationService,
    private readonly governance: GovernanceIntelligenceService,
    private readonly policyEvolution: PolicyEvolutionService,
    private readonly executiveBrain: ExecutiveAiBrainService,
    private readonly dashboard: AutonomousEnterpriseDashboardService,
  ) {}

  @Get("health") health(){ return this.os.health(); }
  @Post("evolution/proposals") evolutionProposal(@Body() b:any){ return {success:true,proposal:this.proposals.create(b)}; }
  @Post("evolution/approvals") evolutionApproval(@Body() b:any){ return {success:true,approval:this.approvals.create(b)}; }
  @Post("evolution/executions") evolutionExecution(@Body() b:any){ return {success:true,execution:this.executions.create(b)}; }
  @Post("release-advisor") releaseAssessment(@Body() b:any){ return {success:true,result:this.releaseAdvisor.create(b)}; }
  @Post("performance-dna") createPerformanceDna(@Body() b:any){ return {success:true,result:this.performanceDna.create(b)}; }
  @Post("decision-dna") createDecisionDna(@Body() b:any){ return {success:true,result:this.decisionDna.create(b)}; }
  @Post("optimization") optimize(@Body() b:any){ return {success:true,result:this.optimization.create(b)}; }
  @Post("learning-cycles") learningCycle(@Body() b:any){ return {success:true,result:this.learning.create(b)}; }
  @Post("enterprise-coach") coaching(@Body() b:any){ return {success:true,result:this.coach.create(b)}; }
  @Post("strategic-planner") strategicPlan(@Body() b:any){ return {success:true,result:this.strategicPlanner.create(b)}; }
  @Post("decision-graph/extend") extendDecisionGraph(@Body() b:any){ return {success:true,result:this.decisionGraph.create(b)}; }
  @Post("workflow-evolution") evolveWorkflow(@Body() b:any){ return {success:true,result:this.workflowEvolution.create(b)}; }
  @Post("architecture-evolution") evolveArchitecture(@Body() b:any){ return {success:true,result:this.architectureEvolution.create(b)}; }
  @Post("resource-optimization") optimizeResources(@Body() b:any){ return {success:true,result:this.resourceOptimization.create(b)}; }
  @Post("governance-intelligence") governanceEvaluation(@Body() b:any){ return {success:true,result:this.governance.create(b)}; }
  @Post("policy-evolution") evolvePolicy(@Body() b:any){ return {success:true,result:this.policyEvolution.create(b)}; }
  @Post("executive-ai-brain") executiveBrainRequest(@Body() b:any){ return {success:true,result:this.executiveBrain.create(b)}; }
  @Get("operations/dashboard") operations(){ return {success:true,dashboard:this.dashboard.summary()}; }
}
