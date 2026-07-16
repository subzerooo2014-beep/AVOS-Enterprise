import { Module } from "@nestjs/common";
import { DecisionAnalyticsV2Service } from "./decision-analytics-v2.service";
import { DecisionApprovalWorkflowV2Service } from "./decision-approval-workflow-v2.service";
import { DecisionAuditTimelineV2Service } from "./decision-audit-timeline-v2.service";
import { DecisionCaseRegistryV2Service } from "./decision-case-registry-v2.service";
import { DecisionScenarioEngineV2Service } from "./decision-scenario-engine-v2.service";
import { EnterpriseDecisionIntelligencePlatformV2Controller } from "./enterprise-decision-intelligence-platform-v2.controller";

@Module({
  controllers: [EnterpriseDecisionIntelligencePlatformV2Controller],
  providers: [
    DecisionAnalyticsV2Service,
    DecisionApprovalWorkflowV2Service,
    DecisionAuditTimelineV2Service,
    DecisionCaseRegistryV2Service,
    DecisionScenarioEngineV2Service,
  ],
  exports: [
    DecisionAnalyticsV2Service,
    DecisionApprovalWorkflowV2Service,
    DecisionAuditTimelineV2Service,
    DecisionCaseRegistryV2Service,
    DecisionScenarioEngineV2Service,
  ],
})
export class EnterpriseDecisionIntelligencePlatformV2Module {}
