import { Injectable } from "@nestjs/common";
import {
  FoundationFinalHealthIndex
} from "../foundation-pack-20.types";
import { FoundationPackRegistryService } from "../registry/foundation-pack-registry.service";
import { CrossFoundationValidationService } from "../validation/cross-foundation-validation.service";
import { FoundationCertificationService } from "../certification/foundation-certification.service";
import { FoundationEvidenceVaultService } from "../evidence/foundation-evidence-vault.service";
import { FoundationFinalSmokeTestService } from "../smoke/foundation-final-smoke-test.service";
import { FoundationFinalAuditService } from "../observability/foundation-final-audit.service";

@Injectable()
export class FoundationFinalHealthService {
  private readonly indexes =
    new Map<string, FoundationFinalHealthIndex>();

  constructor(
    private readonly registry: FoundationPackRegistryService,
    private readonly validation: CrossFoundationValidationService,
    private readonly certifications: FoundationCertificationService,
    private readonly evidence: FoundationEvidenceVaultService,
    private readonly smoke: FoundationFinalSmokeTestService,
    private readonly audit: FoundationFinalAuditService
  ) {}

  list() {
    return Array.from(this.indexes.values());
  }

  calculate(input: {
    actorIdentityId: string;
    correlationId: string;
  }) {
    const registry = this.registry.summary();
    const validation = this.validation.summary();
    const certificationItems = this.certifications.list();
    const certification =
      certificationItems.length === 0
        ? undefined
        : certificationItems[certificationItems.length - 1];
    const evidence = this.evidence.summary();
    const smoke = this.smoke.summary();

    const packCoverageScore =
      registry.required === 0
        ? 100
        : Number(
            (
              registry.verified /
              registry.required *
              100
            ).toFixed(2)
          );

    const verificationScore =
      registry.total === 0
        ? 0
        : Number(
            (
              registry.buildPassed /
              registry.total *
              100
            ).toFixed(2)
          );

    const dependencyScore =
      validation.latestScore;

    const certificationScore =
      certification
        ? certification.score
        : 0;

    const evidenceScore =
      evidence.categories >= 5 &&
      evidence.failed === 0
        ? 100
        : Math.max(
            0,
            70 -
              evidence.failed * 20
          );

    const smokeTestScore =
      smoke.latestScore;

    const score = Number(
      (
        packCoverageScore * 0.2 +
        verificationScore * 0.2 +
        dependencyScore * 0.2 +
        certificationScore * 0.15 +
        evidenceScore * 0.1 +
        smokeTestScore * 0.15
      ).toFixed(2)
    );

    const reasons: string[] = [];

    if (packCoverageScore < 100) {
      reasons.push(
        "Foundation pack coverage is incomplete."
      );
    }

    if (verificationScore < 100) {
      reasons.push(
        "Foundation build verification is incomplete."
      );
    }

    if (dependencyScore < 90) {
      reasons.push(
        "Cross-foundation validation score is below certification threshold."
      );
    }

    if (certificationScore < 90) {
      reasons.push(
        "Foundation certification score is insufficient."
      );
    }

    if (evidenceScore < 80) {
      reasons.push(
        "Foundation evidence coverage is insufficient."
      );
    }

    if (smokeTestScore < 100) {
      reasons.push(
        "Final foundation smoke test is incomplete."
      );
    }

    if (reasons.length === 0) {
      reasons.push(
        "AVOS Foundation is fully healthy and certified."
      );
    }

    const index: FoundationFinalHealthIndex = {
      id: `foundation-final-health:${Date.now()}:${
        this.indexes.size + 1
      }`,
      score,
      level: this.level(score),
      metrics: {
        packCoverageScore,
        verificationScore,
        dependencyScore,
        certificationScore,
        evidenceScore,
        smokeTestScore
      },
      reasons,
      calculatedAt: new Date().toISOString()
    };

    this.indexes.set(index.id, index);

    this.audit.record({
      correlationId: input.correlationId,
      category: "health",
      action: "foundation-final-health-calculated",
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

  summary() {
    const indexes = this.list();

    return {
      total: indexes.length,
      latestScore:
        indexes.length === 0
          ? 0
          : indexes[indexes.length - 1]?.score ?? 0,
      certifiedHealthy: indexes.filter(
        (index) =>
          index.level === "excellent" ||
          index.level === "healthy"
      ).length
    };
  }

  private level(
    score: number
  ): FoundationFinalHealthIndex["level"] {
    if (score >= 95) return "excellent";
    if (score >= 85) return "healthy";
    if (score >= 70) return "stable";
    if (score >= 50) return "degraded";
    return "critical";
  }
}
