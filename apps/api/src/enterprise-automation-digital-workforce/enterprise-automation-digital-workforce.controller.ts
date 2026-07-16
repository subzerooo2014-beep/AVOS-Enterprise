import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { AutomationAnalyticsService } from "./automation-analytics.service";
import { AutomationApprovalService } from "./automation-approval.service";
import { AutomationJobOrchestratorService } from "./automation-job-orchestrator.service";
import { AutomationRegistryService } from "./automation-registry.service";
import { DigitalWorkerRegistryService } from "./digital-worker-registry.service";
import type {
  AutomationDefinitionRecord,
  DigitalWorkerRecord,
} from "./enterprise-automation-digital-workforce.types";

@Controller("enterprise-automation-digital-workforce")
export class EnterpriseAutomationDigitalWorkforceController {
  constructor(
    private readonly analytics: AutomationAnalyticsService,
    private readonly workers: DigitalWorkerRegistryService,
    private readonly automations: AutomationRegistryService,
    private readonly approvals: AutomationApprovalService,
    private readonly jobs: AutomationJobOrchestratorService,
  ) {}

  @Get("status")
  status() {
    return this.analytics.health();
  }

  @Get("diagnostics")
  diagnostics() {
    return this.analytics.diagnostics();
  }

  @Post("workers")
  registerWorker(
    @Body() body: Omit<DigitalWorkerRecord, "createdAt" | "updatedAt">,
  ) {
    return { success: true, worker: this.workers.register(body) };
  }

  @Post("automations")
  registerAutomation(
    @Body()
    body: Omit<AutomationDefinitionRecord, "createdAt" | "updatedAt">,
  ) {
    return { success: true, automation: this.automations.register(body) };
  }

  @Post("jobs")
  queueJob(
    @Body()
    body: {
      automationId: string;
      priority: number;
      payload?: Record<string, unknown>;
      workerId?: string;
      approver?: string;
    },
  ) {
    return {
      success: true,
      job: this.jobs.queue(
        body.automationId,
        body.priority,
        body.payload,
        body.workerId,
        body.approver,
      ),
    };
  }

  @Post("approvals/:id/approve")
  approve(
    @Param("id") id: string,
    @Body() body: { reason?: string },
  ) {
    return { success: true, approval: this.approvals.approve(id, body.reason) };
  }

  @Post("approvals/:id/reject")
  reject(
    @Param("id") id: string,
    @Body() body: { reason?: string },
  ) {
    return { success: true, approval: this.approvals.reject(id, body.reason) };
  }

  @Post("jobs/:id/start")
  startJob(
    @Param("id") id: string,
    @Body() body: { workerId: string },
  ) {
    return { success: true, job: this.jobs.start(id, body.workerId) };
  }

  @Post("jobs/:id/advance")
  advanceJob(@Param("id") id: string) {
    return { success: true, job: this.jobs.advance(id) };
  }

  @Post("jobs/:id/fail")
  failJob(
    @Param("id") id: string,
    @Body() body: { error: string },
  ) {
    return { success: true, job: this.jobs.fail(id, body.error) };
  }
}
