import { Injectable } from "@nestjs/common";
import { KernelDependencyConfigurationHealth } from "../enterprise-kernel-mega-pack-2.types";
import { KernelDependencyGraphService } from "../dependencies/kernel-dependency-graph.service";
import { KernelDependencyResolverService } from "../dependencies/kernel-dependency-resolver.service";
import { KernelCompatibilityService } from "../compatibility/kernel-compatibility.service";
import { KernelConfigurationRegistryService } from "../configuration/kernel-configuration-registry.service";
import { KernelEnvironmentProfileService } from "../profiles/kernel-environment-profile.service";
import { KernelConfigurationValidationService } from "../validation/kernel-configuration-validation.service";
import { KernelConfigurationSnapshotService } from "../configuration/kernel-configuration-snapshot.service";
import { KernelDependencyConfigurationAuditService } from "../observability/kernel-dependency-configuration-audit.service";

@Injectable()
export class KernelDependencyConfigurationHealthService {
  private readonly indexes =
    new Map<
      string,
      KernelDependencyConfigurationHealth
    >();

  constructor(
    private readonly graph: KernelDependencyGraphService,
    private readonly resolver: KernelDependencyResolverService,
    private readonly compatibility: KernelCompatibilityService,
    private readonly configuration: KernelConfigurationRegistryService,
    private readonly profiles: KernelEnvironmentProfileService,
    private readonly validation: KernelConfigurationValidationService,
    private readonly snapshots: KernelConfigurationSnapshotService,
    private readonly audit: KernelDependencyConfigurationAuditService
  ) {}

  list() {
    return Array.from(this.indexes.values());
  }

  calculate(input: {
    actorIdentityId: string;
    correlationId: string;
    profileId?: string;
  }) {
    const resolution =
      this.resolver.resolve({
        actorIdentityId:
          input.actorIdentityId,
        correlationId:
          input.correlationId
      });

    const compatibility =
      this.compatibility.assessAll({
        actorIdentityId:
          input.actorIdentityId,
        correlationId:
          input.correlationId
      });

    const validation =
      this.validation.validate({
        profileId: input.profileId,
        actorIdentityId:
          input.actorIdentityId,
        correlationId:
          input.correlationId
      });

    const graphSummary =
      this.graph.summary();

    const configSummary =
      this.configuration.summary();

    const profileSummary =
      this.profiles.summary();

    const snapshotSummary =
      this.snapshots.summary();

    const dependencyIntegrityScore =
      resolution.resolvable
        ? graphSummary.activeNodes ===
          graphSummary.nodes
          ? 100
          : 80
        : 0;

    const compatibilityScore =
      compatibility.total === 0
        ? 100
        : Number(
            (
              (
                compatibility.compatible +
                compatibility.conditional *
                  0.7
              ) /
              compatibility.total *
              100
            ).toFixed(2)
          );

    const findings =
      this.validation.summary();

    const configurationValidityScore =
      validation.valid
        ? Math.max(
            0,
            100 -
              findings.warnings * 5
          )
        : Math.max(
            0,
            60 -
              findings.critical * 20 -
              findings.errors * 10
          );

    const profileCoverageScore =
      profileSummary.total === 0
        ? 0
        : Number(
            (
              profileSummary.active /
              profileSummary.total *
              100
            ).toFixed(2)
          );

    const rollbackReadinessScore =
      configSummary.mutableAtRuntime === 0
        ? 100
        : snapshotSummary.total > 0
          ? 100
          : 70;

    const score = Number(
      (
        dependencyIntegrityScore * 0.25 +
        compatibilityScore * 0.25 +
        configurationValidityScore * 0.25 +
        profileCoverageScore * 0.15 +
        rollbackReadinessScore * 0.1
      ).toFixed(2)
    );

    const reasons: string[] = [];

    if (
      dependencyIntegrityScore < 90
    ) {
      reasons.push(
        "Kernel dependency integrity requires attention."
      );
    }

    if (compatibilityScore < 90) {
      reasons.push(
        "Kernel compatibility coverage is below target."
      );
    }

    if (
      configurationValidityScore < 90
    ) {
      reasons.push(
        "Kernel configuration contains validation findings."
      );
    }

    if (profileCoverageScore < 100) {
      reasons.push(
        "Kernel environment profile coverage is incomplete."
      );
    }

    if (
      rollbackReadinessScore < 100
    ) {
      reasons.push(
        "Kernel configuration rollback readiness requires snapshots."
      );
    }

    if (reasons.length === 0) {
      reasons.push(
        "Kernel dependencies, compatibility, and configuration are healthy."
      );
    }

    const index: KernelDependencyConfigurationHealth = {
      id: `kernel-dependency-config-health:${Date.now()}:${
        this.indexes.size + 1
      }`,
      score,
      level: this.level(score),
      metrics: {
        dependencyIntegrityScore,
        compatibilityScore,
        configurationValidityScore,
        profileCoverageScore,
        rollbackReadinessScore
      },
      reasons,
      calculatedAt: new Date().toISOString()
    };

    this.indexes.set(index.id, index);

    this.audit.record({
      correlationId: input.correlationId,
      category: "health",
      action: "kernel-dependency-configuration-health-calculated",
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
      latestScore:
        this.latest()?.score ?? 0,
      healthy: items.filter(
        (item) =>
          item.level === "healthy" ||
          item.level === "excellent"
      ).length
    };
  }

  private level(
    score: number
  ): KernelDependencyConfigurationHealth["level"] {
    if (score >= 90) return "excellent";
    if (score >= 75) return "healthy";
    if (score >= 60) return "stable";
    if (score >= 40) return "degraded";
    return "critical";
  }
}
