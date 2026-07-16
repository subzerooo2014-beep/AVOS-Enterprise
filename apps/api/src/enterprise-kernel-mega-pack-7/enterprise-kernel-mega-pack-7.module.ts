import { Module } from "@nestjs/common";
import { EnterpriseKernelMegaPack7Controller } from "./enterprise-kernel-mega-pack-7.controller";
import { EnterpriseKernelMegaPack7Service } from "./enterprise-kernel-mega-pack-7.service";
import { EnterpriseKernelFinalAuditService } from "./observability/enterprise-kernel-final-audit.service";
import { KernelObservabilityService } from "./observability/kernel-observability.service";
import { KernelEvidenceVaultService } from "./evidence/kernel-evidence-vault.service";
import { LivingKernelIntelligenceService } from "./living-kernel/living-kernel-intelligence.service";
import { MetaKernelGovernanceService } from "./meta-kernel/meta-kernel-governance.service";
import { EnterpriseKernelPackRegistryService } from "./validation/enterprise-kernel-pack-registry.service";
import { EnterpriseKernelCrossValidationService } from "./validation/enterprise-kernel-cross-validation.service";
import { EnterpriseKernelCertificationService } from "./certification/enterprise-kernel-certification.service";
import { EnterpriseKernelFinalSmokeTestService } from "./smoke/enterprise-kernel-final-smoke-test.service";
import { EnterpriseKernelReleaseDecisionService } from "./release/enterprise-kernel-release-decision.service";
import { EnterpriseKernelFinalHealthService } from "./health/enterprise-kernel-final-health.service";

@Module({
  controllers: [EnterpriseKernelMegaPack7Controller],
  providers: [
    EnterpriseKernelMegaPack7Service,
    EnterpriseKernelFinalAuditService,
    KernelObservabilityService,
    KernelEvidenceVaultService,
    LivingKernelIntelligenceService,
    MetaKernelGovernanceService,
    EnterpriseKernelPackRegistryService,
    EnterpriseKernelCrossValidationService,
    EnterpriseKernelCertificationService,
    EnterpriseKernelFinalSmokeTestService,
    EnterpriseKernelReleaseDecisionService,
    EnterpriseKernelFinalHealthService
  ],
  exports: [
    EnterpriseKernelMegaPack7Service,
    EnterpriseKernelFinalAuditService,
    KernelObservabilityService,
    KernelEvidenceVaultService,
    LivingKernelIntelligenceService,
    MetaKernelGovernanceService,
    EnterpriseKernelPackRegistryService,
    EnterpriseKernelCrossValidationService,
    EnterpriseKernelCertificationService,
    EnterpriseKernelFinalSmokeTestService,
    EnterpriseKernelReleaseDecisionService,
    EnterpriseKernelFinalHealthService
  ]
})
export class EnterpriseKernelMegaPack7Module {}
