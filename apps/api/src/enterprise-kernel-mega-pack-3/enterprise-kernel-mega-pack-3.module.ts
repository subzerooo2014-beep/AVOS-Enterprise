import { Module } from "@nestjs/common";
import { EnterpriseKernelMegaPack3Controller } from "./enterprise-kernel-mega-pack-3.controller";
import { EnterpriseKernelMegaPack3Service } from "./enterprise-kernel-mega-pack-3.service";
import { KernelSecurityAuditService } from "./observability/kernel-security-audit.service";
import { KernelPrincipalRegistryService } from "./authorization/kernel-principal-registry.service";
import { KernelPermissionRegistryService } from "./permissions/kernel-permission-registry.service";
import { KernelPolicyRegistryService } from "./policies/kernel-policy-registry.service";
import { KernelAuthorizationService } from "./authorization/kernel-authorization.service";
import { KernelTrustIntegrationService } from "./trust/kernel-trust-integration.service";
import { KernelGovernanceIntegrationService } from "./governance/kernel-governance-integration.service";
import { KernelApprovalService } from "./approvals/kernel-approval.service";
import { KernelExecutionGuardService } from "./guards/kernel-execution-guard.service";
import { KernelControlledExecutionService } from "./execution/kernel-controlled-execution.service";
import { KernelSecurityHealthService } from "./health/kernel-security-health.service";

@Module({
  controllers: [EnterpriseKernelMegaPack3Controller],
  providers: [
    EnterpriseKernelMegaPack3Service,
    KernelSecurityAuditService,
    KernelPrincipalRegistryService,
    KernelPermissionRegistryService,
    KernelPolicyRegistryService,
    KernelAuthorizationService,
    KernelTrustIntegrationService,
    KernelGovernanceIntegrationService,
    KernelApprovalService,
    KernelExecutionGuardService,
    KernelControlledExecutionService,
    KernelSecurityHealthService
  ],
  exports: [
    EnterpriseKernelMegaPack3Service,
    KernelSecurityAuditService,
    KernelPrincipalRegistryService,
    KernelPermissionRegistryService,
    KernelPolicyRegistryService,
    KernelAuthorizationService,
    KernelTrustIntegrationService,
    KernelGovernanceIntegrationService,
    KernelApprovalService,
    KernelExecutionGuardService,
    KernelControlledExecutionService,
    KernelSecurityHealthService
  ]
})
export class EnterpriseKernelMegaPack3Module {}
