import { Injectable } from "@nestjs/common";
import { KernelDependencyConfigurationReadiness } from "../enterprise-kernel-mega-pack-2.types";
import { KernelDependencyResolverService } from "../dependencies/kernel-dependency-resolver.service";
import { KernelCompatibilityService } from "../compatibility/kernel-compatibility.service";
import { KernelConfigurationValidationService } from "../validation/kernel-configuration-validation.service";
import { KernelDependencyConfigurationAuditService } from "../observability/kernel-dependency-configuration-audit.service";

@Injectable()
export class KernelDependencyConfigurationReadinessService {
  private readonly assessments =
    new Map<
      string,
      KernelDependencyConfigurationReadiness
    >();

  constructor(
    private readonly resolver: KernelDependencyResolverService,
    private readonly compatibility: KernelCompatibilityService,
    private readonly validation: KernelConfigurationValidationService,
    private readonly audit: KernelDependencyConfigurationAuditService
  ) {}

  list() {
    return Array.from(
      this.assessments.values()
    );
  }

  assess(input: {
    profileId?: string;
    actorIdentityId: string;
    correlationId: string;
  }) {
    const dependency =
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

    const configuration =
      this.validation.validate({
        profileId: input.profileId,
        actorIdentityId:
          input.actorIdentityId,
        correlationId:
          input.correlationId
      });

    const blockers: string[] = [];
    const warnings: string[] = [];

    if (!dependency.resolvable) {
      blockers.push(
        "Kernel dependency graph is not resolvable."
      );

      blockers.push(
        ...dependency.unresolvedDependencies.map(
          (item) =>
            `Unresolved dependency: ${item}.`
        )
      );

      blockers.push(
        ...dependency.cycles.map(
          (cycle) =>
            `Dependency cycle: ${cycle.join(" -> ")}.`
        )
      );
    }

    if (
      compatibility.incompatible > 0
    ) {
      blockers.push(
        "Kernel compatibility assessment contains incompatible components."
      );
    }

    if (
      compatibility.conditional > 0
    ) {
      warnings.push(
        "Kernel compatibility contains conditional requirements."
      );
    }

    if (!configuration.valid) {
      blockers.push(
        "Kernel configuration validation failed."
      );
    }

    const dependencyScore =
      dependency.resolvable ? 100 : 0;

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

    const configurationScore =
      Math.max(
        0,
        100 -
          findings.critical * 30 -
          findings.errors * 15 -
          findings.warnings * 5
      );

    const score = Number(
      (
        dependencyScore * 0.4 +
        compatibilityScore * 0.3 +
        configurationScore * 0.3
      ).toFixed(2)
    );

    const assessment: KernelDependencyConfigurationReadiness = {
      id: `kernel-dependency-config-readiness:${Date.now()}:${
        this.assessments.size + 1
      }`,
      ready:
        blockers.length === 0 &&
        score >= 90,
      score,
      blockers,
      warnings,
      dependencyScore,
      compatibilityScore,
      configurationScore,
      assessedAt: new Date().toISOString()
    };

    this.assessments.set(
      assessment.id,
      assessment
    );

    this.audit.record({
      correlationId: input.correlationId,
      category: "readiness",
      action: "kernel-dependency-configuration-readiness-assessed",
      subjectId: assessment.id,
      actorIdentityId: input.actorIdentityId,
      outcome: assessment.ready
        ? "success"
        : "blocked",
      metadata: {
        score: assessment.score,
        blockers: assessment.blockers
      }
    });

    return assessment;
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
      ready: items.filter(
        (item) => item.ready
      ).length,
      latestScore:
        this.latest()?.score ?? 0
    };
  }
}
