import { Injectable } from "@nestjs/common";
import { BrainHealthIndex } from "../enterprise-brain-mega-pack-1.types";
import { BrainRuntimeService } from "../runtime/brain-runtime.service";
import { BrainSessionService } from "../sessions/brain-session.service";
import { BrainContextService } from "../context/brain-context.service";
import { BrainIntentService } from "../intent/brain-intent.service";
import { BrainGoalService } from "../goals/brain-goal.service";
import { BrainDecisionService } from "../decisions/brain-decision.service";
import { BrainRegistryService } from "../registry/brain-registry.service";
import { BrainAuditService } from "../observability/brain-audit.service";

@Injectable()
export class BrainHealthService {
  private readonly indexes =
    new Map<string, BrainHealthIndex>();

  constructor(
    private readonly runtime: BrainRuntimeService,
    private readonly sessions: BrainSessionService,
    private readonly context: BrainContextService,
    private readonly intents: BrainIntentService,
    private readonly goals: BrainGoalService,
    private readonly decisions: BrainDecisionService,
    private readonly registry: BrainRegistryService,
    private readonly audit: BrainAuditService
  ) {}

  list() {
    return Array.from(this.indexes.values());
  }

  calculate(input: {
    actorIdentityId: string;
    correlationId: string;
  }) {
    const runtime = this.runtime.summary();
    const sessions = this.sessions.summary();
    const context = this.context.summary();
    const intents = this.intents.summary();
    const goals = this.goals.summary();
    const decisions = this.decisions.summary();
    const registry = this.registry.summary();

    const runtimeScore =
      runtime.status === "ready"
        ? 100
        : runtime.status === "safe"
          ? 70
          : runtime.status === "degraded"
            ? 60
            : 20;

    const sessionScore =
      sessions.failed === 0
        ? 100
        : Math.max(
            0,
            100 - sessions.failed * 20
          );

    const contextScore =
      context.total >= 0 ? 100 : 0;

    const intentScore =
      intents.total === 0
        ? 100
        : Math.max(
            0,
            100 -
            intents.requiringClarification * 10
          );

    const goalScore =
      goals.blocked === 0
        ? 100
        : Math.max(
            0,
            100 - goals.blocked * 20
          );

    const decisionScore =
      decisions.rejected === 0
        ? 100
        : Math.max(
            0,
            100 - decisions.rejected * 10
          );

    const registryScore =
      registry.total >= 5 &&
      registry.active === registry.total
        ? 100
        : 70;

    const score = Number(
      (
        runtimeScore * 0.2 +
        sessionScore * 0.1 +
        contextScore * 0.15 +
        intentScore * 0.15 +
        goalScore * 0.15 +
        decisionScore * 0.15 +
        registryScore * 0.1
      ).toFixed(2)
    );

    const reasons: string[] = [];

    if (runtimeScore < 90) {
      reasons.push(
        "Enterprise Brain runtime is not fully ready."
      );
    }

    if (sessionScore < 90) {
      reasons.push(
        "Enterprise Brain sessions contain failures."
      );
    }

    if (intentScore < 90) {
      reasons.push(
        "Enterprise Brain intents require clarification."
      );
    }

    if (goalScore < 90) {
      reasons.push(
        "Enterprise Brain goals are blocked."
      );
    }

    if (decisionScore < 90) {
      reasons.push(
        "Enterprise Brain decisions contain rejections."
      );
    }

    if (registryScore < 90) {
      reasons.push(
        "Enterprise Brain registry coverage is incomplete."
      );
    }

    if (reasons.length === 0) {
      reasons.push(
        "Enterprise Brain foundation is healthy."
      );
    }

    const index: BrainHealthIndex = {
      id: `brain-health:${Date.now()}:${this.indexes.size + 1}`,
      score,
      level: this.level(score),
      metrics: {
        runtimeScore,
        sessionScore,
        contextScore,
        intentScore,
        goalScore,
        decisionScore,
        registryScore
      },
      reasons,
      calculatedAt: new Date().toISOString()
    };

    this.indexes.set(index.id, index);

    this.audit.record({
      correlationId: input.correlationId,
      category: "health",
      action: "enterprise-brain-health-calculated",
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
  ): BrainHealthIndex["level"] {
    if (score >= 90) return "excellent";
    if (score >= 75) return "healthy";
    if (score >= 60) return "stable";
    if (score >= 40) return "degraded";
    return "critical";
  }
}
