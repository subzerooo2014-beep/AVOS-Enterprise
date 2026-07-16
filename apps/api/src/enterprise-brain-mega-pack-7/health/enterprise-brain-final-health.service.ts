import { Injectable } from "@nestjs/common";
import { EnterpriseBrainFinalHealthIndex } from "../enterprise-brain-mega-pack-7.types";
import { EnterpriseBrainPackRegistryService } from "../registry/enterprise-brain-pack-registry.service";
import { EnterpriseBrainCrossValidationService } from "../validation/enterprise-brain-cross-validation.service";
import { EnterpriseBrainManifestService } from "../manifest/enterprise-brain-manifest.service";
import { EnterpriseBrainEvidenceVaultService } from "../evidence/enterprise-brain-evidence-vault.service";
import { EnterpriseBrainCertificationService } from "../certification/enterprise-brain-certification.service";
import { EnterpriseBrainFinalSmokeTestService } from "../smoke/enterprise-brain-final-smoke-test.service";
import { EnterpriseBrainReleaseDecisionService } from "../release/enterprise-brain-release-decision.service";
import { EnterpriseBrainFinalAuditService } from "../observability/enterprise-brain-final-audit.service";

@Injectable()
export class EnterpriseBrainFinalHealthService {
  private readonly indexes =
    new Map<string, EnterpriseBrainFinalHealthIndex>();

  constructor(
    private readonly packs: EnterpriseBrainPackRegistryService,
    private readonly validation: EnterpriseBrainCrossValidationService,
    private readonly manifests: EnterpriseBrainManifestService,
    private readonly evidence: EnterpriseBrainEvidenceVaultService,
    private readonly certifications: EnterpriseBrainCertificationService,
    private readonly smoke: EnterpriseBrainFinalSmokeTestService,
    private readonly release: EnterpriseBrainReleaseDecisionService,
    private readonly audit: EnterpriseBrainFinalAuditService
  ) {}

  list() {
    return Array.from(this.indexes.values());
  }

  latest() {
    const items = this.list();

    return items.length === 0
      ? undefined
      : items[items.length - 1];
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
      release?.decision === "release-enterprise-brain"
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
      reasons.push("Enterprise Brain pack registry is incomplete.");
    }

    if (validationScore < 100) {
      reasons.push("Enterprise Brain cross-validation is below 100.");
    }

    if (manifestScore < 100) {
      reasons.push("Enterprise Brain manifest is not certified.");
    }

    if (evidenceScore < 100) {
      reasons.push("Enterprise Brain evidence contains failures.");
    }

    if (certificationScore < 100) {
      reasons.push("Enterprise Brain certification is incomplete.");
    }

    if (smokeScore < 100) {
      reasons.push("Enterprise Brain smoke test is below 100.");
    }

    if (releaseScore < 100) {
      reasons.push("Enterprise Brain release is not fully approved.");
    }

    if (reasons.length === 0) {
      reasons.push(
        "Enterprise Brain is fully healthy, certified, and released."
      );
    }

    const index: EnterpriseBrainFinalHealthIndex = {
      id: `enterprise-brain-final-health:${Date.now()}:${
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
      action: "enterprise-brain-final-health-calculated",
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
  ): EnterpriseBrainFinalHealthIndex["level"] {
    if (score >= 90) return "excellent";
    if (score >= 75) return "healthy";
    if (score >= 60) return "stable";
    if (score >= 40) return "degraded";
    return "critical";
  }
}
