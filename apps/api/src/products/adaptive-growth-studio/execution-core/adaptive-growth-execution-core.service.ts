import { Injectable } from "@nestjs/common";
import { AdaptiveGrowthActionRegistryService } from "./adaptive-growth-action-registry.service";
import { AdaptiveGrowthActionService } from "./adaptive-growth-action.service";
import { AgsCreateActionInput } from "./adaptive-growth-execution.contracts";
import { AdaptiveGrowthExecutionEngineService } from "./adaptive-growth-execution-engine.service";
import { AdaptiveGrowthExecutionHistoryService } from "./adaptive-growth-execution-history.service";
import { AdaptiveGrowthExecutionStateMachineService } from "./adaptive-growth-execution-state-machine.service";
import { AdaptiveGrowthExecutionStoreService } from "./adaptive-growth-execution-store.service";
import { AdaptiveGrowthRollbackEngineService } from "./adaptive-growth-rollback-engine.service";

@Injectable()
export class AdaptiveGrowthExecutionCoreService {
  constructor(
    private readonly registry:
      AdaptiveGrowthActionRegistryService,
    private readonly actions:
      AdaptiveGrowthActionService,
    private readonly executions:
      AdaptiveGrowthExecutionEngineService,
    private readonly rollback:
      AdaptiveGrowthRollbackEngineService,
    private readonly history:
      AdaptiveGrowthExecutionHistoryService,
    private readonly stateMachine:
      AdaptiveGrowthExecutionStateMachineService,
    private readonly store:
      AdaptiveGrowthExecutionStoreService,
  ) {}

  status() {
    const storage = this.store.status();

    return {
      name:
        "AVOS Adaptive Growth Studio Execution Core",
      version: "AGS-MP2A-1.0.0",
      status: "operational",
      foundationFirst: true,
      capabilityFirst: true,
      blueprintDriven: true,
      humanFinalAuthority: true,
      approvalGovernance:
        "ready-for-mega-pack-2b",
      components: {
        centralExecutionEngine: true,
        executionStateManagement: true,
        executionHistory: true,
        rollbackEngine: true,
        actionRegistry: true,
        executionApi: true,
      },
      storage,
      registry: this.registry.status(),
      history: this.history.status(),
      stateMachine:
        this.stateMachine.describe(),
    };
  }

  createAction(input: AgsCreateActionInput) {
    return this.actions.create(input);
  }

  validateAction(input: AgsCreateActionInput) {
    return this.actions.validate(input);
  }

  listActions() {
    return this.actions.list();
  }

  getAction(id: string) {
    return this.actions.get(id);
  }

  listDefinitions() {
    return this.registry.list();
  }

  listExecutions() {
    return this.executions.list();
  }

  getExecution(id: string) {
    return this.executions.get(id);
  }

  listHistory(actionId?: string) {
    return this.history.list(actionId);
  }

  start(actionId: string, actor?: string) {
    return this.executions.start(
      actionId,
      actor,
    );
  }

  cancel(
    actionId: string,
    actor?: string,
    reason?: string,
  ) {
    return this.executions.cancel(
      actionId,
      actor,
      reason,
    );
  }

  retry(actionId: string, actor?: string) {
    return this.executions.retry(
      actionId,
      actor,
    );
  }

  rollbackAction(
    actionId: string,
    actor?: string,
    reason?: string,
  ) {
    return this.rollback.rollback(
      actionId,
      actor,
      reason,
    );
  }
}