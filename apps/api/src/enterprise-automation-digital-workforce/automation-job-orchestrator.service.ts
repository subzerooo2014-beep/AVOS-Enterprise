import { Injectable, NotFoundException } from "@nestjs/common";
import { AutomationApprovalService } from "./automation-approval.service";
import { AutomationRegistryService } from "./automation-registry.service";
import { DigitalWorkerRegistryService } from "./digital-worker-registry.service";
import type {
  AutomationExecutionRecord,
  AutomationJobRecord,
} from "./enterprise-automation-digital-workforce.types";

@Injectable()
export class AutomationJobOrchestratorService {
  private readonly jobs = new Map<string, AutomationJobRecord>();
  private readonly executions: AutomationExecutionRecord[] = [];

  constructor(
    private readonly automations: AutomationRegistryService,
    private readonly workers: DigitalWorkerRegistryService,
    private readonly approvals: AutomationApprovalService,
  ) {}

  queue(
    automationId: string,
    priority: number,
    payload: Record<string, unknown> = {},
    workerId?: string,
    approver = "system",
  ): AutomationJobRecord {
    const automation = this.automations.get(automationId);

    if (!automation.enabled) {
      throw new Error(`Automation '${automationId}' is disabled.`);
    }

    if (workerId) {
      const worker = this.workers.get(workerId);

      if (
        worker.status !== "ACTIVE" ||
        !worker.allowedAutomations.includes(automationId)
      ) {
        throw new Error(
          `Digital worker '${workerId}' is not allowed to run '${automationId}'.`,
        );
      }
    }

    const now = new Date().toISOString();
    const job: AutomationJobRecord = {
      id: `automation-job-${Date.now()}-${Math.random()
        .toString(36)
        .slice(2, 10)}`,
      automationId,
      workerId,
      status: automation.requiresApproval
        ? "WAITING_APPROVAL"
        : "QUEUED",
      priority,
      payload: { ...payload },
      currentStep: automation.steps[0],
      createdAt: now,
      updatedAt: now,
    };

    this.jobs.set(job.id, job);

    if (automation.requiresApproval) {
      this.approvals.request(job.id, approver);
    }

    return this.cloneJob(job);
  }

  start(id: string, workerId: string): AutomationJobRecord {
    const job = this.requireJob(id);
    const automation = this.automations.get(job.automationId);
    const worker = this.workers.get(workerId);

    if (job.status === "WAITING_APPROVAL") {
      const approved = this.approvals
        .byJob(job.id)
        .some((approval) => approval.status === "APPROVED");

      if (!approved) {
        throw new Error(`Automation job '${id}' is not approved.`);
      }
    }

    if (
      worker.status !== "ACTIVE" ||
      !worker.allowedAutomations.includes(automation.id)
    ) {
      throw new Error(
        `Digital worker '${workerId}' is not allowed to run '${automation.id}'.`,
      );
    }

    job.workerId = workerId;
    job.status = "RUNNING";
    job.updatedAt = new Date().toISOString();
    return this.cloneJob(job);
  }

  advance(id: string): AutomationJobRecord {
    const job = this.requireJob(id);

    if (!job.workerId) {
      throw new Error(`Automation job '${id}' has no assigned worker.`);
    }

    const automation = this.automations.get(job.automationId);
    const currentIndex = job.currentStep
      ? automation.steps.indexOf(job.currentStep)
      : -1;
    const step = job.currentStep ?? automation.steps[0] ?? "complete";
    const startedAt = new Date();

    const execution: AutomationExecutionRecord = {
      id: `automation-execution-${Date.now()}-${Math.random()
        .toString(36)
        .slice(2, 10)}`,
      jobId: job.id,
      workerId: job.workerId,
      step,
      status: "COMPLETED",
      startedAt: startedAt.toISOString(),
      completedAt: new Date().toISOString(),
      durationMs: Date.now() - startedAt.getTime(),
    };

    this.executions.unshift(execution);

    const nextStep = automation.steps[currentIndex + 1];

    if (!nextStep) {
      job.status = "COMPLETED";
      job.currentStep = undefined;
      job.completedAt = new Date().toISOString();
    } else {
      job.status = "RUNNING";
      job.currentStep = nextStep;
    }

    job.updatedAt = new Date().toISOString();
    return this.cloneJob(job);
  }

  fail(id: string, error: string): AutomationJobRecord {
    const job = this.requireJob(id);
    job.status = "FAILED";
    job.error = error;
    job.updatedAt = new Date().toISOString();
    return this.cloneJob(job);
  }

  listJobs(): AutomationJobRecord[] {
    return Array.from(this.jobs.values())
      .map((job) => this.cloneJob(job))
      .sort((a, b) => b.priority - a.priority);
  }

  listExecutions(): AutomationExecutionRecord[] {
    return this.executions.map((execution) => ({ ...execution }));
  }

  jobCount(): number {
    return this.jobs.size;
  }

  executionCount(): number {
    return this.executions.length;
  }

  private requireJob(id: string): AutomationJobRecord {
    const job = this.jobs.get(id);

    if (!job) {
      throw new NotFoundException(`Automation job '${id}' was not found.`);
    }

    return job;
  }

  private cloneJob(job: AutomationJobRecord): AutomationJobRecord {
    return {
      ...job,
      payload: { ...job.payload },
    };
  }
}
