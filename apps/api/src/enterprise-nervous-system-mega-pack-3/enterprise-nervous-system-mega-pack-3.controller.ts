import {
  Body,
  Controller,
  Get,
  Param,
  Post
} from "@nestjs/common";
import { EnterpriseNervousSystemMegaPack3Service } from "./enterprise-nervous-system-mega-pack-3.service";
import { NervousWorkflowRegistryService } from "./registry/nervous-workflow-registry.service";
import { NervousWorkflowTriggerService } from "./triggers/nervous-workflow-trigger.service";
import { NervousWorkflowRuntimeService } from "./runtime/nervous-workflow-runtime.service";
import { NervousWorkflowStateService } from "./state/nervous-workflow-state.service";
import { NervousSagaService } from "./saga/nervous-saga.service";
import { NervousWorkflowApprovalService } from "./approval/nervous-workflow-approval.service";
import { NervousWorkflowHealthService } from "./health/nervous-workflow-health.service";
import { NervousWorkflowAuditService } from "./observability/nervous-workflow-audit.service";
import {
  NervousWorkflowDefinition,
  NervousWorkflowTrigger
} from "./enterprise-nervous-system-mega-pack-3.types";

@Controller("enterprise-nervous-system-v3")
export class EnterpriseNervousSystemMegaPack3Controller {
  constructor(
    private readonly pack: EnterpriseNervousSystemMegaPack3Service,
    private readonly workflows: NervousWorkflowRegistryService,
    private readonly triggers: NervousWorkflowTriggerService,
    private readonly runtime: NervousWorkflowRuntimeService,
    private readonly states: NervousWorkflowStateService,
    private readonly sagas: NervousSagaService,
    private readonly approvals: NervousWorkflowApprovalService,
    private readonly health: NervousWorkflowHealthService,
    private readonly audit: NervousWorkflowAuditService
  ) {}

  @Get("status")
  status() {
    return this.pack.status();
  }

  @Get("verification")
  verification() {
    return this.pack.verification();
  }

  @Get("workflows")
  workflowList() {
    return {
      summary: this.workflows.summary(),
      items: this.workflows.list()
    };
  }

  @Post("workflows")
  registerWorkflow(
    @Body()
    body: {
      workflow: Omit<
        NervousWorkflowDefinition,
        "createdAt" | "updatedAt"
      >;
      actorIdentityId: string;
      correlationId: string;
    }
  ) {
    return this.workflows.register(
      body.workflow,
      {
        actorIdentityId: body.actorIdentityId,
        correlationId: body.correlationId
      }
    );
  }

  @Get("triggers")
  triggerList() {
    return {
      summary: this.triggers.summary(),
      items: this.triggers.list()
    };
  }

  @Post("triggers")
  registerTrigger(
    @Body()
    body: {
      trigger: Omit<
        NervousWorkflowTrigger,
        "createdAt" | "updatedAt"
      >;
      actorIdentityId: string;
      correlationId: string;
    }
  ) {
    return this.triggers.register(
      body.trigger,
      {
        actorIdentityId: body.actorIdentityId,
        correlationId: body.correlationId
      }
    );
  }

  @Post("executions/start")
  startExecution(
    @Body()
    body: {
      workflowId: string;
      triggerId?: string;
      context: Record<string, unknown>;
      correlationId: string;
      traceId?: string;
      startedByIdentityId: string;
    }
  ) {
    return this.runtime.start(body);
  }

  @Post("executions/start-from-signal")
  startFromSignal(
    @Body()
    body: {
      topic: string;
      signalDefinitionId?: string;
      payload: unknown;
      context: Record<string, unknown>;
      correlationId: string;
      traceId?: string;
      startedByIdentityId: string;
    }
  ) {
    return this.runtime.startFromSignal(body);
  }

  @Post("executions/:executionId/approvals/:gateId/resume")
  resumeExecution(
    @Param("executionId") executionId: string,
    @Param("gateId") gateId: string,
    @Body()
    body: {
      actorIdentityId: string;
    }
  ) {
    return this.runtime.resumeAfterApproval({
      executionId,
      gateId,
      actorIdentityId: body.actorIdentityId
    });
  }

  @Get("executions")
  executionList() {
    return {
      summary: this.runtime.summary(),
      items: this.runtime.list()
    };
  }

  @Post("approvals/:id/decide")
  decideApproval(
    @Param("id") id: string,
    @Body()
    body: {
      identityId: string;
      approve: boolean;
      note?: string;
      correlationId: string;
    }
  ) {
    return this.approvals.decide({
      gateId: id,
      ...body
    });
  }

  @Get("approvals")
  approvalList() {
    return {
      summary: this.approvals.summary(),
      items: this.approvals.list()
    };
  }

  @Get("state-transitions")
  stateTransitionList() {
    return {
      summary: this.states.summary(),
      items: this.states.list()
    };
  }

  @Get("sagas")
  sagaList() {
    return {
      summary: this.sagas.summary(),
      items: this.sagas.list()
    };
  }

  @Post("health/calculate")
  calculateHealth(
    @Body()
    body: {
      actorIdentityId: string;
      correlationId: string;
    }
  ) {
    return this.health.calculate(body);
  }

  @Get("health")
  healthList() {
    return {
      summary: this.health.summary(),
      items: this.health.list()
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
