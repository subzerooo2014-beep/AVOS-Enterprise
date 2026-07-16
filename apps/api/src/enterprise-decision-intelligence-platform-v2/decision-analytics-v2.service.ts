import { Injectable } from "@nestjs/common";
import { DecisionApprovalWorkflowV2Service } from "./decision-approval-workflow-v2.service";
import { DecisionAuditTimelineV2Service } from "./decision-audit-timeline-v2.service";
import { DecisionCaseRegistryV2Service } from "./decision-case-registry-v2.service";
import { DecisionScenarioEngineV2Service } from "./decision-scenario-engine-v2.service";
import type {
  DecisionHealthV2,
  DecisionMetricsV2,
} from "./enterprise-decision-intelligence-v2.types";

@Injectable()
export class DecisionAnalyticsV2Service {
  constructor(
    private readonly decisions: DecisionCaseRegistryV2Service,
    private readonly scenarios: DecisionScenarioEngineV2Service,
    private readonly approvals: DecisionApprovalWorkflowV2Service,
    private readonly audit: DecisionAuditTimelineV2Service,
  ) {}

  metrics(): DecisionMetricsV2 {
    return {
      decisions: this.decisions.count(),
      approvedDecisions: this.decisions.approvedCount(),
      rejectedDecisions: this.decisions.rejectedCount(),
      scenarios: this.scenarios.scenarioCount(),
      recommendations: this.scenarios.recommendationCount(),
      pendingApprovals: this.approvals.pendingCount(),
      auditRecords: this.audit.count(),
    };
  }

  health(): DecisionHealthV2 {
    const metrics = this.metrics();

    return {
      success: true,
      system: "AVOS Enterprise Decision Intelligence Platform V2",
      version: "2.0.0",
      status: metrics.pendingApprovals > 0 ? "DEGRADED" : "READY",
      metrics,
      components: {
        decisionRegistry: "READY",
        scenarioEngine: "READY",
        recommendationEngine: "READY",
        approvalWorkflow: "READY",
        impactAnalysis: "READY",
        decisionAuditTimeline: "READY",
        decisionAnalytics: "READY",
      },
    };
  }

  diagnostics() {
    return {
      success: true,
      health: this.health(),
      decisions: this.decisions.list(),
      scenarios: this.scenarios.scenariosList(),
      recommendations: this.scenarios.recommendationsList(),
      approvals: this.approvals.list(),
      audit: this.audit.list(),
    };
  }
}
