import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
} from "@nestjs/common";
import { AdaptiveGrowthApprovalGovernanceService } from "./adaptive-growth-approval-governance.service";
import { AgsHumanDecisionInput } from "./adaptive-growth-approval.contracts";

@Controller(
  "avos/products/adaptive-growth-studio/governance",
)
export class AdaptiveGrowthApprovalGovernanceController {
  constructor(
    private readonly governance:
      AdaptiveGrowthApprovalGovernanceService,
  ) {}

  @Get("status")
  status() {
    return this.governance.status();
  }

  @Get("policies")
  policies() {
    return this.governance.status()
      .policies;
  }

  @Post("approval/request")
  request(
    @Body()
    input: {
      actionId: string;
      requestedBy?: string;
    },
  ) {
    return this.governance.request(
      input.actionId,
      input.requestedBy,
    );
  }

  @Post("approval/:id/assign")
  assign(
    @Param("id") id: string,
    @Body()
    input: {
      assignedTo: string;
      actor?: string;
    },
  ) {
    return this.governance.assign(
      id,
      input.assignedTo,
      input.actor,
    );
  }

  @Get("approval")
  approvals(
    @Query("status") status?: string,
  ) {
    return this.governance.listApprovals(
      status,
    );
  }

  @Get("approval/:id")
  approval(@Param("id") id: string) {
    return this.governance.getApproval(id);
  }

  @Post("approval/:id/collect-evidence")
  collectEvidence(
    @Param("id") id: string,
  ) {
    return this.governance.collectEvidence(
      id,
    );
  }

  @Post("approval/:id/evidence")
  addEvidence(
    @Param("id") id: string,
    @Body()
    input: {
      source: string;
      type: string;
      title: string;
      summary: string;
      payload?: Record<string, unknown>;
      confidence?: number;
    },
  ) {
    return this.governance.addEvidence(
      id,
      input,
    );
  }

  @Get("evidence")
  evidence(
    @Query("approvalId")
    approvalId?: string,
  ) {
    return this.governance.listEvidence(
      approvalId,
    );
  }

  @Post("decision")
  decide(
    @Body() input: AgsHumanDecisionInput,
  ) {
    return this.governance.decide(input);
  }

  @Get("decision")
  decisions() {
    return this.governance.listDecisions();
  }

  @Get("decision/:id")
  decision(@Param("id") id: string) {
    return this.governance.getDecision(id);
  }

  @Get("decision/:id/verify")
  verifyDecision(
    @Param("id") id: string,
  ) {
    return this.governance.verifyDecision(
      id,
    );
  }

  @Get("decision/:approvalId/explainability")
  explainability(
    @Param("approvalId")
    approvalId: string,
  ) {
    return this.governance.explain(
      approvalId,
    );
  }

  @Get("audit")
  audit(
    @Query("approvalId")
    approvalId?: string,
  ) {
    return this.governance.auditTrail(
      approvalId,
    );
  }
}