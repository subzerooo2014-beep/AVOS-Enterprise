import { Injectable } from "@nestjs/common";
import { AdaptiveGrowthUltimateArchitectureReviewService } from "./adaptive-growth-ultimate-architecture-review.service";
import { AdaptiveGrowthUltimatePlatformService } from "./adaptive-growth-ultimate-platform.service";

@Injectable()
export class AdaptiveGrowthUltimateReadinessService {
  private latest: Record<string, unknown> | undefined;

  constructor(
    private readonly platform: AdaptiveGrowthUltimatePlatformService,
    private readonly review: AdaptiveGrowthUltimateArchitectureReviewService,
  ) {}

  run() {
    const status = this.platform.status();
    const review = this.review.run();

    const checks = {
      architectureReview: review.status === "passed",
      platformOperational: status.status === "operational",
      healthScore: status.health.score === 100,
      orchestrationReady: status.capabilities.enterpriseOrchestration,
      workflowsReady: status.capabilities.autonomousWorkflows,
      observabilityReady: status.capabilities.monitoringAndObservability,
      learningReady: status.capabilities.adaptiveLearning,
      multiAgentReady: status.capabilities.multiAgentTeams,
      securityReady: status.components.security.status === "operational",
      scalabilityReady: status.components.scalability.status === "ready",
      resilienceReady: status.components.resilience.status === "operational",
      disasterRecoveryDefined: status.components.disasterRecovery.status === "defined",
      humanAuthorityPreserved: status.humanFinalAuthority,
      complianceGate: status.globalComplianceReadinessGate,
    };

    const score =
      (Object.values(checks).filter(Boolean).length / Object.keys(checks).length) * 100;

    this.latest = {
      id: `ags-production-readiness:${Date.now()}`,
      status: score === 100 ? "ready" : "not-ready",
      score,
      checks,
      advisories: [
        "Replace in-memory foundation stores with durable distributed persistence before multi-instance production deployment.",
        "Configure external secrets management and production decision signing keys.",
        "Run environment-specific load, failover, backup, restore, security and disaster-recovery drills.",
      ],
      evaluatedAt: new Date().toISOString(),
    };

    return this.latest;
  }

  status() {
    return this.latest ?? { status: "not-run" };
  }
}