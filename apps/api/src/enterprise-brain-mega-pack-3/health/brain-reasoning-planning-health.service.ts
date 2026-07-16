import { Injectable } from "@nestjs/common";
import { BrainReasoningPlanningHealthIndex } from "../enterprise-brain-mega-pack-3.types";
import { BrainRuleRegistryService } from "../reasoning/brain-rule-registry.service";
import { BrainConstraintEngineService } from "../constraints/brain-constraint-engine.service";
import { BrainCausalGraphService } from "../causal/brain-causal-graph.service";
import { BrainReasoningEngineService } from "../reasoning/brain-reasoning-engine.service";
import { BrainDecisionGraphService } from "../decision-graph/brain-decision-graph.service";
import { BrainPlanningEngineService } from "../planning/brain-planning-engine.service";
import { BrainRecoveryPlannerService } from "../recovery/brain-recovery-planner.service";
import { BrainReasoningAuditService } from "../observability/brain-reasoning-audit.service";

@Injectable()
export class BrainReasoningPlanningHealthService {
  private readonly indexes =
    new Map<string, BrainReasoningPlanningHealthIndex>();

  constructor(
    private readonly rules: BrainRuleRegistryService,
    private readonly constraints: BrainConstraintEngineService,
    private readonly causal: BrainCausalGraphService,
    private readonly reasoning: BrainReasoningEngineService,
    private readonly decisionGraph: BrainDecisionGraphService,
    private readonly planning: BrainPlanningEngineService,
    private readonly recovery: BrainRecoveryPlannerService,
    private readonly audit: BrainReasoningAuditService
  ) {}

  list() {
    return Array.from(this.indexes.values());
  }

  calculate(input: {
    actorIdentityId: string;
    correlationId: string;
  }) {
    const rules = this.rules.summary();
    const constraints = this.constraints.summary();
    const causal = this.causal.summary();
    const reasoning = this.reasoning.summary();
    const decisions = this.decisionGraph.summary();
    const planning = this.planning.summary();
    const recovery = this.recovery.summary();

    const ruleScore =
      rules.active >= 3 ? 100 : 70;

    const constraintScore =
      constraints.active >= 2 ? 100 : 70;

    const causalScore =
      causal.nodes === 0
        ? 100
        : causal.activeEdges > 0
          ? 100
          : 70;

    const reasoningScore =
      reasoning.total === 0
        ? 100
        : Number(
            (
              reasoning.completed /
              reasoning.total *
              100
            ).toFixed(2)
          );

    const decisionGraphScore =
      decisions.nodes === 0
        ? 100
        : decisions.options > 0
          ? 100
          : 70;

    const planningScore =
      planning.total === 0
        ? 100
        : Number(
            (
              planning.completed /
              planning.total *
              100
            ).toFixed(2)
          );

    const recoveryScore =
      recovery.failed === 0
        ? 100
        : Math.max(
            0,
            100 - recovery.failed * 25
          );

    const score = Number(
      (
        ruleScore * 0.15 +
        constraintScore * 0.15 +
        causalScore * 0.1 +
        reasoningScore * 0.2 +
        decisionGraphScore * 0.1 +
        planningScore * 0.2 +
        recoveryScore * 0.1
      ).toFixed(2)
    );

    const reasons: string[] = [];

    if (ruleScore < 90) reasons.push("Brain rule coverage is incomplete.");
    if (constraintScore < 90) reasons.push("Brain constraint coverage is incomplete.");
    if (reasoningScore < 90) reasons.push("Brain reasoning success is below target.");
    if (planningScore < 90) reasons.push("Brain planning success is below target.");
    if (recoveryScore < 90) reasons.push("Brain recovery planning requires attention.");

    if (reasons.length === 0) {
      reasons.push("Enterprise Brain reasoning and planning are healthy.");
    }

    const index: BrainReasoningPlanningHealthIndex = {
      id: `brain-reasoning-planning-health:${Date.now()}:${this.indexes.size + 1}`,
      score,
      level: this.level(score),
      metrics: {
        ruleScore,
        constraintScore,
        causalScore,
        reasoningScore,
        decisionGraphScore,
        planningScore,
        recoveryScore
      },
      reasons,
      calculatedAt: new Date().toISOString()
    };

    this.indexes.set(index.id, index);

    this.audit.record({
      correlationId: input.correlationId,
      category: "health",
      action: "brain-reasoning-planning-health-calculated",
      subjectId: index.id,
      actorIdentityId: input.actorIdentityId,
      outcome:
        score >= 75
          ? "success"
          : score >= 50
            ? "warning"
            : "failure",
      metadata: {
        score,
        level: index.level
      }
    });

    return index;
  }

  summary() {
    const items = this.list();

    return {
      total: items.length,
      latestScore:
        items.length === 0
          ? 0
          : items[items.length - 1]?.score ?? 0,
      healthy:
        items.filter(
          (item) =>
            item.level === "healthy" ||
            item.level === "excellent"
        ).length
    };
  }

  private level(
    score: number
  ): BrainReasoningPlanningHealthIndex["level"] {
    if (score >= 90) return "excellent";
    if (score >= 75) return "healthy";
    if (score >= 60) return "stable";
    if (score >= 40) return "degraded";
    return "critical";
  }
}
