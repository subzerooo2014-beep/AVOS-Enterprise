import { Injectable } from "@nestjs/common";
import { AutomationApprovalService } from "./automation-approval.service";
import { AutomationJobOrchestratorService } from "./automation-job-orchestrator.service";
import { AutomationRegistryService } from "./automation-registry.service";
import { DigitalWorkerRegistryService } from "./digital-worker-registry.service";
import type {
  AutomationHealth,
  AutomationMetrics,
} from "./enterprise-automation-digital-workforce.types";

@Injectable()
export class AutomationAnalyticsService {
  constructor(
    private readonly workers: DigitalWorkerRegistryService,
    private readonly automations: AutomationRegistryService,
    private readonly approvals: AutomationApprovalService,
    private readonly jobs: AutomationJobOrchestratorService,
  ) {}

  metrics(): AutomationMetrics {
    const jobs = this.jobs.listJobs();

    return {
      workers: this.workers.count(),
      activeWorkers: this.workers.activeCount(),
      automations: this.automations.count(),
      enabledAutomations: this.automations.enabledCount(),
      jobs: jobs.length,
      queuedJobs: jobs.filter((job) => job.status === "QUEUED").length,
      runningJobs: jobs.filter((job) => job.status === "RUNNING").length,
      completedJobs: jobs.filter((job) => job.status === "COMPLETED").length,
      failedJobs: jobs.filter((job) => job.status === "FAILED").length,
      pendingApprovals: this.approvals.pendingCount(),
      executions: this.jobs.executionCount(),
    };
  }

  health(): AutomationHealth {
    const metrics = this.metrics();

    return {
      success: true,
      system: "AVOS Enterprise Automation & Digital Workforce",
      version: "1.0.0",
      status:
        metrics.failedJobs > 0 || metrics.pendingApprovals > 0
          ? "DEGRADED"
          : "READY",
      metrics,
      components: {
        digitalWorkerRegistry: "READY",
        automationRegistry: "READY",
        jobQueue: "READY",
        jobOrchestrator: "READY",
        humanApproval: "READY",
        executionTracking: "READY",
        automationAnalytics: "READY",
      },
    };
  }

  diagnostics() {
    return {
      success: true,
      health: this.health(),
      workers: this.workers.list(),
      automations: this.automations.list(),
      approvals: this.approvals.list(),
      jobs: this.jobs.listJobs(),
      executions: this.jobs.listExecutions(),
    };
  }
}
