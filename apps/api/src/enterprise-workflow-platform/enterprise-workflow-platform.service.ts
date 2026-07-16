import { Injectable } from "@nestjs/common";
import { ApprovalGateService } from "./approval-gate.service";
import { WorkflowDefinitionRegistryService } from "./workflow-definition-registry.service";
import { WorkflowMetricsService } from "./workflow-metrics.service";
import { WorkflowStateStoreService } from "./workflow-state-store.service";
import { WorkflowTimeoutManagerService } from "./workflow-timeout-manager.service";

@Injectable()
export class EnterpriseWorkflowPlatformService {
  constructor(
    private readonly definitions: WorkflowDefinitionRegistryService,
    private readonly store: WorkflowStateStoreService,
    private readonly approvals: ApprovalGateService,
    private readonly timeouts: WorkflowTimeoutManagerService,
    private readonly metrics: WorkflowMetricsService,
  ) {}

  health() {
    return {
      success: true,
      system: "AVOS Enterprise Workflow Platform",
      version: "1.0.0",
      status: "READY",
      metrics: this.metrics.snapshot(),
      components: {
        workflowEngine: "READY",
        sagaCoordinator: "READY",
        compensationEngine: "READY",
        stateStore: "READY",
        approvalGates: "READY",
        timeoutManager: "READY",
        replayEngine: "READY",
        observability: "READY",
        versioning: "READY",
        longRunningTransactions: "READY",
      },
    };
  }

  diagnostics() {
    return {
      success: true,
      health: this.health(),
      definitions: this.definitions.list(),
      executions: this.store.list(),
      approvals: this.approvals.list(),
      timeouts: this.timeouts.list(),
    };
  }
}
