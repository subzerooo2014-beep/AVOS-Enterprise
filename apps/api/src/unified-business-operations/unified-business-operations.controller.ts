import { Body, Controller, Get, Param, Patch, Post } from "@nestjs/common";
import { UnifiedBusinessOperationsService } from "./unified-business-operations.service";
import { WorkflowOrchestratorService } from "./workflow-orchestrator.service";
import { EnterpriseAutomationService } from "./enterprise-automation.service";
import { OperationsCommandCenterService } from "./operations-command-center.service";
import { AiOperationsService } from "./ai-operations.service";
import {
  AiOperationInsight,
  AutomationRule,
  BusinessEvent,
  IntegrationLink,
  OperationAlert,
  WorkflowDefinition,
  WorkflowStatus,
} from "./unified-business-operations.types";

@Controller("unified-business-operations")
export class UnifiedBusinessOperationsController {
  constructor(
    private readonly operations: UnifiedBusinessOperationsService,
    private readonly workflows: WorkflowOrchestratorService,
    private readonly automation: EnterpriseAutomationService,
    private readonly commandCenter: OperationsCommandCenterService,
    private readonly ai: AiOperationsService,
  ) {}

  @Get("capabilities")
  capabilities() {
    return this.operations.capabilities();
  }

  @Post("workflows/templates/install")
  installTemplates(@Body() body: { tenantId: string }) {
    return this.workflows.installTemplates(body.tenantId);
  }

  @Post("workflows")
  createWorkflow(
    @Body()
    input: Omit<WorkflowDefinition, "id" | "createdAt" | "updatedAt">,
  ) {
    return this.workflows.createDefinition(input);
  }

  @Post("workflows/:id/start")
  startWorkflow(
    @Param("id") id: string,
    @Body()
    body: {
      tenantId: string;
      referenceType: string;
      referenceId: string;
      context: Record<string, unknown>;
    },
  ) {
    return this.workflows.start(
      id,
      body.tenantId,
      body.referenceType,
      body.referenceId,
      body.context,
    );
  }

  @Patch("executions/:id/advance")
  advanceWorkflow(
    @Param("id") id: string,
    @Body() body: { message: string },
  ) {
    return this.workflows.advance(id, body.message);
  }

  @Patch("executions/:id/approve")
  approveWorkflow(@Param("id") id: string) {
    return this.workflows.approve(id);
  }

  @Patch("executions/:id/status")
  updateWorkflowStatus(
    @Param("id") id: string,
    @Body() body: { status: WorkflowStatus },
  ) {
    return this.workflows.updateStatus(id, body.status);
  }

  @Post("automation/rules")
  createAutomationRule(
    @Body()
    input: Omit<AutomationRule, "id" | "createdAt" | "updatedAt">,
  ) {
    return this.automation.createRule(input);
  }

  @Post("integrations")
  createIntegration(
    @Body()
    input: Omit<IntegrationLink, "id" | "createdAt" | "updatedAt">,
  ) {
    return this.automation.createIntegration(input);
  }

  @Post("events")
  emitEvent(
    @Body()
    input: Omit<BusinessEvent, "id" | "createdAt">,
  ) {
    return this.automation.emit(input);
  }

  @Post("alerts")
  createAlert(
    @Body()
    input: Omit<
      OperationAlert,
      "id" | "resolved" | "createdAt" | "resolvedAt"
    >,
  ) {
    return this.commandCenter.createAlert(input);
  }

  @Patch("alerts/:id/resolve")
  resolveAlert(@Param("id") id: string) {
    return this.commandCenter.resolveAlert(id);
  }

  @Post("ai/insights")
  createAiInsight(
    @Body()
    body: {
      tenantId: string;
      category: AiOperationInsight["category"];
      title: string;
      recommendation: string;
      confidence: number;
    },
  ) {
    return this.ai.generate(
      body.tenantId,
      body.category,
      body.title,
      body.recommendation,
      body.confidence,
    );
  }

  @Get("ai/predictive")
  predictiveSnapshot() {
    return this.ai.predictiveSnapshot();
  }

  @Get("command-center")
  commandCenterDashboard() {
    return this.commandCenter.dashboard();
  }

  @Get("dashboard")
  dashboard() {
    return this.operations.dashboard();
  }
}