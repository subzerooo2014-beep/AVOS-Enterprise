import { Injectable } from "@nestjs/common";
import { CapabilityRegistryService } from "../capability-fabric/capability-registry.service";
import { CapabilityUsageAnalyticsService } from "./capability-usage-analytics.service";
import { CapabilityIntelligenceScore } from "./capability-intelligence.types";

@Injectable()
export class CapabilityScoringService {
  constructor(
    private readonly registry: CapabilityRegistryService,
    private readonly usage: CapabilityUsageAnalyticsService,
  ) {}

  evaluate(capabilityKey: string): CapabilityIntelligenceScore {
    const capability = this.registry.get(capabilityKey);
    if (!capability) {
      throw new Error(`Capability not found: ${capabilityKey}`);
    }

    const usage = this.usage.profile(capabilityKey);

    const architecture = this.average([
      capability.contracts.length > 0 ? 90 : 55,
      capability.dependencies.every((dependency) =>
        Boolean(dependency.reason?.trim()),
      )
        ? 90
        : 60,
      capability.versionHistory.length > 0 ? 90 : 50,
    ]);

    const runtime = this.average([
      usage.successRate,
      usage.runtimeInstances > 0 ? 85 : 65,
      usage.averageDurationMs <= 1000 ? 90 : 70,
    ]);

    const observability = this.average([
      capability.metrics.length > 0 ? 95 : 50,
      capability.health.healthEndpoint ||
      capability.health.readinessEndpoint
        ? 95
        : 45,
      capability.events.length > 0 ? 85 : 60,
    ]);

    const security = this.average([
      capability.security.authenticationRequired ? 95 : 40,
      capability.security.authorizationRequired ? 95 : 50,
      capability.security.trustBoundary ? 90 : 45,
      capability.permissions.length > 0 ? 85 : 60,
    ]);

    const governance = this.average([
      capability.policies.length > 0 ? 90 : 60,
      capability.identity.owner ? 95 : 30,
      capability.evolutionHistory.length > 0 ? 85 : 65,
    ]);

    const reuse = usage.reuseScore;
    const documentation = this.average([
      capability.documentationRef ? 95 : 55,
      capability.purpose.outcomes.length > 0 ? 90 : 60,
      capability.purpose.nonGoals.length > 0 ? 80 : 60,
    ]);

    const qualityIndex = this.average([
      architecture,
      runtime,
      observability,
      security,
      governance,
      documentation,
    ]);

    const trustScore = this.average([
      usage.successRate,
      security,
      governance,
      observability,
    ]);

    const maturityWeight: Record<string, number> = {
      CONCEPT: 20,
      PROTOTYPE: 35,
      SHARED_CAPABILITY: 55,
      CORE_ENGINE: 75,
      PLATFORM_SERVICE: 90,
      STANDALONE_PRODUCT: 95,
      LEGACY_ASSET: 60,
    };

    const maturityScore = this.average([
      maturityWeight[capability.lifecycleStage] ?? 40,
      qualityIndex,
      reuse,
    ]);

    const riskScore = Math.max(
      0,
      100 -
        this.average([
          trustScore,
          usage.successRate,
          security,
          observability,
        ]),
    );

    const technicalDebtScore = Math.max(
      0,
      100 -
        this.average([
          architecture,
          documentation,
          governance,
          observability,
        ]),
    );

    return {
      capabilityKey: capability.identity.key,
      qualityIndex: this.round(qualityIndex),
      trustScore: this.round(trustScore),
      maturityScore: this.round(maturityScore),
      riskScore: this.round(riskScore),
      technicalDebtScore: this.round(technicalDebtScore),
      reuseScore: this.round(reuse),
      breakdown: {
        architecture: this.round(architecture),
        runtime: this.round(runtime),
        observability: this.round(observability),
        security: this.round(security),
        governance: this.round(governance),
        reuse: this.round(reuse),
        documentation: this.round(documentation),
      },
      evaluatedAt: new Date().toISOString(),
    };
  }

  private average(values: number[]) {
    return values.reduce((total, value) => total + value, 0) / values.length;
  }

  private round(value: number) {
    return Math.round(value * 100) / 100;
  }
}