import { Injectable } from "@nestjs/common";
import { PlatformCertificationService } from "../certification/platform-certification.service";
import { CrossSuiteIntelligenceService } from "../intelligence/cross-suite-intelligence.service";
import { UnifiedGovernanceService } from "../governance/unified-governance.service";
import { PlatformObservabilityService } from "../observability/platform-observability.service";
import { UnifiedPlatformRegistryService } from "../registry/unified-platform-registry.service";

@Injectable()
export class UnifiedPlatformReportService {
  constructor(
    private readonly registry: UnifiedPlatformRegistryService,
    private readonly observability: PlatformObservabilityService,
    private readonly governance: UnifiedGovernanceService,
    private readonly intelligence: CrossSuiteIntelligenceService,
    private readonly certification: PlatformCertificationService
  ) {}

  generate() {
    const health = this.observability.health();
    const registry = this.registry.summary();
    const certification = this.certification.status();
    const platformScore =
      (health.status === "healthy" ? 30 : 0) +
      (registry.operational >= 5 ? 25 : 0) +
      (this.governance.getStatus().humanFinalAuthority ? 20 : 0) +
      ((certification as { status?: string }).status === "certified" ? 25 : 0);

    return {
      name: "AVOS Unified Platform Report",
      platformScore,
      capabilityCoverage: 15,
      activeSuites: this.registry.list("suite").filter((suite) => suite.status === "operational").length,
      health,
      governance: this.governance.getStatus(),
      security: { unifiedIdentity: true, policyEnforcement: true },
      intelligence: this.intelligence.analyze("Unified platform readiness"),
      risks: health.status === "healthy" ? [] : ["Platform health requires attention"],
      recommendations: [
        "Persist registry, workflows, and events in production storage.",
        "Connect each Ultra Suite through adapters and contractual APIs.",
        "Integrate enterprise authentication and distributed tracing.",
        "Preserve Human Final Authority for material decisions."
      ],
      certification,
      generatedAt: new Date().toISOString()
    };
  }
}