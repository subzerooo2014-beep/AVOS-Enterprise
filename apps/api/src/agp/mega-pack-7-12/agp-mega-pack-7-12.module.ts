import { Module } from "@nestjs/common";
import { AgpFinalPlatformCertificationService } from "./certification/agp-final-platform-certification.service";
import { AgpGovernancePlatformService } from "./governance/agp-governance-platform.service";
import { AgpFinalPlatformHealthService } from "./health/agp-final-platform-health.service";
import { AgpObservabilityProductionService } from "./operations/agp-observability-production.service";
import { AgpResilienceRecoveryService } from "./resilience/agp-resilience-recovery.service";
import { AgpArchitectureReviewService } from "./review/agp-architecture-review.service";
import { AgpSecurityTenantControlService } from "./security/agp-security-tenant-control.service";
import { AgpProductionSmokeTestService } from "./smoke/agp-production-smoke-test.service";
import { AgpTrustRiskComplianceService } from "./trust/agp-trust-risk-compliance.service";
import { AgpCrossPackVerificationService } from "./verification/agp-cross-pack-verification.service";
import { AgpMegaPack712Controller } from "./agp-mega-pack-7-12.controller";

@Module({
  controllers: [AgpMegaPack712Controller],
  providers: [
    AgpGovernancePlatformService,
    AgpTrustRiskComplianceService,
    AgpSecurityTenantControlService,
    AgpResilienceRecoveryService,
    AgpObservabilityProductionService,
    AgpArchitectureReviewService,
    AgpFinalPlatformHealthService,
    AgpCrossPackVerificationService,
    AgpProductionSmokeTestService,
    AgpFinalPlatformCertificationService,
  ],
  exports: [
    AgpGovernancePlatformService,
    AgpTrustRiskComplianceService,
    AgpSecurityTenantControlService,
    AgpResilienceRecoveryService,
    AgpObservabilityProductionService,
    AgpArchitectureReviewService,
    AgpFinalPlatformHealthService,
    AgpCrossPackVerificationService,
    AgpProductionSmokeTestService,
    AgpFinalPlatformCertificationService,
  ],
})
export class AgpMegaPack712Module {}