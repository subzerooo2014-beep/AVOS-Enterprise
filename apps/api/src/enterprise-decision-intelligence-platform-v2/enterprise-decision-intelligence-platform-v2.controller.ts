import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { DecisionAnalyticsV2Service } from "./decision-analytics-v2.service";
import { DecisionApprovalWorkflowV2Service } from "./decision-approval-workflow-v2.service";
import { DecisionAuditTimelineV2Service } from "./decision-audit-timeline-v2.service";
import { DecisionCaseRegistryV2Service } from "./decision-case-registry-v2.service";
import { DecisionScenarioEngineV2Service } from "./decision-scenario-engine-v2.service";
import type { DecisionCaseV2 } from "./enterprise-decision-intelligence-v2.types";

@Controller("enterprise-decision-intelligence-platform-v2")
export class EnterpriseDecisionIntelligencePlatformV2Controller {
  constructor(
    private readonly analytics: DecisionAnalyticsV2Service,
    private readonly decisions: DecisionCaseRegistryV2Service,
    private readonly scenarios: DecisionScenarioEngineV2Service,
    private readonly approvals: DecisionApprovalWorkflowV2Service,
    private readonly audit: DecisionAuditTimelineV2Service,
  ) {}

  @Get("status")
  status() {
    return this.analytics.health();
  }

  @Get("diagnostics")
  diagnostics() {
    return this.analytics.diagnostics();
  }

  @Post("decisions")
  upsertDecision(
    @Body() body: Omit<DecisionCaseV2, "createdAt" | "updatedAt">,
  ) {
    const decision = this.decisions.upsert(body);

    this.audit.record(
      decision.id,
      "UPSERT_DECISION",
      body.owner,
      { status: decision.status },
    );

    return { success: true, decision };
  }

  @Post("decisions/:id/scenarios")
  addScenario(
    @Param("id") id: string,
    @Body()
    body: {
      name: string;
      assumptions: Record<string, unknown>;
      benefitScore: number;
      riskScore: number;
      costScore: number;
      feasibilityScore: number;
    },
  ) {
    return {
      success: true,
      scenario: this.scenarios.addScenario(
        id,
        body.name,
        body.assumptions,
        body.benefitScore,
        body.riskScore,
        body.costScore,
        body.feasibilityScore,
      ),
    };
  }

  @Post("decisions/:id/recommend")
  recommend(@Param("id") id: string) {
    return {
      success: true,
      recommendations: this.scenarios.recommend(id),
    };
  }

  @Post("decisions/:id/approval-request")
  requestApproval(
    @Param("id") id: string,
    @Body() body: { approver: string },
  ) {
    return {
      success: true,
      approval: this.approvals.request(id, body.approver),
    };
  }

  @Post("approvals/:id/approve")
  approveRequest(
    @Param("id") id: string,
    @Body() body: { reason?: string },
  ) {
    return {
      success: true,
      approval: this.approvals.approve(id, body.reason),
    };
  }

  @Post("decisions/:id/approve")
  approveDecision(
    @Param("id") id: string,
    @Body()
    body: {
      selectedOption: string;
      confidence: number;
      rationale: string;
      actor: string;
    },
  ) {
    const decision = this.decisions.approve(
      id,
      body.selectedOption,
      body.confidence,
      body.rationale,
    );

    this.audit.record(id, "APPROVE_DECISION", body.actor, {
      selectedOption: body.selectedOption,
      confidence: body.confidence,
    });

    return { success: true, decision };
  }

  @Get("decisions/:id/audit")
  auditTimeline(@Param("id") id: string) {
    return {
      success: true,
      items: this.audit.list(id),
    };
  }
}
