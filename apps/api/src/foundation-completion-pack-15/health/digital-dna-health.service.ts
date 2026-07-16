import { Injectable } from "@nestjs/common";
import {
  DigitalDnaHealthIndex
} from "../foundation-pack-15.types";
import { DigitalDnaRegistryService } from "../dna/digital-dna-registry.service";
import { DigitalDnaValidatorService } from "../validation/digital-dna-validator.service";
import { DigitalDnaAuditService } from "../observability/digital-dna-audit.service";

@Injectable()
export class DigitalDnaHealthService {
  private readonly indexes =
    new Map<string, DigitalDnaHealthIndex>();

  constructor(
    private readonly registry: DigitalDnaRegistryService,
    private readonly validator: DigitalDnaValidatorService,
    private readonly audit: DigitalDnaAuditService
  ) {}

  list() {
    return Array.from(this.indexes.values());
  }

  calculate(input: {
    actorIdentityId: string;
    correlationId: string;
  }) {
    const records = this.registry.list();
    const findings = this.validator.summary();

    const identityScore =
      records.length === 0
        ? 100
        : this.clamp(
            (
              records.filter(
                (record) =>
                  record.identity.identityId.trim().length > 0 &&
                  record.identity.ownerIdentityId.trim().length > 0
              ).length /
              records.length
            ) *
              100
          );

    const purposeScore =
      records.length === 0
        ? 100
        : this.clamp(
            (
              records.filter(
                (record) =>
                  record.purpose.mission.trim().length > 0 &&
                  record.purpose.problemSolved.trim().length > 0 &&
                  record.purpose.valueCreated.length > 0
              ).length /
              records.length
            ) *
              100
          );

    const contractScore =
      records.length === 0
        ? 100
        : this.clamp(
            records.reduce(
              (sum, record) =>
                sum +
                (
                  record.contracts.length === 0
                    ? 70
                    : 100
                ),
              0
            ) / records.length
          );

    const dependencyScore =
      records.length === 0
        ? 100
        : this.clamp(
            records.reduce(
              (sum, record) =>
                sum +
                (
                  record.dependencies.every(
                    (dependency) =>
                      dependency.assetId.trim().length > 0
                  )
                    ? 100
                    : 50
                ),
              0
            ) / records.length
          );

    const governanceScore =
      records.length === 0
        ? 100
        : this.clamp(
            (
              records.filter(
                (record) =>
                  record.policies.length > 0 &&
                  record.permissions.length > 0
              ).length /
              records.length
            ) *
              100
          );

    const observabilityScore =
      records.length === 0
        ? 100
        : this.clamp(
            (
              records.filter(
                (record) =>
                  record.metrics.length > 0 ||
                  record.events.length > 0
              ).length /
              records.length
            ) *
              100
          );

    const score = this.clamp(
      identityScore * 0.2 +
        purposeScore * 0.2 +
        contractScore * 0.15 +
        dependencyScore * 0.15 +
        governanceScore * 0.15 +
        observabilityScore * 0.15 -
        findings.critical * 10 -
        findings.errors * 5
    );

    const reasons: string[] = [];

    if (identityScore < 80) {
      reasons.push(
        "Digital DNA identity completeness is insufficient."
      );
    }

    if (purposeScore < 80) {
      reasons.push(
        "Digital DNA purpose completeness is insufficient."
      );
    }

    if (governanceScore < 70) {
      reasons.push(
        "Digital DNA governance bindings require improvement."
      );
    }

    if (observabilityScore < 70) {
      reasons.push(
        "Digital DNA metrics and events coverage is incomplete."
      );
    }

    if (reasons.length === 0) {
      reasons.push(
        "Digital DNA framework is healthy."
      );
    }

    const index: DigitalDnaHealthIndex = {
      id: `digital-dna-health:${Date.now()}:${
        this.indexes.size + 1
      }`,
      score,
      level: this.level(score),
      metrics: {
        identityScore,
        purposeScore,
        contractScore,
        dependencyScore,
        governanceScore,
        observabilityScore
      },
      reasons,
      calculatedAt: new Date().toISOString()
    };

    this.indexes.set(index.id, index);

    this.audit.record({
      correlationId: input.correlationId,
      category: "health",
      action: "digital-dna-health-calculated",
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
  ): DigitalDnaHealthIndex["level"] {
    if (score >= 90) return "excellent";
    if (score >= 75) return "healthy";
    if (score >= 60) return "stable";
    if (score >= 40) return "degraded";
    return "critical";
  }
}
