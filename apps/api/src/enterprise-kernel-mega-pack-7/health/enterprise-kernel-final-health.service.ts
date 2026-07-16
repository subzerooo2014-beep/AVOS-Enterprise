import { Injectable } from "@nestjs/common";
import { EnterpriseKernelFinalHealthIndex } from "../enterprise-kernel-mega-pack-7.types";
import { KernelObservabilityService } from "../observability/kernel-observability.service";
import { LivingKernelIntelligenceService } from "../living-kernel/living-kernel-intelligence.service";
import { MetaKernelGovernanceService } from "../meta-kernel/meta-kernel-governance.service";
import { EnterpriseKernelCrossValidationService } from "../validation/enterprise-kernel-cross-validation.service";
import { EnterpriseKernelCertificationService } from "../certification/enterprise-kernel-certification.service";
import { EnterpriseKernelFinalSmokeTestService } from "../smoke/enterprise-kernel-final-smoke-test.service";
import { EnterpriseKernelFinalAuditService } from "../observability/enterprise-kernel-final-audit.service";

@Injectable()
export class EnterpriseKernelFinalHealthService {
  private readonly indexes =
    new Map<string, EnterpriseKernelFinalHealthIndex>();

  constructor(
    private readonly observability: KernelObservabilityService,
    private readonly livingKernel: LivingKernelIntelligenceService,
    private readonly metaKernel: MetaKernelGovernanceService,
    private readonly validation: EnterpriseKernelCrossValidationService,
    private readonly certification: EnterpriseKernelCertificationService,
    private readonly smoke: EnterpriseKernelFinalSmokeTestService,
    private readonly audit: EnterpriseKernelFinalAuditService
  ) {}

  list() {
    return Array.from(this.indexes.values());
  }

  calculate(input: {
    actorIdentityId: string;
    correlationId: string;
  }) {
    const observabilitySummary =
      this.observability.summary();

    const livingSummary =
      this.livingKernel.summary();

    const metaSummary =
      this.metaKernel.summary();

    const validation =
      this.validation.latest();

    const certification =
      this.certification.latest();

    const smoke =
      this.smoke.latest();

    const observabilityScore =
      observabilitySummary.failedTraces === 0
        ? 100
        : Math.max(
            0,
            100 -
              observabilitySummary.failedTraces * 20
          );

    const livingKernelScore =
      livingSummary.recommendations === 0
        ? 100
        : Number(
            (
              (
                livingSummary.approvedRecommendations +
                livingSummary.implementedRecommendations
              ) /
              livingSummary.recommendations *
              100
            ).toFixed(2)
          );

    const metaKernelScore =
      metaSummary.held === 0
        ? 100
        : Math.max(
            0,
            100 - metaSummary.held * 25
          );

    const validationScore =
      validation?.score ?? 0;

    const certificationScore =
      certification?.status === "certified"
        ? certification.score
        : certification?.status === "conditional"
          ? certification.score * 0.8
          : 0;

    const smokeScore =
      smoke?.score ?? 0;

    const score = Number(
      (
        observabilityScore * 0.15 +
        livingKernelScore * 0.15 +
        metaKernelScore * 0.2 +
        validationScore * 0.2 +
        certificationScore * 0.15 +
        smokeScore * 0.15
      ).toFixed(2)
    );

    const reasons: string[] = [];

    if (observabilityScore < 90) {
      reasons.push(
        "Kernel observability contains failed traces."
      );
    }

    if (livingKernelScore < 90) {
      reasons.push(
        "Living Kernel recommendations require governance decisions."
      );
    }

    if (metaKernelScore < 90) {
      reasons.push(
        "Meta Kernel assessments contain held decisions."
      );
    }

    if (validationScore < 100) {
      reasons.push(
        "Enterprise Kernel cross-validation is below 100."
      );
    }

    if (certificationScore < 100) {
      reasons.push(
        "Enterprise Kernel certification is not fully certified."
      );
    }

    if (smokeScore < 100) {
      reasons.push(
        "Enterprise Kernel final smoke test is below 100."
      );
    }

    if (reasons.length === 0) {
      reasons.push(
        "Enterprise Kernel is fully healthy and certified."
      );
    }

    const index: EnterpriseKernelFinalHealthIndex = {
      id: `enterprise-kernel-final-health:${Date.now()}:${
        this.indexes.size + 1
      }`,
      score,
      level: this.level(score),
      metrics: {
        observabilityScore,
        livingKernelScore,
        metaKernelScore,
        validationScore,
        certificationScore,
        smokeScore
      },
      reasons,
      calculatedAt: new Date().toISOString()
    };

    this.indexes.set(index.id, index);

    this.audit.record({
      correlationId: input.correlationId,
      category: "health",
      action: "enterprise-kernel-final-health-calculated",
      subjectId: index.id,
      actorIdentityId: input.actorIdentityId,
      outcome:
        score >= 90
          ? "success"
          : score >= 70
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
      latestScore:
        this.latest()?.score ?? 0,
      certifiedHealthy:
        items.filter(
          (x) =>
            x.level === "excellent" &&
            x.score === 100
        ).length
    };
  }

  private level(
    score: number
  ): EnterpriseKernelFinalHealthIndex["level"] {
    if (score >= 90) return "excellent";
    if (score >= 75) return "healthy";
    if (score >= 60) return "stable";
    if (score >= 40) return "degraded";
    return "critical";
  }
}
