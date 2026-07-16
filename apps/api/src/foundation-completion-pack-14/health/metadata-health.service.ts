import { Injectable } from "@nestjs/common";
import {
  MetadataHealthIndex
} from "../foundation-pack-14.types";
import { UnifiedMetadataCatalogService } from "../catalog/unified-metadata-catalog.service";
import { MetadataLineageService } from "../lineage/metadata-lineage.service";
import { MetadataQualityEngineService } from "../quality/metadata-quality-engine.service";
import { MetadataPolicyEngineService } from "../policies/metadata-policy-engine.service";
import { MetadataAuditService } from "../observability/metadata-audit.service";

@Injectable()
export class MetadataHealthService {
  private readonly indexes =
    new Map<string, MetadataHealthIndex>();

  constructor(
    private readonly catalog: UnifiedMetadataCatalogService,
    private readonly lineage: MetadataLineageService,
    private readonly quality: MetadataQualityEngineService,
    private readonly policies: MetadataPolicyEngineService,
    private readonly audit: MetadataAuditService
  ) {}

  list() {
    return Array.from(this.indexes.values());
  }

  calculate(input: {
    actorIdentityId: string;
    correlationId: string;
  }) {
    const records = this.catalog.list();
    const quality = this.quality.summary();
    const policies = this.policies.summary();

    const complete = records.filter(
      (record) =>
        record.description.trim().length > 0 &&
        record.domain.trim().length > 0 &&
        record.ownerIdentityId.trim().length > 0 &&
        record.version.trim().length > 0
    ).length;

    const completenessScore =
      records.length === 0
        ? 100
        : this.clamp(
            (complete / records.length) * 100
          );

    const qualityScore =
      records.length === 0
        ? 100
        : this.clamp(
            records.reduce(
              (sum, record) =>
                sum + record.qualityScore,
              0
            ) / records.length
          );

    const classificationCoverageScore =
      records.length === 0
        ? 100
        : this.clamp(
            (
              records.filter(
                (record) =>
                  record.classifications.length > 0
              ).length /
              records.length
            ) *
              100
          );

    const lineageCoverageScore =
      records.length === 0
        ? 100
        : this.clamp(
            (
              records.filter((record) =>
                this.lineage.hasLineage(record.id)
              ).length /
              records.length
            ) *
              100
          );

    const policyComplianceScore =
      policies.active > 0 ? 100 : 0;

    const score = this.clamp(
      completenessScore * 0.25 +
        qualityScore * 0.25 +
        classificationCoverageScore * 0.2 +
        lineageCoverageScore * 0.2 +
        policyComplianceScore * 0.1
    );

    const reasons: string[] = [];

    if (completenessScore < 80) {
      reasons.push(
        "Metadata completeness requires improvement."
      );
    }

    if (qualityScore < 80) {
      reasons.push(
        "Metadata quality requires improvement."
      );
    }

    if (classificationCoverageScore < 70) {
      reasons.push(
        "Metadata classification coverage is incomplete."
      );
    }

    if (lineageCoverageScore < 70) {
      reasons.push(
        "Metadata lineage coverage is incomplete."
      );
    }

    if (quality.critical > 0 || quality.errors > 0) {
      reasons.push(
        "Critical metadata quality findings remain."
      );
    }

    if (reasons.length === 0) {
      reasons.push(
        "Enterprise metadata is healthy and governed."
      );
    }

    const index: MetadataHealthIndex = {
      id: `metadata-health:${Date.now()}:${
        this.indexes.size + 1
      }`,
      score,
      level: this.level(score),
      metrics: {
        completenessScore,
        qualityScore,
        classificationCoverageScore,
        lineageCoverageScore,
        policyComplianceScore
      },
      reasons,
      calculatedAt: new Date().toISOString()
    };

    this.indexes.set(index.id, index);

    this.audit.record({
      correlationId: input.correlationId,
      category: "health",
      action: "metadata-health-calculated",
      subjectId: index.id,
      actorIdentityId: input.actorIdentityId,
      outcome:
        score < 60 ? "warning" : "success",
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
      healthy: indexes.filter(
        (index) =>
          index.level === "healthy" ||
          index.level === "excellent"
      ).length
    };
  }

  private clamp(value: number) {
    return Math.max(
      0,
      Math.min(100, Number(value.toFixed(2)))
    );
  }

  private level(
    score: number
  ): MetadataHealthIndex["level"] {
    if (score >= 90) return "excellent";
    if (score >= 75) return "healthy";
    if (score >= 60) return "stable";
    if (score >= 40) return "degraded";
    return "critical";
  }
}
