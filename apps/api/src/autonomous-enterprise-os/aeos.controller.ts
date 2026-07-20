import { Body, Controller, Get, Param, Post } from "@nestjs/common";
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
import { AeosVerificationService } from "./aeos-verification.service";
import { AeosCertificationService } from "./aeos-certification.service";

@Controller("avos/aeos")
export class AeosController {
  constructor(
    private readonly goals: EnterpriseGoalManagerService,
    private readonly planner: AutonomousPlannerService,
    private readonly decisions: MultiObjectiveDecisionEngineService,
    private readonly agents: EnterpriseAgentOrchestratorService,
    private readonly resources: ResourceOptimizationService,
    private readonly predictive: PredictiveOperationsService,
    private readonly healing: SelfHealingCoordinatorService,
    private readonly learning: ContinuousLearningService,
    private readonly feedback: EnterpriseFeedbackLoopService,
    private readonly policy: PolicyAwareAutomationService,
    private readonly approvals: HumanApprovalGateService,
    private readonly execution: UrpAutonomousExecutionService,
    private readonly verification: AeosVerificationService,
    private readonly certification: AeosCertificationService,
  ) {}

  @Get("status")
  status() {
    return {
      name: "AVOS Autonomous Enterprise OS",
      version: "AEOS-1.0.0",
      status: "operational",
      goals: this.goals.list().length,
      plans: this.planner.list().length,
      decisions: this.decisions.list().length,
      agents: this.agents.registry().length,
      lessons: this.learning.list().length,
      humanFinalAuthority: true,
      globalComplianceReadinessGate: true,
    };
  }

  @Post("goals")
  createGoal(@Body() input: Parameters<EnterpriseGoalManagerService["create"]>[0]) {
    return this.goals.create(input);
  }

  @Post("goals/:id/activate")
  activateGoal(
    @Param("id") id: string,
    @Body() input: { approvedBy?: string },
  ) {
    return this.goals.activate(id, input.approvedBy ?? "human:khalifa");
  }

  @Get("goals")
  listGoals() {
    return this.goals.list();
  }

  @Post("plans/:goalId/generate")
  generatePlan(@Param("goalId") goalId: string) {
    return this.planner.generate(goalId);
  }

  @Post("plans/:planId/approve")
  approvePlan(
    @Param("planId") planId: string,
    @Body() input: { approvedBy?: string },
  ) {
    return this.planner.approve(
      planId,
      input.approvedBy ?? "human:khalifa",
    );
  }

  @Get("plans")
  listPlans() {
    return this.planner.list();
  }

  @Post("decisions/:goalId")
  decide(
    @Param("goalId") goalId: string,
    @Body() input: { options: Parameters<MultiObjectiveDecisionEngineService["decide"]>[1] },
  ) {
    return this.decisions.decide(goalId, input.options);
  }

  @Post("orchestration/:planId")
  orchestrate(@Param("planId") planId: string) {
    return this.agents.orchestrate(this.planner.find(planId));
  }

  @Post("resources/:planId/optimize")
  optimize(@Param("planId") planId: string) {
    return this.resources.optimize(this.planner.find(planId));
  }

  @Post("predict")
  predict(@Body() input: Parameters<PredictiveOperationsService["forecast"]>[0]) {
    return this.predictive.forecast(input);
  }

  @Post("self-healing")
  selfHealing(@Body() input: Parameters<SelfHealingCoordinatorService["coordinate"]>[0]) {
    return this.healing.coordinate(input);
  }

  @Post("policy/evaluate")
  evaluatePolicy(@Body() input: Parameters<PolicyAwareAutomationService["evaluate"]>[0]) {
    return this.policy.evaluate(input);
  }

  @Post("approvals/:id/decide")
  decideApproval(
    @Param("id") id: string,
    @Body() input: { decision: "approved" | "rejected"; decidedBy?: string },
  ) {
    return this.approvals.decide(
      id,
      input.decision,
      input.decidedBy ?? "human:khalifa",
    );
  }

  @Get("approvals")
  approvalsList() {
    return this.approvals.list();
  }

  @Post("execute/:planId")
  execute(
    @Param("planId") planId: string,
    @Body() input: { approvedBy?: string },
  ) {
    return this.execution.execute(
      this.planner.find(planId),
      input.approvedBy,
    );
  }

  @Post("feedback")
  closeFeedback(@Body() input: Parameters<EnterpriseFeedbackLoopService["close"]>[0]) {
    return this.feedback.close(input);
  }

  @Get("learning")
  learningProfile() {
    return {
      profile: this.learning.profile(),
      lessons: this.learning.list(),
    };
  }
  @Post("verification/run")
  verify() {
    return this.verification.run();
  }

  @Post("certification/certify")
  certify(@Body() input: { approvedBy?: string }) {
    return this.certification.certify(
      input?.approvedBy ?? "human:khalifa",
    );
  }

  @Get("certification/status")
  certificationStatus() {
    return this.certification.status();
  }
}