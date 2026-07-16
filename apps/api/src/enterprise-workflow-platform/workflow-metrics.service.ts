import { Injectable } from "@nestjs/common";
import { ApprovalGateService } from "./approval-gate.service";
import { WorkflowDefinitionRegistryService } from "./workflow-definition-registry.service";
import { WorkflowEventsService } from "./workflow-events.service";
import { WorkflowStateStoreService } from "./workflow-state-store.service";
import type { WorkflowMetrics } from "./enterprise-workflow.types";

@Injectable()
export class WorkflowMetricsService {
  constructor(
    private readonly definitions: WorkflowDefinitionRegistryService,
    private readonly store: WorkflowStateStoreService,
    private readonly approvals: ApprovalGateService,
    private readonly events: WorkflowEventsService,
  ) {}

  snapshot(): WorkflowMetrics {
    const executions = this.store.list();

    return {
      definitions: this.definitions.count(),
      executions: executions.length,
      running: executions.filter((item) => item.status === "RUNNING").length,
      completed: executions.filter((item) => item.status === "COMPLETED").length,
      failed: executions.filter((item) => item.status === "FAILED").length,
      compensated: executions.filter((item) => item.status === "COMPENSATED").length,
      timedOut: executions.filter((item) => item.status === "TIMED_OUT").length,
      pendingApprovals: this.approvals.pendingCount(),
      events: this.events.count(),
    };
  }
}
