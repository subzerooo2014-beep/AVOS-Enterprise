import {
  Body,
  Controller,
  Get,
  Param,
  Post
} from "@nestjs/common";
import { EnterpriseBrainMegaPack3Service } from "./enterprise-brain-mega-pack-3.service";
import { BrainRuleRegistryService } from "./reasoning/brain-rule-registry.service";
import { BrainConstraintEngineService } from "./constraints/brain-constraint-engine.service";
import { BrainCausalGraphService } from "./causal/brain-causal-graph.service";
import { BrainDecisionGraphService } from "./decision-graph/brain-decision-graph.service";
import { BrainReasoningEngineService } from "./reasoning/brain-reasoning-engine.service";
import { BrainPlanningEngineService } from "./planning/brain-planning-engine.service";
import { BrainRecoveryPlannerService } from "./recovery/brain-recovery-planner.service";
import { BrainReasoningPlanningHealthService } from "./health/brain-reasoning-planning-health.service";
import { BrainReasoningAuditService } from "./observability/brain-reasoning-audit.service";
import {
  BrainCausalEdge,
  BrainCausalNode,
  BrainConstraint,
  BrainDecisionGraphEdge,
  BrainDecisionGraphNode,
  BrainPlanTask,
  BrainRecoveryPlan,
  BrainRule
} from "./enterprise-brain-mega-pack-3.types";

@Controller("enterprise-brain-v3")
export class EnterpriseBrainMegaPack3Controller {
  constructor(
    private readonly pack: EnterpriseBrainMegaPack3Service,
    private readonly rules: BrainRuleRegistryService,
    private readonly constraints: BrainConstraintEngineService,
    private readonly causal: BrainCausalGraphService,
    private readonly decisionGraph: BrainDecisionGraphService,
    private readonly reasoning: BrainReasoningEngineService,
    private readonly planning: BrainPlanningEngineService,
    private readonly recovery: BrainRecoveryPlannerService,
    private readonly health: BrainReasoningPlanningHealthService,
    private readonly audit: BrainReasoningAuditService
  ) {}

  @Get("status")
  status() {
    return this.pack.status();
  }

  @Get("verification")
  verification() {
    return this.pack.verification();
  }

  @Get("rules")
  ruleList() {
    return {
      summary: this.rules.summary(),
      items: this.rules.list()
    };
  }

  @Post("rules")
  registerRule(
    @Body()
    body: {
      rule: Omit<BrainRule, "createdAt" | "updatedAt">;
      actorIdentityId: string;
      correlationId: string;
    }
  ) {
    return this.rules.register(
      body.rule,
      {
        actorIdentityId: body.actorIdentityId,
        correlationId: body.correlationId
      }
    );
  }

  @Get("constraints")
  constraintList() {
    return {
      summary: this.constraints.summary(),
      items: this.constraints.list()
    };
  }

  @Post("constraints")
  registerConstraint(
    @Body()
    body: {
      constraint: Omit<BrainConstraint, "createdAt" | "updatedAt">;
      actorIdentityId: string;
      correlationId: string;
    }
  ) {
    return this.constraints.register(
      body.constraint,
      {
        actorIdentityId: body.actorIdentityId,
        correlationId: body.correlationId
      }
    );
  }

  @Post("causal/nodes")
  createCausalNode(
    @Body()
    body: Omit<BrainCausalNode, "createdAt" | "updatedAt">
  ) {
    return this.causal.createNode(body);
  }

  @Post("causal/edges")
  createCausalEdge(
    @Body()
    body: Omit<BrainCausalEdge, "createdAt" | "updatedAt">
  ) {
    return this.causal.createEdge(body);
  }

  @Get("causal")
  causalState() {
    return {
      summary: this.causal.summary(),
      nodes: this.causal.listNodes(),
      edges: this.causal.listEdges()
    };
  }

  @Get("causal/:id/effects")
  causalEffects(@Param("id") id: string) {
    return this.causal.effectsOf(id);
  }

  @Post("decision-graph/nodes")
  createDecisionNode(
    @Body()
    body: Omit<BrainDecisionGraphNode, "createdAt" | "updatedAt">
  ) {
    return this.decisionGraph.createNode(body);
  }

  @Post("decision-graph/edges")
  createDecisionEdge(
    @Body()
    body: Omit<BrainDecisionGraphEdge, "createdAt" | "updatedAt">
  ) {
    return this.decisionGraph.createEdge(body);
  }

  @Get("decision-graph")
  decisionGraphState() {
    return {
      summary: this.decisionGraph.summary(),
      nodes: this.decisionGraph.listNodes(),
      edges: this.decisionGraph.listEdges(),
      evaluation: this.decisionGraph.evaluate()
    };
  }

  @Post("reasoning/run")
  runReasoning(
    @Body()
    body: {
      question: string;
      context: Record<string, unknown>;
      ruleIds: string[];
      constraintIds: string[];
      causalNodeId?: string;
      createdByIdentityId: string;
      correlationId: string;
      traceId?: string;
    }
  ) {
    return this.reasoning.execute(body);
  }

  @Get("reasoning")
  reasoningList() {
    return {
      summary: this.reasoning.summary(),
      items: this.reasoning.list()
    };
  }

  @Post("plans")
  createPlan(
    @Body()
    body: {
      goalId: string;
      name: string;
      description: string;
      strategy: string;
      tasks: Array<Omit<
        BrainPlanTask,
        "status" | "startedAt" | "completedAt" | "result" | "error"
      >>;
      reversible: boolean;
      createdByIdentityId: string;
      correlationId: string;
      traceId?: string;
    }
  ) {
    return this.planning.create(body);
  }

  @Post("plans/:id/approve")
  approvePlan(
    @Param("id") id: string,
    @Body()
    body: {
      approvedByIdentityId: string;
      correlationId: string;
    }
  ) {
    return this.planning.approve({
      planId: id,
      ...body
    });
  }

  @Post("plans/:id/execute")
  executePlan(
    @Param("id") id: string,
    @Body()
    body: {
      actorIdentityId: string;
      correlationId: string;
    }
  ) {
    return this.planning.execute({
      planId: id,
      ...body
    });
  }

  @Get("plans")
  planList() {
    return {
      summary: this.planning.summary(),
      items: this.planning.list()
    };
  }

  @Post("recovery-plans")
  createRecoveryPlan(
    @Body()
    body: {
      executionPlanId: string;
      triggers: string[];
      actions: BrainRecoveryPlan["actions"];
      actorIdentityId: string;
      correlationId: string;
    }
  ) {
    return this.recovery.create(body);
  }

  @Post("recovery-plans/:id/execute")
  executeRecoveryPlan(
    @Param("id") id: string,
    @Body()
    body: {
      actorIdentityId: string;
      correlationId: string;
    }
  ) {
    return this.recovery.execute({
      recoveryPlanId: id,
      ...body
    });
  }

  @Get("recovery-plans")
  recoveryPlanList() {
    return {
      summary: this.recovery.summary(),
      items: this.recovery.list()
    };
  }

  @Post("health/calculate")
  calculateHealth(
    @Body()
    body: {
      actorIdentityId: string;
      correlationId: string;
    }
  ) {
    return this.health.calculate(body);
  }

  @Get("health")
  healthList() {
    return {
      summary: this.health.summary(),
      items: this.health.list()
    };
  }

  @Get("audit")
  auditList() {
    return {
      summary: this.audit.summary(),
      items: this.audit.list()
    };
  }
}
