import { Module } from "@nestjs/common";
import { GlobalEnterpriseCoreController } from "./global-enterprise-core.controller";
import { GlobalEnterpriseCoreService } from "./global-enterprise-core.service";

import { ConstitutionalRuleService } from "./services/constitutional-rule.service";
import { ConstitutionalEngineService } from "./services/constitutional-engine.service";
import { GlobalGovernanceService } from "./services/global-governance.service";
import { PolicyFrameworkService } from "./services/policy-framework.service";
import { CertificationFrameworkService } from "./services/certification-framework.service";
import { CertificationAssessmentService } from "./services/certification-assessment.service";
import { StandardsCenterService } from "./services/standards-center.service";
import { StandardsObservatoryService } from "./services/standards-observatory.service";
import { GlobalOperationsService } from "./services/global-operations.service";
import { CommandCenterService } from "./services/command-center.service";
import { ControlTowerService } from "./services/control-tower.service";
import { EnterpriseRegistryService } from "./services/enterprise-registry.service";
import { TrustNetworkService } from "./services/trust-network.service";
import { MonitoringCenterService } from "./services/monitoring-center.service";
import { ResilienceCenterService } from "./services/resilience-center.service";
import { ResilienceAssessmentService } from "./services/resilience-assessment.service";
import { StrategicConsoleService } from "./services/strategic-console.service";
import { GlobalIntelligenceService } from "./services/global-intelligence.service";
import { EvidenceVaultService } from "./services/evidence-vault.service";
import { ConstitutionalDecisionService } from "./services/constitutional-decision.service";
import { GovernanceAuditService } from "./services/governance-audit.service";
import { ReleaseApprovalService } from "./services/release-approval.service";
import { GlobalComplianceService } from "./services/global-compliance.service";
import { GlobalEnterpriseAuditService } from "./services/global-enterprise-audit.service";
import { GlobalEnterpriseDashboardService } from "./services/global-enterprise-dashboard.service";

import { DigitalConstitutionRuntime } from "./runtime/digital-constitution.runtime";
import { GlobalGovernanceRuntime } from "./runtime/global-governance.runtime";
import { EnterpriseCertificationRuntime } from "./runtime/enterprise-certification.runtime";
import { StandardsObservatoryRuntime } from "./runtime/standards-observatory.runtime";
import { GlobalOperationsCenterRuntime } from "./runtime/global-operations-center.runtime";
import { ExecutiveCommandCenterRuntime } from "./runtime/executive-command-center.runtime";
import { EnterpriseResilienceRuntime } from "./runtime/enterprise-resilience.runtime";
import { GlobalIntelligenceRuntime } from "./runtime/global-intelligence.runtime";

@Module({
  controllers:[GlobalEnterpriseCoreController],
  providers:[
    GlobalEnterpriseCoreService,
    ConstitutionalRuleService,ConstitutionalEngineService,GlobalGovernanceService,PolicyFrameworkService,
    CertificationFrameworkService,CertificationAssessmentService,StandardsCenterService,StandardsObservatoryService,
    GlobalOperationsService,CommandCenterService,ControlTowerService,EnterpriseRegistryService,TrustNetworkService,
    MonitoringCenterService,ResilienceCenterService,ResilienceAssessmentService,StrategicConsoleService,
    GlobalIntelligenceService,EvidenceVaultService,ConstitutionalDecisionService,GovernanceAuditService,
    ReleaseApprovalService,GlobalComplianceService,GlobalEnterpriseAuditService,GlobalEnterpriseDashboardService,
    DigitalConstitutionRuntime,GlobalGovernanceRuntime,EnterpriseCertificationRuntime,StandardsObservatoryRuntime,
    GlobalOperationsCenterRuntime,ExecutiveCommandCenterRuntime,EnterpriseResilienceRuntime,GlobalIntelligenceRuntime
  ],
  exports:[GlobalEnterpriseCoreService],
})
export class GlobalEnterpriseCoreModule {}
