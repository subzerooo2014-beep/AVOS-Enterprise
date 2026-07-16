import { Injectable } from "@nestjs/common";
import {
  FoundationSdkHealthIndex
} from "../foundation-pack-17.types";
import { FoundationCapabilityRegistryService } from "../registry/foundation-capability-registry.service";
import { FoundationApiContractRegistryService } from "../contracts/foundation-api-contract-registry.service";
import { FoundationSdkDiagnosticsService } from "../diagnostics/foundation-sdk-diagnostics.service";
import { FoundationSdkAuditService } from "../observability/foundation-sdk-audit.service";

@Injectable()
export class FoundationSdkHealthService {
  private readonly indexes =
    new Map<string, FoundationSdkHealthIndex>();

  constructor(
    private readonly capabilities: FoundationCapabilityRegistryService,
    private readonly contracts: FoundationApiContractRegistryService,
    private readonly diagnostics: FoundationSdkDiagnosticsService,
    private readonly audit: FoundationSdkAuditService
  ) {}

  list() {
    return Array.from(this.indexes.values());
  }

  calculate(input: {
    actorIdentityId: string;
    correlationId: string;
  }) {
    const capabilities = this.capabilities.list();
    const contracts = this.contracts.list();
    const diagnostics = this.diagnostics.summary();

    const requiredDomains = [
      "identity",
      "memory",
      "knowledge",
      "metadata",
      "digital-dna",
      "digital-genome"
    ];

    const coveredDomains = new Set(
      capabilities
        .filter(
          (capability) => capability.status === "active"
        )
        .map((capability) => capability.domain)
    );

    const capabilityCoverageScore =
      this.clamp(
        (
          requiredDomains.filter((domain) =>
            coveredDomains.has(domain as never)
          ).length /
          requiredDomains.length
        ) *
          100
      );

    const contractCoverageScore =
      capabilities.length === 0
        ? 100
        : this.clamp(
            (
              capabilities.filter(
                (capability) =>
                  capability.contractId &&
                  contracts.some(
                    (contract) =>
                      contract.id === capability.contractId &&
                      contract.active
                  )
              ).length /
              capabilities.length
            ) *
              100
          );

    const dependencyIntegrityScore =
      capabilities.length === 0
        ? 100
        : this.clamp(
            (
              capabilities.filter((capability) =>
                capability.dependencies.every((dependencyId) =>
                  capabilities.some(
                    (candidate) =>
                      candidate.id === dependencyId &&
                      candidate.status === "active"
                  )
                )
              ).length /
              capabilities.length
            ) *
              100
          );

    const diagnosticsScore = this.clamp(
      100 -
        diagnostics.critical * 30 -
        diagnostics.errors * 15 -
        diagnostics.warnings * 5
    );

    const operationalReadinessScore =
      capabilities.length === 0
        ? 0
        : this.clamp(
            (
              capabilities.filter(
                (capability) =>
                  capability.status === "active" &&
                  Boolean(capability.endpoint)
              ).length /
              capabilities.length
            ) *
              100
          );

    const score = this.clamp(
      capabilityCoverageScore * 0.25 +
        contractCoverageScore * 0.2 +
        dependencyIntegrityScore * 0.2 +
        diagnosticsScore * 0.2 +
        operationalReadinessScore * 0.15
    );

    const reasons: string[] = [];

    if (capabilityCoverageScore < 100) {
      reasons.push(
        "Foundation SDK domain coverage is incomplete."
      );
    }

    if (contractCoverageScore < 80) {
      reasons.push(
        "Foundation API contract coverage requires improvement."
      );
    }

    if (dependencyIntegrityScore < 80) {
      reasons.push(
        "Foundation SDK dependency integrity requires improvement."
      );
    }

    if (diagnosticsScore < 80) {
      reasons.push(
        "Foundation SDK diagnostics contain unresolved findings."
      );
    }

    if (reasons.length === 0) {
      reasons.push(
        "Foundation SDK is healthy and ready."
      );
    }

    const index: FoundationSdkHealthIndex = {
      id: `foundation-sdk-health:${Date.now()}:${
        this.indexes.size + 1
      }`,
      score,
      level: this.level(score),
      metrics: {
        capabilityCoverageScore,
        contractCoverageScore,
        dependencyIntegrityScore,
        diagnosticsScore,
        operationalReadinessScore
      },
      reasons,
      calculatedAt: new Date().toISOString()
    };

    this.indexes.set(index.id, index);

    this.audit.record({
      correlationId: input.correlationId,
      category: "health",
      action: "foundation-sdk-health-calculated",
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
  ): FoundationSdkHealthIndex["level"] {
    if (score >= 90) return "excellent";
    if (score >= 75) return "healthy";
    if (score >= 60) return "stable";
    if (score >= 40) return "degraded";
    return "critical";
  }
}
