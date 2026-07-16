import { Injectable } from "@nestjs/common";
import { LiveCoordinationHealthIndex } from "../enterprise-nervous-system-mega-pack-6.types";
import { LiveStateRegistryService } from "../state/live-state-registry.service";
import { StateSynchronizationService } from "../sync/state-synchronization.service";
import { StateChangeFeedService } from "../changes/state-change-feed.service";
import { PresenceService } from "../presence/presence.service";
import { LiveTelemetryService } from "../telemetry/live-telemetry.service";
import { StateConflictService } from "../conflicts/state-conflict.service";
import { StateReconciliationService } from "../reconciliation/state-reconciliation.service";
import { LiveCoordinationAuditService } from "../observability/live-coordination-audit.service";

@Injectable()
export class LiveCoordinationHealthService {
  private readonly indexes =
    new Map<string, LiveCoordinationHealthIndex>();

  constructor(
    private readonly states: LiveStateRegistryService,
    private readonly sync: StateSynchronizationService,
    private readonly changes: StateChangeFeedService,
    private readonly presence: PresenceService,
    private readonly telemetry: LiveTelemetryService,
    private readonly conflicts: StateConflictService,
    private readonly reconciliation: StateReconciliationService,
    private readonly audit: LiveCoordinationAuditService
  ) {}

  list() {
    return Array.from(this.indexes.values());
  }

  calculate(input: {
    actorIdentityId: string;
    correlationId: string;
  }) {
    const states = this.states.summary();
    const sync = this.sync.summary();
    const changes = this.changes.summary();
    const presence = this.presence.summary();
    const telemetry = this.telemetry.summary();
    const conflicts = this.conflicts.summary();
    const reconciliation = this.reconciliation.summary();

    const stateScore =
      states.conflicted === 0 &&
      states.offline === 0
        ? 100
        : Math.max(
            0,
            100 -
            states.conflicted * 15 -
            states.offline * 20
          );

    const syncScore =
      sync.total === 0
        ? 100
        : Number(
            (
              sync.applied /
              sync.total *
              100
            ).toFixed(2)
          );

    const changeFeedScore = 100;

    const presenceScore =
      presence.total === 0
        ? 100
        : Number(
            (
              (
                presence.online +
                presence.away +
                presence.busy
              ) /
              presence.total *
              100
            ).toFixed(2)
          );

    const telemetryScore =
      telemetry.total === 0 ? 100 : 100;

    const conflictScore =
      conflicts.open === 0
        ? 100
        : Math.max(
            0,
            100 - conflicts.open * 20
          );

    const reconciliationScore =
      conflicts.total === 0
        ? 100
        : Number(
            (
              conflicts.resolved /
              conflicts.total *
              100
            ).toFixed(2)
          );

    const score = Number(
      (
        stateScore * 0.2 +
        syncScore * 0.2 +
        changeFeedScore * 0.1 +
        presenceScore * 0.1 +
        telemetryScore * 0.1 +
        conflictScore * 0.15 +
        reconciliationScore * 0.15
      ).toFixed(2)
    );

    const reasons: string[] = [];

    if (stateScore < 90) {
      reasons.push("Live state registry contains conflicts or offline state.");
    }

    if (syncScore < 90) {
      reasons.push("State synchronization success is below target.");
    }

    if (presenceScore < 90) {
      reasons.push("Presence availability is below target.");
    }

    if (conflictScore < 90) {
      reasons.push("Open state conflicts require resolution.");
    }

    if (reconciliationScore < 90) {
      reasons.push("State reconciliation coverage is incomplete.");
    }

    if (reasons.length === 0) {
      reasons.push(
        "Enterprise Nervous System live coordination core is healthy."
      );
    }

    const index: LiveCoordinationHealthIndex = {
      id: `live-coordination-health:${Date.now()}:${this.indexes.size + 1}`,
      score,
      level: this.level(score),
      metrics: {
        stateScore,
        syncScore,
        changeFeedScore,
        presenceScore,
        telemetryScore,
        conflictScore,
        reconciliationScore
      },
      reasons,
      calculatedAt: new Date().toISOString()
    };

    this.indexes.set(index.id, index);

    this.audit.record({
      correlationId: input.correlationId,
      category: "health",
      action: "live-coordination-health-calculated",
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
          (x) =>
            x.level === "healthy" ||
            x.level === "excellent"
        ).length
    };
  }

  private level(
    score: number
  ): LiveCoordinationHealthIndex["level"] {
    if (score >= 90) return "excellent";
    if (score >= 75) return "healthy";
    if (score >= 60) return "stable";
    if (score >= 40) return "degraded";
    return "critical";
  }
}
