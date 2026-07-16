import { Module } from "@nestjs/common";
import { FoundationCompletionPack5Controller } from "./foundation-completion-pack-5.controller";
import { FoundationCompletionPack5Service } from "./foundation-completion-pack-5.service";
import { GovernancePolicyService } from "./policy/governance-policy.service";
import { GovernanceStandardsRegistryService } from "./standards/governance-standards-registry.service";
import { GovernanceComplianceEngineService } from "./compliance/governance-compliance-engine.service";
import { EnterpriseRiskGovernanceService } from "./risk/enterprise-risk-governance.service";
import { GovernanceLifecycleManagerService } from "./lifecycle/governance-lifecycle-manager.service";
import { GovernanceDecisionEngineService } from "./decision/governance-decision-engine.service";
import { GovernanceAuditTrailService } from "./audit/governance-audit-trail.service";

@Module({
  controllers: [FoundationCompletionPack5Controller],
  providers: [
    FoundationCompletionPack5Service,
    GovernancePolicyService,
    GovernanceStandardsRegistryService,
    GovernanceComplianceEngineService,
    EnterpriseRiskGovernanceService,
    GovernanceLifecycleManagerService,
    GovernanceDecisionEngineService,
    GovernanceAuditTrailService
  ],
  exports: [
    FoundationCompletionPack5Service,
    GovernancePolicyService,
    GovernanceStandardsRegistryService,
    GovernanceComplianceEngineService,
    EnterpriseRiskGovernanceService,
    GovernanceLifecycleManagerService,
    GovernanceDecisionEngineService,
    GovernanceAuditTrailService
  ]
})
export class FoundationCompletionPack5Module {}
