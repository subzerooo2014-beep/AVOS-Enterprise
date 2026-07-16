import {
  Body,
  Controller,
  Get,
  Param,
  Post
} from "@nestjs/common";
import { FoundationCompletionPack11Service } from "./foundation-completion-pack-11.service";
import { ArchitectureEvolutionRequestService } from "./requests/architecture-evolution-request.service";
import { ArchitectureEvolutionAnalysisService } from "./analysis/architecture-evolution-analysis.service";
import { ArchitectureEvolutionPlanService } from "./plans/architecture-evolution-plan.service";
import { EvolutionApprovalService } from "./approvals/evolution-approval.service";
import { ArchitectureEvolutionExecutionService } from "./execution/architecture-evolution-execution.service";
import { ArchitectureEvolutionRollbackService } from "./rollback/architecture-evolution-rollback.service";
import { EvolutionHistoryService } from "./history/evolution-history.service";
import { EvolutionAuditService } from "./observability/evolution-audit.service";
import {
  ArchitectureEvolutionChange,
  EvolutionPlanStep
} from "./foundation-pack-11.types";

@Controller("foundation-completion-v11")
export class FoundationCompletionPack11Controller {
  constructor(
    private readonly pack: FoundationCompletionPack11Service,
    private readonly requests: ArchitectureEvolutionRequestService,
    private readonly analyses: ArchitectureEvolutionAnalysisService,
    private readonly plans: ArchitectureEvolutionPlanService,
    private readonly approvals: EvolutionApprovalService,
    private readonly executions: ArchitectureEvolutionExecutionService,
    private readonly rollback: ArchitectureEvolutionRollbackService,
    private readonly history: EvolutionHistoryService,
    private readonly audit: EvolutionAuditService
  ) {}

  @Get("status")
  status() {
    return this.pack.status();
  }

  @Get("verification")
  verification() {
    return this.pack.verification();
  }

  @Get("requests")
  requestList() {
    return {
      summary: this.requests.summary(),
      items: this.requests.list()
    };
  }

  @Get("requests/:id")
  request(@Param("id") id: string) {
    return this.requests.get(id);
  }

  @Post("requests")
  createRequest(
    @Body()
    body: {
      title: string;
      description: string;
      blueprintId: string;
      requestedByIdentityId: string;
      correlationId: string;
      objective: string;
      changes: ArchitectureEvolutionChange[];
      businessJustification: string;
      architectureJustification: string;
      constraints: string[];
    }
  ) {
    return this.requests.create(body);
  }

  @Post("requests/:id/submit")
  submitRequest(
    @Param("id") id: string,
    @Body()
    body: {
      actorIdentityId: string;
    }
  ) {
    return this.requests.updateStatus(
      id,
      "submitted",
      body.actorIdentityId
    );
  }

  @Get("analyses")
  analysisList() {
    return {
      summary: this.analyses.summary(),
      items: this.analyses.list()
    };
  }

  @Post("analyses")
  analyzeRequest(
    @Body()
    body: {
      requestId: string;
      analyzedByIdentityId: string;
    }
  ) {
    return this.analyses.analyze(body);
  }

  @Get("plans")
  planList() {
    return {
      summary: this.plans.summary(),
      items: this.plans.list()
    };
  }

  @Get("plans/:id")
  plan(@Param("id") id: string) {
    return this.executions.snapshot(id);
  }

  @Post("plans")
  createPlan(
    @Body()
    body: {
      requestId: string;
      analysisId: string;
      name: string;
      description: string;
      steps: Omit<EvolutionPlanStep, "status">[];
      createdByIdentityId: string;
    }
  ) {
    return this.plans.create(body);
  }

  @Get("approvals")
  approvalList() {
    return {
      summary: this.approvals.summary(),
      items: this.approvals.list()
    };
  }

  @Post("approvals")
  requestApproval(
    @Body()
    body: {
      requestId: string;
      planId: string;
      requestedByIdentityId: string;
      requiredRole: string;
      reason: string;
    }
  ) {
    return this.approvals.request(body);
  }

  @Post("approvals/:id/decide")
  decideApproval(
    @Param("id") id: string,
    @Body()
    body: {
      approved: boolean;
      approverIdentityId: string;
      decisionNote: string;
    }
  ) {
    return this.approvals.decide(id, body);
  }

  @Post("plans/:id/start")
  startPlan(
    @Param("id") id: string,
    @Body()
    body: {
      actorIdentityId: string;
    }
  ) {
    return this.executions.start(
      id,
      body.actorIdentityId
    );
  }

  @Post("plans/:planId/steps/:stepId/complete")
  completeStep(
    @Param("planId") planId: string,
    @Param("stepId") stepId: string,
    @Body()
    body: {
      success: boolean;
      actorIdentityId: string;
      output?: Record<string, unknown>;
      error?: string;
    }
  ) {
    return this.executions.completeStep(
      planId,
      stepId,
      body
    );
  }

  @Post("plans/:id/advance")
  advancePlan(
    @Param("id") id: string,
    @Body()
    body: {
      actorIdentityId: string;
    }
  ) {
    return this.executions.advance(
      id,
      body.actorIdentityId
    );
  }

  @Post("plans/:id/rollback")
  rollbackPlan(
    @Param("id") id: string,
    @Body()
    body: {
      reason: string;
      executedByIdentityId: string;
    }
  ) {
    return this.rollback.rollback({
      planId: id,
      ...body
    });
  }

  @Get("history/request/:requestId")
  requestHistory(
    @Param("requestId") requestId: string
  ) {
    return {
      requestId,
      items: this.history.byRequest(requestId)
    };
  }

  @Get("history/blueprint/:blueprintId")
  blueprintHistory(
    @Param("blueprintId") blueprintId: string
  ) {
    return {
      blueprintId,
      items: this.history.byBlueprint(blueprintId)
    };
  }

  @Get("audit")
  auditList() {
    return {
      summary: this.audit.summary(),
      items: this.audit.list()
    };
  }
}
