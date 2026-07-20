import { Injectable } from "@nestjs/common";
import { AgpGovernancePlatformService } from "../governance/agp-governance-platform.service";
import { AgpObservabilityProductionService } from "../operations/agp-observability-production.service";
import { AgpResilienceRecoveryService } from "../resilience/agp-resilience-recovery.service";
import { AgpArchitectureReviewService } from "../review/agp-architecture-review.service";
import { AgpSecurityTenantControlService } from "../security/agp-security-tenant-control.service";
import { AgpTrustRiskComplianceService } from "../trust/agp-trust-risk-compliance.service";

@Injectable()
export class AgpFinalPlatformHealthService {
  constructor(
    private readonly governance: AgpGovernancePlatformService,
    private readonly trust: AgpTrustRiskComplianceService,
    private readonly security: AgpSecurityTenantControlService,
    private readonly resilience: AgpResilienceRecoveryService,
    private readonly operations: AgpObservabilityProductionService,
    private readonly architecture: AgpArchitectureReviewService,
  ) {}

  status() {
    const governance = this.governance.health();
    const trust = this.trust.scores();
    const security = this.security.health();
    const resilience = this.resilience.health();
    const operations = this.operations.health();
    const architecture = this.architecture.run();

    const checks = {
      enterpriseGrowthGovernance: governance.status === "operational",
      trustRiskCompliance: trust.globalComplianceReadinessGate,
      securityTenantControls: security.status === "operational",
      resilienceRecovery: resilience.status === "operational",
      productionOperations: operations.status === "operational",
      architectureReview: architecture.status === "passed",
      humanFinalAuthority: governance.humanFinalAuthority,
      globalComplianceReadinessGate:
        trust.globalComplianceReadinessGate,
      foundationFirst: true,
      capabilityFirst: true,
      blueprintDriven: true,
    };

    const score = Math.round(
      (Object.values(checks).filter(Boolean).length /
        Object.keys(checks).length) *
        100,
    );

    return {
      name:
        "AVOS Growth Platform — Mega Pack 7–12 — Enterprise Governance, Trust, Security, Resilience, Production Operations & Final Platform Certification",
      version: "AGP-MP7-12-1.0.0",
      status: score === 100 ? "operational" : "degraded",
      score,
      checks,
      governance,
      trust,
      security,
      resilience,
      operations,
      architecture,
      generatedAt: new Date().toISOString(),
    };
  }
}