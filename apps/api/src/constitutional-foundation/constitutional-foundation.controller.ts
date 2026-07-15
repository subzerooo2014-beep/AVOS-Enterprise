import { Body, Controller, Get, Param, Patch, Post } from "@nestjs/common";
import { ConstitutionalFoundationService } from "./constitutional-foundation.service";
import {
  ConstitutionKey,
  ConstitutionalAuditRecord,
  ConstitutionalEvaluationRequest,
} from "./constitutional-foundation.types";

@Controller("constitutional-foundation")
export class ConstitutionalFoundationController {
  constructor(
    private readonly constitution: ConstitutionalFoundationService,
  ) {}

  @Get("constitutions")
  constitutions() {
    return this.constitution.constitutions();
  }

  @Get("constitutions/:key")
  constitutionByKey(@Param("key") key: ConstitutionKey) {
    return this.constitution.constitution(key);
  }

  @Post("evaluations")
  evaluate(@Body() request: ConstitutionalEvaluationRequest) {
    return this.constitution.evaluate(request);
  }

  @Post("approvals")
  requestApproval(
    @Body()
    body: {
      evaluationId: string;
      tenantId: string;
      requestedBy: string;
      authorityRole: string;
    },
  ) {
    return this.constitution.requestApproval(
      body.evaluationId,
      body.tenantId,
      body.requestedBy,
      body.authorityRole,
    );
  }

  @Patch("approvals/:id/decision")
  decideApproval(
    @Param("id") id: string,
    @Body()
    body: {
      status: "APPROVED" | "REJECTED";
      reason?: string;
    },
  ) {
    return this.constitution.decideApproval(
      id,
      body.status,
      body.reason,
    );
  }

  @Post("audit")
  trackAudit(
    @Body()
    input: Omit<ConstitutionalAuditRecord, "id" | "createdAt">,
  ) {
    return this.constitution.trackAudit(input);
  }

  @Get("dashboard")
  dashboard() {
    return this.constitution.dashboard();
  }
}