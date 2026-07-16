import { Injectable } from "@nestjs/common";
import { KernelHealthIndex } from "../enterprise-kernel-mega-pack-1.types";
import { KernelStateService } from "../state/kernel-state.service";
import { KernelModuleRegistryService } from "../modules/kernel-module-registry.service";
import { KernelLifecycleService } from "../lifecycle/kernel-lifecycle.service";
import { KernelReadinessService } from "../readiness/kernel-readiness.service";
import { KernelAuditService } from "../observability/kernel-audit.service";

@Injectable()
export class KernelHealthService {
  private readonly indexes =
    new Map<string, KernelHealthIndex>();

  constructor(
    private readonly state: KernelStateService,
    private readonly modules: KernelModuleRegistryService,
    private readonly lifecycle: KernelLifecycleService,
    private readonly readiness: KernelReadinessService,
    private readonly audit: KernelAuditService
  ) {}

  list() {
    return Array.from(this.indexes.values());
  }

  calculate(input: {
    actorIdentityId: string;
    correlationId: string;
  }) {
    const runtime = this.state.get();
    const moduleSummary = this.modules.summary();
    const lifecycleSummary =
      this.lifecycle.summary();
    const readiness =
      this.readiness.latest() ??
      this.readiness.assess(input);

    const runtimeScore =
      runtime.status === "running"
        ? 100
        : runtime.status === "degraded"
          ? 60
          : runtime.status === "stopped"
            ? 40
            : runtime.status === "failed"
              ? 0
              : 30;

    const lifecycleScore =
      lifecycleSummary.totalTransitions === 0
        ? 70
        : Math.max(
            0,
            Math.min(
              100,
              Number(
                (
                  lifecycleSummary.successful /
                  lifecycleSummary.totalTransitions *
                  100
                ).toFixed(2)
              )
            )
          );

    const moduleCoverageScore =
      moduleSummary.total === 0
        ? 0
        : Number(
            (
              moduleSummary.active /
              moduleSummary.total *
              100
            ).toFixed(2)
          );

    const readinessScore =
      readiness.score;

    const failureScore = Math.max(
      0,
      100 -
        moduleSummary.failed * 25 -
        (runtime.lastFailure ? 20 : 0)
    );

    const score = Number(
      (
        runtimeScore * 0.25 +
        lifecycleScore * 0.2 +
        moduleCoverageScore * 0.2 +
        readinessScore * 0.25 +
        failureScore * 0.1
      ).toFixed(2)
    );

    const reasons: string[] = [];

    if (runtimeScore < 80) {
      reasons.push(
        "Kernel runtime is not fully operational."
      );
    }

    if (lifecycleScore < 80) {
      reasons.push(
        "Kernel lifecycle transition reliability requires improvement."
      );
    }

    if (moduleCoverageScore < 80) {
      reasons.push(
        "Kernel module activation coverage is incomplete."
      );
    }

    if (readinessScore < 90) {
      reasons.push(
        "Kernel readiness is below release threshold."
      );
    }

    if (failureScore < 80) {
      reasons.push(
        "Kernel failures require attention."
      );
    }

    if (reasons.length === 0) {
      reasons.push(
        "Enterprise Kernel runtime and lifecycle are healthy."
      );
    }

    const index: KernelHealthIndex = {
      id: `kernel-health:${Date.now()}:${
        this.indexes.size + 1
      }`,
      score,
      level: this.level(score),
      metrics: {
        runtimeScore,
        lifecycleScore,
        moduleCoverageScore,
        readinessScore,
        failureScore
      },
      reasons,
      calculatedAt: new Date().toISOString()
    };

    this.indexes.set(index.id, index);

    this.audit.record({
      correlationId: input.correlationId,
      category: "health",
      action: "kernel-health-calculated",
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

  latest() {
    const items = this.list();

    return items.length === 0
      ? undefined
      : items[items.length - 1];
  }

  summary() {
    const items = this.list();

    return {
      total: items.length,
      latestScore: this.latest()?.score ?? 0,
      healthy: items.filter(
        (index) =>
          index.level === "healthy" ||
          index.level === "excellent"
      ).length
    };
  }

  private level(
    score: number
  ): KernelHealthIndex["level"] {
    if (score >= 90) return "excellent";
    if (score >= 75) return "healthy";
    if (score >= 60) return "stable";
    if (score >= 40) return "degraded";
    return "critical";
  }
}
