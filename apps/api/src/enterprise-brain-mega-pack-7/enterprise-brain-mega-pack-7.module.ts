import { Module } from "@nestjs/common";
import { EnterpriseBrainMegaPack7Controller } from "./enterprise-brain-mega-pack-7.controller";
import { EnterpriseBrainMegaPack7Service } from "./enterprise-brain-mega-pack-7.service";
import { EnterpriseBrainFinalAuditService } from "./observability/enterprise-brain-final-audit.service";
import { EnterpriseBrainPackRegistryService } from "./registry/enterprise-brain-pack-registry.service";
import { EnterpriseBrainCrossValidationService } from "./validation/enterprise-brain-cross-validation.service";
import { EnterpriseBrainManifestService } from "./manifest/enterprise-brain-manifest.service";
import { EnterpriseBrainEvidenceVaultService } from "./evidence/enterprise-brain-evidence-vault.service";
import { EnterpriseBrainCertificationService } from "./certification/enterprise-brain-certification.service";
import { EnterpriseBrainFinalSmokeTestService } from "./smoke/enterprise-brain-final-smoke-test.service";
import { EnterpriseBrainReleaseDecisionService } from "./release/enterprise-brain-release-decision.service";
import { EnterpriseBrainFinalHealthService } from "./health/enterprise-brain-final-health.service";

@Module({
  controllers: [EnterpriseBrainMegaPack7Controller],
  providers: [
    EnterpriseBrainMegaPack7Service,
    EnterpriseBrainFinalAuditService,
    EnterpriseBrainPackRegistryService,
    EnterpriseBrainCrossValidationService,
    EnterpriseBrainManifestService,
    EnterpriseBrainEvidenceVaultService,
    EnterpriseBrainCertificationService,
    EnterpriseBrainFinalSmokeTestService,
    EnterpriseBrainReleaseDecisionService,
    EnterpriseBrainFinalHealthService
  ],
  exports: [
    EnterpriseBrainMegaPack7Service,
    EnterpriseBrainFinalAuditService,
    EnterpriseBrainPackRegistryService,
    EnterpriseBrainCrossValidationService,
    EnterpriseBrainManifestService,
    EnterpriseBrainEvidenceVaultService,
    EnterpriseBrainCertificationService,
    EnterpriseBrainFinalSmokeTestService,
    EnterpriseBrainReleaseDecisionService,
    EnterpriseBrainFinalHealthService
  ]
})
export class EnterpriseBrainMegaPack7Module {}
