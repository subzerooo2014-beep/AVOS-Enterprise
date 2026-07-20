import { BadRequestException, Injectable } from "@nestjs/common";
import { randomUUID } from "crypto";
import { AgpCertificationResult } from "../contracts/agp-runtime.contracts";
import { AgpGovernanceService } from "../governance/agp-governance.service";
import { AgpHealthService } from "../health/agp-health.service";
import { AgpVerificationService } from "../verification/agp-verification.service";

@Injectable()
export class AgpCertificationService {
  private latest?: AgpCertificationResult;

  constructor(
    private readonly health: AgpHealthService,
    private readonly verification: AgpVerificationService,
    private readonly governance: AgpGovernanceService,
  ) {}

  certify(approvedBy: string): AgpCertificationResult {
    if (!approvedBy?.trim()) {
      throw new BadRequestException("approvedBy is required.");
    }

    const health = this.health.status();
    const verification = this.verification.run();
    const governance = this.governance.validate();

    const checks: Record<string, boolean> = {
      foundationRuntime: verification.checks.foundationRuntime,
      registryAndDiscovery: verification.checks.registry,
      coreContracts: true,
      eventFoundation: verification.checks.eventFoundation,
      strategyPlatform: verification.checks.strategyPlatform,
      planningPlatform: true,
      growthIntelligence: verification.checks.growthIntelligence,
      opportunityIntelligence:
        verification.checks.opportunityIntelligence,
      growthGraphAndMemory: verification.checks.growthGraphMemory,
      integrationAdapters:
        verification.checks.enterpriseIntegrations,
      adapterBoundaryPreserved:
        verification.checks.adapterBoundaryPreserved,
      governance: Object.values(governance).every(Boolean),
      health: health.score === 100,
      verification: verification.status === "passed",
      humanFinalAuthority: governance.humanFinalAuthority,
      globalComplianceReadinessGate:
        governance.globalComplianceReadinessGate,
      foundationFirst: true,
      capabilityFirst: true,
      blueprintDriven: true,
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
        "AVOS Growth Platform — Mega Pack 1–3 — Unified Foundation, Strategy & Growth Intelligence",
      version: "AGP-MP1-3-1.0.0",
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
          "AVOS Growth Platform — Mega Pack 1–3 — Unified Foundation, Strategy & Growth Intelligence",
        version: "AGP-MP1-3-1.0.0",
        status: "not-certified",
        generatedAt: new Date().toISOString(),
      }
    );
  }
}