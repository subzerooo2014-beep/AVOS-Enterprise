import { Body, Controller, Get, Param, Post, Query } from "@nestjs/common";
import { CoreFlowGovernanceService } from "./core-flow-governance.service";
import { CoreFlowRiskService } from "./core-flow-risk.service";
import { CoreFlowPolicyEngineService } from "./core-flow-policy-engine.service";
import { CoreFlowComplianceService } from "./core-flow-compliance.service";
import { CoreFlowEscalationService } from "./core-flow-escalation.service";

@Controller("core-flow-governance")
export class CoreFlowGovernanceController {
  constructor(
    private readonly governance: CoreFlowGovernanceService,
    private readonly risk: CoreFlowRiskService,
    private readonly policies: CoreFlowPolicyEngineService,
    private readonly compliance: CoreFlowComplianceService,
    private readonly escalations: CoreFlowEscalationService,
  ) {}

  @Post("executions/:id/evaluate")
  evaluate(@Param("id") id: string, @Body() dto: any) {
    return this.governance.evaluate(id, dto);
  }

  @Get("risk")
  riskAssessments(@Query("executionId") executionId?: string) {
    return this.risk.findAll(executionId);
  }

  @Get("policies")
  policyDecisions(@Query("executionId") executionId?: string) {
    return this.policies.findAll(executionId);
  }

  @Post("compliance")
  recordCompliance(@Body() dto: any) {
    return this.compliance.record(
      dto?.executionId,
      dto?.control,
      dto?.status,
      dto?.evidence ?? {},
    );
  }

  @Get("compliance")
  complianceEvidence(@Query() query: any) {
    return this.compliance.findAll(query);
  }

  @Get("compliance/:executionId/package")
  evidencePackage(@Param("executionId") executionId: string) {
    return this.compliance.package(executionId);
  }

  @Post("escalations")
  openEscalation(@Body() dto: any) {
    return this.escalations.open(
      dto?.executionId,
      dto?.severity,
      dto?.reason,
    );
  }

  @Get("escalations")
  escalationsList(@Query() query: any) {
    return this.escalations.findAll(query);
  }

  @Post("escalations/:id/acknowledge")
  acknowledge(@Param("id") id: string) {
    return this.escalations.acknowledge(id);
  }

  @Post("escalations/:id/resolve")
  resolve(@Param("id") id: string) {
    return this.escalations.resolve(id);
  }

  @Get("dashboard")
  dashboard() {
    return this.governance.dashboard();
  }
}
