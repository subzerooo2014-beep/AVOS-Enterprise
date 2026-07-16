import { Module } from "@nestjs/common";
import { FoundationCompletionPack8Controller } from "./foundation-completion-pack-8.controller";
import { FoundationCompletionPack8Service } from "./foundation-completion-pack-8.service";
import { DigitalConstitutionService } from "./constitution/digital-constitution.service";
import { GovernancePolicyRegistryService } from "./policies/governance-policy-registry.service";
import { GovernanceStandardRegistryService } from "./standards/governance-standard-registry.service";
import { ComplianceControlRegistryService } from "./compliance/compliance-control-registry.service";
import { ComplianceAssessmentService } from "./compliance/compliance-assessment.service";
import { EnterpriseRiskRegistryService } from "./risk/enterprise-risk-registry.service";
import { GovernanceLifecycleService } from "./lifecycle/governance-lifecycle.service";
import { GovernanceExceptionService } from "./exceptions/governance-exception.service";
import { GovernanceEnforcementEngineService } from "./enforcement/governance-enforcement-engine.service";
import { GovernanceEvidenceService } from "./evidence/governance-evidence.service";
import { GovernanceAuditService } from "./observability/governance-audit.service";

@Module({
  controllers: [FoundationCompletionPack8Controller],
  providers: [
    FoundationCompletionPack8Service,
    DigitalConstitutionService,
    GovernancePolicyRegistryService,
    GovernanceStandardRegistryService,
    ComplianceControlRegistryService,
    ComplianceAssessmentService,
    EnterpriseRiskRegistryService,
    GovernanceLifecycleService,
    GovernanceExceptionService,
    GovernanceEnforcementEngineService,
    GovernanceEvidenceService,
    GovernanceAuditService
  ],
  exports: [
    FoundationCompletionPack8Service,
    DigitalConstitutionService,
    GovernancePolicyRegistryService,
    GovernanceStandardRegistryService,
    ComplianceControlRegistryService,
    ComplianceAssessmentService,
    EnterpriseRiskRegistryService,
    GovernanceLifecycleService,
    GovernanceExceptionService,
    GovernanceEnforcementEngineService,
    GovernanceEvidenceService,
    GovernanceAuditService
  ]
})
export class FoundationCompletionPack8Module {}
