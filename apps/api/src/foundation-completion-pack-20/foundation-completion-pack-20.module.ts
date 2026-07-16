import { Module } from "@nestjs/common";
import { FoundationCompletionPack20Controller } from "./foundation-completion-pack-20.controller";
import { FoundationCompletionPack20Service } from "./foundation-completion-pack-20.service";
import { FoundationPackRegistryService } from "./registry/foundation-pack-registry.service";
import { CrossFoundationValidationService } from "./validation/cross-foundation-validation.service";
import { FoundationCertificationService } from "./certification/foundation-certification.service";
import { FoundationManifestService } from "./manifest/foundation-manifest.service";
import { FoundationEvidenceVaultService } from "./evidence/foundation-evidence-vault.service";
import { FoundationFinalSmokeTestService } from "./smoke/foundation-final-smoke-test.service";
import { FoundationReleaseDecisionService } from "./release/foundation-release-decision.service";
import { FoundationFinalHealthService } from "./health/foundation-final-health.service";
import { FoundationFinalAuditService } from "./observability/foundation-final-audit.service";

@Module({
  controllers: [FoundationCompletionPack20Controller],
  providers: [
    FoundationCompletionPack20Service,
    FoundationPackRegistryService,
    CrossFoundationValidationService,
    FoundationCertificationService,
    FoundationManifestService,
    FoundationEvidenceVaultService,
    FoundationFinalSmokeTestService,
    FoundationReleaseDecisionService,
    FoundationFinalHealthService,
    FoundationFinalAuditService
  ],
  exports: [
    FoundationCompletionPack20Service,
    FoundationPackRegistryService,
    CrossFoundationValidationService,
    FoundationCertificationService,
    FoundationManifestService,
    FoundationEvidenceVaultService,
    FoundationFinalSmokeTestService,
    FoundationReleaseDecisionService,
    FoundationFinalHealthService,
    FoundationFinalAuditService
  ]
})
export class FoundationCompletionPack20Module {}
