import { Injectable } from "@nestjs/common";
import { NervousSystemFinalHealthIndex } from "../enterprise-nervous-system-mega-pack-7.types";
import { NervousSystemPackRegistryService } from "../registry/nervous-system-pack-registry.service";
import { NervousSystemCrossValidationService } from "../validation/nervous-system-cross-validation.service";
import { NervousSystemManifestService } from "../manifest/nervous-system-manifest.service";
import { NervousSystemEvidenceVaultService } from "../evidence/nervous-system-evidence-vault.service";
import { NervousSystemCertificationService } from "../certification/nervous-system-certification.service";
import { NervousSystemFinalSmokeTestService } from "../smoke/nervous-system-final-smoke-test.service";
import { NervousSystemReleaseDecisionService } from "../release/nervous-system-release-decision.service";
import { NervousSystemFinalAuditService } from "../observability/nervous-system-final-audit.service";

@Injectable()
export class NervousSystemFinalHealthService {
  private readonly indexes =
    new Map<string, NervousSystemFinalHealthIndex>();

  constructor(
    private readonly packs: NervousSystemPackRegistryService,
    private readonly validation: NervousSystemCrossValidationService,
    private readonly manifests: NervousSystemManifestService,
    private readonly evidence: NervousSystemEvidenceVaultService,
    private readonly certifications: NervousSystemCertificationService,
    private readonly smoke: NervousSystemFinalSmokeTestService,
    private readonly release: NervousSystemReleaseDecisionService,
    private readonly audit: NervousSystemFinalAuditService
  ) {}

  list() {
    return Array.from(this.indexes.values());
  }

  latest() {
    const items = this.list();
    return items.length === 0 ? undefined : items[items.length - 1];
  }

  calculate(input: {
    actorIdentityId: string;
    correlationId: string;
  }) {
    const packs = this.packs.summary();
    const validation = this.validation.latest();
    const manifest = this.manifests.latest();
    const evidence = this.evidence.summary();
    const certification = this.certifications.latest();
    const smoke = this.smoke.latest();
    const release = this.release.latest();

    const registryScore =
      packs.total === 7 &&
      packs.verified === 7 &&
      packs.buildPassed === 7 &&
      packs.healthy === 7
        ? 100
        : 70;

    const validationScore = validation?.score ?? 0;

    const manifestScore =
      manifest?.status === "certified"
        ? 100
        : manifest?.status === "ready"
          ? 80
          : 0;

    const evidenceScore =
      evidence.failed === 0
        ? 100
        : Math.max(0, 100 - evidence.failed * 20);

    const certificationScore =
      certification?.status === "certified"
        ? certification.score
        : certification?.status === "conditional"
          ? certification.score * 0.8
          : 0;

    const smokeScore = smoke?.score ?? 0;

    const releaseScore =
      release?.decision === "release-enterprise-nervous-system"
        ? release.score
        : release?.decision === "conditional-release"
          ? release.score * 0.8
          : 0;

    const score = Number(
      (
        registryScore * 0.15 +
        validationScore * 0.2 +
        manifestScore * 0.15 +
        evidenceScore * 0.1 +
        certificationScore * 0.15 +
        smokeScore * 0.15 +
        releaseScore * 0.1
      ).toFixed(2)
    );

    const reasons: string[] = [];

    if (registryScore < 100) {
      reasons.push(
        "Enterprise Nervous System pack registry is incomplete."
      );
    }

    if (validationScore < 100) {
      reasons.push(
        "Enterprise Nervous System cross-validation is below 100."
      );
    }

    if (manifestScore < 100) {
      reasons.push(
        "Enterprise Nervous System manifest is not certified."
      );
    }

    if (evidenceScore < 100) {
      reasons.push(
        "Enterprise Nervous System evidence contains failures."
      );
    }

    if (certificationScore < 100) {
      reasons.push(
        "Enterprise Nervous System certification is incomplete."
      );
    }

    if (smokeScore < 100) {
      reasons.push(
        "Enterprise Nervous System smoke test is below 100."
      );
    }

    if (releaseScore < 100) {
      reasons.push(
        "Enterprise Nervous System release is not fully approved."
      );
    }

    if (reasons.length === 0) {
      reasons.push(
        "Enterprise Nervous System is fully healthy, certified, and released."
      );
    }

    const index: NervousSystemFinalHealthIndex = {
      id: `nervous-system-final-health:${Date.now()}:${
        this.indexes.size + 1
      }`,
      score,
      level: this.level(score),
      metrics: {
        registryScore,
        validationScore,
        manifestScore,
        evidenceScore,
        certificationScore,
        smokeScore,
        releaseScore
      },
      reasons,
      calculatedAt: new Date().toISOString()
    };

    this.indexes.set(index.id, index);

    this.audit.record({
      correlationId: input.correlationId,
      category: "health",
      action: "nervous-system-final-health-calculated",
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
    const items = this.list();

    return {
      total: items.length,
      latestScore: this.latest()?.score ?? 0,
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
  ): NervousSystemFinalHealthIndex["level"] {
    if (score >= 90) return "excellent";
    if (score >= 75) return "healthy";
    if (score >= 60) return "stable";
    if (score >= 40) return "degraded";
    return "critical";
  }
}
