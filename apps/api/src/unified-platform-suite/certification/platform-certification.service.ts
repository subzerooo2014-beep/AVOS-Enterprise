import { Injectable } from "@nestjs/common";
import { UnifiedGovernanceService } from "../governance/unified-governance.service";
import { PlatformObservabilityService } from "../observability/platform-observability.service";
import { PlatformSmokeTestService } from "../smoke/platform-smoke-test.service";
import { UnifiedPlatformFoundationService } from "../foundation/unified-platform-foundation.service";
import { UnifiedPlatformRegistryService } from "../registry/unified-platform-registry.service";

@Injectable()
export class PlatformCertificationService {
  private latest: Record<string, unknown> | null = null;

  constructor(
    private readonly foundation: UnifiedPlatformFoundationService,
    private readonly registry: UnifiedPlatformRegistryService,
    private readonly governance: UnifiedGovernanceService,
    private readonly observability: PlatformObservabilityService,
    private readonly smoke: PlatformSmokeTestService
  ) {}

  certify(approvedBy = "human:pending") {
    const smoke = this.smoke.run();
    const principles = this.foundation.getPrinciples();
    const checks = {
      validation: this.registry.list("suite").length >= 5,
      architectureReview: principles.foundationFirst && principles.capabilityFirst,
      capabilityReview: this.registry.summary().total >= 5,
      complianceReview: this.governance.getStatus().globalComplianceReadinessGate === true,
      observabilityReview: this.observability.health().status === "healthy",
      smokeTest: smoke.status === "passed",
      humanFinalAuthority: principles.humanFinalAuthority
    };
    const passed = Object.values(checks).every(Boolean);
    this.latest = {
      id: `unified-platform-certification-${Date.now()}`,
      status: passed ? "certified" : "not-certified",
      score: Math.round((Object.values(checks).filter(Boolean).length / Object.keys(checks).length) * 100),
      checks,
      smoke,
      approvedBy,
      certifiedAt: passed ? new Date().toISOString() : null
    };
    return this.latest;
  }

  status() {
    return this.latest ?? { status: "not-certified" };
  }
}