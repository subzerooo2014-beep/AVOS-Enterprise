import { Injectable } from "@nestjs/common";
import { KernelResilienceHealthIndex } from "../enterprise-kernel-mega-pack-4.types";
import { KernelHealthRegistryService } from "../registry/kernel-health-registry.service";
import { KernelDiagnosticsService } from "../diagnostics/kernel-diagnostics.service";
import { KernelRecoveryService } from "../recovery/kernel-recovery.service";
import { KernelIsolationService } from "../isolation/kernel-isolation.service";
import { KernelRestartPolicyService } from "../restart/kernel-restart-policy.service";
import { KernelOperationalModeService } from "../modes/kernel-operational-mode.service";
import { KernelResilienceAuditService } from "../observability/kernel-resilience-audit.service";

@Injectable()
export class KernelResilienceHealthService {
  private readonly indexes =
    new Map<string, KernelResilienceHealthIndex>();

  constructor(
    private readonly health: KernelHealthRegistryService,
    private readonly diagnostics: KernelDiagnosticsService,
    private readonly recovery: KernelRecoveryService,
    private readonly isolation: KernelIsolationService,
    private readonly restart: KernelRestartPolicyService,
    private readonly modes: KernelOperationalModeService,
    private readonly audit: KernelResilienceAuditService
  ) {}

  list() {
    return Array.from(this.indexes.values());
  }

  calculate(input: {
    actorIdentityId: string;
    correlationId: string;
  }) {
    const health = this.health.summary();
    const diagnostics = this.diagnostics.summary();
    const recovery = this.recovery.summary();
    const isolation = this.isolation.summary();
    const restart = this.restart.summary();
    const mode = this.modes.current().mode;

    const componentHealthScore =
      health.total === 0
        ? 0
        : Number(
            (
              (
                health.healthy +
                health.degraded * 0.6
              ) /
              health.total *
              100
            ).toFixed(2)
          );

    const diagnosticsScore = Math.max(
      0,
      100 -
        diagnostics.critical * 25 -
        diagnostics.fatal * 50 -
        diagnostics.warnings * 5
    );

    const recoveryScore =
      recovery.total === 0
        ? 100
        : Number(
            (
              recovery.completed /
              recovery.total *
              100
            ).toFixed(2)
          );

    const isolationScore = Math.max(
      0,
      100 - isolation.active * 20
    );

    const restartPolicyScore =
      restart.policies === 0
        ? 0
        : Number(
            (
              restart.enabledPolicies /
              restart.policies *
              100
            ).toFixed(2)
          );

    const modeSafetyScore =
      mode === "normal"
        ? 100
        : mode === "degraded"
          ? 70
          : mode === "safe"
            ? 60
            : mode === "maintenance"
              ? 80
              : 20;

    const score = Number(
      (
        componentHealthScore * 0.3 +
        diagnosticsScore * 0.2 +
        recoveryScore * 0.2 +
        isolationScore * 0.1 +
        restartPolicyScore * 0.1 +
        modeSafetyScore * 0.1
      ).toFixed(2)
    );

    const reasons: string[] = [];

    if (componentHealthScore < 80) reasons.push("Kernel component health requires attention.");
    if (diagnosticsScore < 80) reasons.push("Kernel diagnostic findings require resolution.");
    if (recoveryScore < 80) reasons.push("Kernel recovery effectiveness is below target.");
    if (isolationScore < 80) reasons.push("Kernel components remain isolated.");
    if (restartPolicyScore < 100) reasons.push("Kernel restart policy coverage is incomplete.");
    if (modeSafetyScore < 80) reasons.push(`Kernel is operating in ${mode} mode.`);

    if (reasons.length === 0) {
      reasons.push("Kernel health, diagnostics, and recovery are healthy.");
    }

    const index: KernelResilienceHealthIndex = {
      id: `kernel-resilience-health:${Date.now()}:${this.indexes.size + 1}`,
      score,
      level: this.level(score),
      metrics: {
        componentHealthScore,
        diagnosticsScore,
        recoveryScore,
        isolationScore,
        restartPolicyScore,
        modeSafetyScore
      },
      reasons,
      calculatedAt: new Date().toISOString()
    };

    this.indexes.set(index.id, index);

    this.audit.record({
      correlationId: input.correlationId,
      category: "health",
      action: "kernel-resilience-health-calculated",
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
      healthy: items.filter(
        (item) =>
          item.level === "healthy" ||
          item.level === "excellent"
      ).length
    };
  }

  private level(score: number): KernelResilienceHealthIndex["level"] {
    if (score >= 90) return "excellent";
    if (score >= 75) return "healthy";
    if (score >= 60) return "stable";
    if (score >= 40) return "degraded";
    return "critical";
  }
}
