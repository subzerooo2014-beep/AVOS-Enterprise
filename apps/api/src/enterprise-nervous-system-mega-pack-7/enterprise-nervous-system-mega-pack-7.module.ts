import { Module } from "@nestjs/common";
import { EnterpriseNervousSystemMegaPack7Controller } from "./enterprise-nervous-system-mega-pack-7.controller";
import { EnterpriseNervousSystemMegaPack7Service } from "./enterprise-nervous-system-mega-pack-7.service";
import { NervousSystemFinalAuditService } from "./observability/nervous-system-final-audit.service";
import { NervousSystemPackRegistryService } from "./registry/nervous-system-pack-registry.service";
import { NervousSystemCrossValidationService } from "./validation/nervous-system-cross-validation.service";
import { NervousSystemManifestService } from "./manifest/nervous-system-manifest.service";
import { NervousSystemEvidenceVaultService } from "./evidence/nervous-system-evidence-vault.service";
import { NervousSystemCertificationService } from "./certification/nervous-system-certification.service";
import { NervousSystemFinalSmokeTestService } from "./smoke/nervous-system-final-smoke-test.service";
import { NervousSystemReleaseDecisionService } from "./release/nervous-system-release-decision.service";
import { NervousSystemFinalHealthService } from "./health/nervous-system-final-health.service";

@Module({
  controllers: [
    EnterpriseNervousSystemMegaPack7Controller
  ],
  providers: [
    EnterpriseNervousSystemMegaPack7Service,
    NervousSystemFinalAuditService,
    NervousSystemPackRegistryService,
    NervousSystemCrossValidationService,
    NervousSystemManifestService,
    NervousSystemEvidenceVaultService,
    NervousSystemCertificationService,
    NervousSystemFinalSmokeTestService,
    NervousSystemReleaseDecisionService,
    NervousSystemFinalHealthService
  ],
  exports: [
    EnterpriseNervousSystemMegaPack7Service,
    NervousSystemFinalAuditService,
    NervousSystemPackRegistryService,
    NervousSystemCrossValidationService,
    NervousSystemManifestService,
    NervousSystemEvidenceVaultService,
    NervousSystemCertificationService,
    NervousSystemFinalSmokeTestService,
    NervousSystemReleaseDecisionService,
    NervousSystemFinalHealthService
  ]
})
export class EnterpriseNervousSystemMegaPack7Module {}
