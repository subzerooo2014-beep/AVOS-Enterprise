import {
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import {
  AgsAction,
  AgsExecutionRecord,
} from "./adaptive-growth-execution.contracts";

@Injectable()
export class AdaptiveGrowthExecutionStoreService {
  private readonly actions =
    new Map<string, AgsAction>();

  private readonly executions =
    new Map<string, AgsExecutionRecord>();

  saveAction(action: AgsAction): AgsAction {
    this.actions.set(action.id, {
      ...action,
    });

    return action;
  }

  getAction(id: string): AgsAction {
    const action = this.actions.get(id);

    if (!action) {
      throw new NotFoundException(
        `Action not found: ${id}`,
      );
    }

    return action;
  }

  listActions(): AgsAction[] {
    return [...this.actions.values()].sort(
      (a, b) =>
        b.createdAt.localeCompare(a.createdAt),
    );
  }

  saveExecution(
    execution: AgsExecutionRecord,
  ): AgsExecutionRecord {
    this.executions.set(execution.id, {
      ...execution,
    });

    return execution;
  }

  getExecution(id: string): AgsExecutionRecord {
    const execution = this.executions.get(id);

    if (!execution) {
      throw new NotFoundException(
        `Execution not found: ${id}`,
      );
    }

    return execution;
  }

  listExecutions(): AgsExecutionRecord[] {
    return [...this.executions.values()].sort(
      (a, b) =>
        b.createdAt.localeCompare(a.createdAt),
    );
  }

  latestExecutionForAction(
    actionId: string,
  ): AgsExecutionRecord | undefined {
    return this.listExecutions().find(
      (item) => item.actionId === actionId,
    );
  }

  status() {
    return {
      actions: this.actions.size,
      executions: this.executions.size,
      persistenceMode: "in-memory",
      durablePersistencePlanned: true,
    };
  }
}