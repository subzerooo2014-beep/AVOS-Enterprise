import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { ApprovalGateService } from "./approval-gate.service";
import { CompensationEngineService } from "./compensation-engine.service";
import { EnterpriseWorkflowPlatformService } from "./enterprise-workflow-platform.service";
import { SagaCoordinatorService } from "./saga-coordinator.service";
import { WorkflowDefinitionRegistryService } from "./workflow-definition-registry.service";
import { WorkflowReplayService } from "./workflow-replay.service";
import { WorkflowStateStoreService } from "./workflow-state-store.service";
import type { WorkflowDefinition } from "./enterprise-workflow.types";

@Controller("enterprise-workflow-platform")
export class EnterpriseWorkflowPlatformController {
  constructor(
    private readonly platform: EnterpriseWorkflowPlatformService,
    private readonly definitions: WorkflowDefinitionRegistryService,
    private readonly saga: SagaCoordinatorService,
    private readonly store: WorkflowStateStoreService,
    private readonly approvals: ApprovalGateService,
    private readonly compensation: CompensationEngineService,
    private readonly replay: WorkflowReplayService,
  ) {}

  @Get("status")
  status() {
    return this.platform.health();
  }

  @Get("diagnostics")
  diagnostics() {
    return this.platform.diagnostics();
  }

  @Post("definitions")
  registerDefinition(
    @Body() body: Omit<WorkflowDefinition, "createdAt" | "updatedAt">,
  ) {
    return {
      success: true,
      definition: this.definitions.register(body),
    };
  }

  @Get("definitions")
  listDefinitions() {
    return { success: true, items: this.definitions.list() };
  }

  @Post("executions/start")
  start(
    @Body()
    body: {
      definitionId: string;
      context?: Record<string, unknown>;
      correlationId?: string;
    },
  ) {
    return {
      success: true,
      execution: this.saga.start(
        body.definitionId,
        body.context ?? {},
        body.correlationId,
      ),
    };
  }

  @Post("executions/:id/advance")
  advance(@Param("id") id: string) {
    return { success: true, execution: this.saga.advance(id) };
  }

  @Post("executions/:id/fail")
  fail(@Param("id") id: string, @Body() body: { reason: string }) {
    return { success: true, execution: this.saga.fail(id, body.reason) };
  }

  @Post("executions/:id/compensate")
  compensate(@Param("id") id: string) {
    return { success: true, execution: this.compensation.compensate(id) };
  }

  @Get("executions")
  executions() {
    return { success: true, items: this.store.list() };
  }

  @Get("executions/:id/replay")
  replayExecution(@Param("id") id: string) {
    return this.replay.replay(id);
  }

  @Post("approvals/:id/approve")
  approve(
    @Param("id") id: string,
    @Body() body: { decidedBy: string; reason?: string },
  ) {
    return {
      success: true,
      approval: this.approvals.approve(id, body.decidedBy, body.reason),
    };
  }

  @Post("approvals/:id/reject")
  reject(
    @Param("id") id: string,
    @Body() body: { decidedBy: string; reason?: string },
  ) {
    return {
      success: true,
      approval: this.approvals.reject(id, body.decidedBy, body.reason),
    };
  }
}
