import { BadRequestException, Injectable } from "@nestjs/common";
import { randomUUID } from "crypto";
import {
  AgpPack46Certification,
} from "../contracts/agp-enterprise-integration.contracts";
import { AgpPack46HealthService } from "../health/agp-pack-4-6-health.service";
import { AgpPack46VerificationService } from "../verification/agp-pack-4-6-verification.service";

@Injectable()
export class AgpPack46CertificationService {
  private latest?: AgpPack46Certification;

  constructor(
    private readonly health: AgpPack46HealthService,
    private readonly verification: AgpPack46VerificationService,
  ) {}

  certify(approvedBy: string): AgpPack46Certification {
    if (!approvedBy?.trim()) {
      throw new BadRequestException("approvedBy is required.");
    }

    const health = this.health.status();
    const verification = this.verification.run();

    const checks: Record<string, boolean> = {
      campaignPlatform: verification.checks.campaignPlatform,
      funnelIntelligence: verification.checks.funnelIntelligence,
      customerJourneyIntelligence:
        verification.checks.customerJourneyIntelligence,
      experimentationPlatform:
        verification.checks.experimentationPlatform,
      conversionOptimization:
        verification.checks.conversionOptimization,
      revenueIntelligence: verification.checks.revenueIntelligence,
      pricingIntelligence: verification.checks.pricingIntelligence,
      revenueForecasting: verification.checks.revenueForecasting,
      growthAttribution: verification.checks.growthAttribution,
      executiveGrowthDashboard:
        verification.checks.executiveGrowthDashboard,
      crmIntegration: verification.checks.crmIntegration,
      marketplaceIntegration:
        verification.checks.marketplaceIntegration,
      mediaPlatformIntegration:
        verification.checks.mediaPlatformIntegration,
      financePlatformIntegration:
        verification.checks.financePlatformIntegration,
      unifiedWorkflowIntegration:
        verification.checks.unifiedWorkflowIntegration,
      notificationIntegration:
        verification.checks.notificationIntegration,
      analyticsIntegration: verification.checks.analyticsIntegration,
      enterpriseEventIntegration:
        verification.checks.enterpriseEventIntegration,
      adapterBoundaryPreserved:
        verification.checks.adapterBoundaryPreserved,
      health: health.score === 100,
      verification: verification.status === "passed",
      noLogicDuplication: verification.checks.noLogicDuplication,
      humanFinalAuthority: verification.checks.humanFinalAuthority,
      globalComplianceReadinessGate:
        verification.checks.globalComplianceReadinessGate,
      foundationFirst: verification.checks.foundationFirst,
      capabilityFirst: verification.checks.capabilityFirst,
      blueprintDriven: verification.checks.blueprintDriven,
    };

    const blockingFindings = Object.entries(checks)
      .filter(([, passed]) => !passed)
      .map(([name]) => name);
    const score = Math.round(
      (Object.values(checks).filter(Boolean).length /
        Object.keys(checks).length) *
        100,
    );

    this.latest = {
      id: `agp-certification:${randomUUID()}`,
      name:
        "AVOS Growth Platform — Mega Pack 4–6 — Campaign, Revenue Intelligence & Enterprise Integration",
      version: "AGP-MP4-6-1.0.0",
      status: blockingFindings.length === 0 ? "certified" : "rejected",
      score,
      checks,
      blockingFindings,
      approvedBy,
      certifiedAt: new Date().toISOString(),
      generatedAt: new Date().toISOString(),
    };

    return this.latest;
  }

  status() {
    return (
      this.latest ?? {
        name:
          "AVOS Growth Platform — Mega Pack 4–6 — Campaign, Revenue Intelligence & Enterprise Integration",
        version: "AGP-MP4-6-1.0.0",
        status: "not-certified",
        generatedAt: new Date().toISOString(),
      }
    );
  }
}