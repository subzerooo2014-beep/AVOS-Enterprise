import { Injectable } from "@nestjs/common";
import { KernelRecoveryReadinessAssessment } from "../enterprise-kernel-mega-pack-4.types";
import { KernelHealthRegistryService } from "../registry/kernel-health-registry.service";
import { KernelFailureClassifierService } from "../failures/kernel-failure-classifier.service";
import { KernelIsolationService } from "../isolation/kernel-isolation.service";
import { KernelRecoveryService } from "../recovery/kernel-recovery.service";
import { KernelOperationalModeService } from "../modes/kernel-operational-mode.service";
import { KernelResilienceAuditService } from "../observability/kernel-resilience-audit.service";

@Injectable()
export class KernelRecoveryReadinessService {
  private readonly assessments =
    new Map<string, KernelRecoveryReadinessAssessment>();

  constructor(
    private readonly health: KernelHealthRegistryService,
    private readonly failures: KernelFailureClassifierService,
    private readonly isolations: KernelIsolationService,
    private readonly recovery: KernelRecoveryService,
    private readonly modes: KernelOperationalModeService,
    private readonly audit: KernelResilienceAuditService
  ) {}

  list() {
    return Array.from(this.assessments.values());
  }

  assess(input: {
    actorIdentityId: string;
    correlationId: string;
  }) {
    const health = this.health.summary();
    const failures = this.failures.summary();
    const isolations = this.isolations.summary();
    const recovery = this.recovery.summary();
    const mode = this.modes.current().mode;

    const blockers: string[] = [];
    const warnings: string[] = [];

    if (health.critical > 0) {
      blockers.push("Critical kernel components are present.");
    }

    if (failures.fatal > 0) {
      blockers.push("Fatal kernel failures are present.");
    }

    if (recovery.failed > 0) {
      blockers.push("Kernel recovery plans have failed.");
    }

    if (isolations.active > 0) {
      warnings.push("Kernel components are isolated.");
    }

    if (mode === "safe" || mode === "degraded") {
      warnings.push(`Kernel operational mode is ${mode}.`);
    }

    if (mode === "emergency") {
      blockers.push("Kernel is in emergency mode.");
    }

    const componentScore =
      health.total === 0
        ? 0
        : Number(
            (
              health.healthy /
              health.total *
              100
            ).toFixed(2)
          );

    const failureScore = Math.max(
      0,
      100 -
        failures.critical * 25 -
        failures.fatal * 50
    );

    const recoveryScore =
      recovery.total === 0
        ? 100
        : Math.max(
            0,
            Number(
              (
                recovery.completed /
                recovery.total *
                100
              ).toFixed(2)
            )
          );

    const score = Number(
      (
        componentScore * 0.5 +
        failureScore * 0.25 +
        recoveryScore * 0.25
      ).toFixed(2)
    );

    const assessment: KernelRecoveryReadinessAssessment = {
      id: `kernel-recovery-readiness:${Date.now()}:${this.assessments.size + 1}`,
      ready: blockers.length === 0 && score >= 85,
      score,
      blockers,
      warnings,
      healthyComponents: health.healthy,
      totalComponents: health.total,
      activeFailures: failures.total,
      activeIsolations: isolations.active,
      failedRecoveries: recovery.failed,
      operationalMode: mode,
      assessedAt: new Date().toISOString()
    };

    this.assessments.set(assessment.id, assessment);

    this.audit.record({
      correlationId: input.correlationId,
      category: "readiness",
      action: "kernel-recovery-readiness-assessed",
      subjectId: assessment.id,
      actorIdentityId: input.actorIdentityId,
      outcome: assessment.ready ? "success" : "blocked",
      metadata: {
        score: assessment.score,
        blockers: assessment.blockers
      }
    });

    return assessment;
  }

  summary() {
    const items = this.list();

    return {
      total: items.length,
      ready: items.filter((x) => x.ready).length,
      latestScore:
        items.length === 0
          ? 0
          : items[items.length - 1]?.score ?? 0
    };
  }
}
