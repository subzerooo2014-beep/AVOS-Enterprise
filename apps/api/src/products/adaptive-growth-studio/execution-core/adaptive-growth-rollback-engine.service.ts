import {
  BadRequestException,
  Injectable,
} from "@nestjs/common";
import { AdaptiveGrowthActionDispatcherService } from "./adaptive-growth-action-dispatcher.service";
import { AdaptiveGrowthActionService } from "./adaptive-growth-action.service";
import { AdaptiveGrowthExecutionHistoryService } from "./adaptive-growth-execution-history.service";
import { AdaptiveGrowthExecutionStoreService } from "./adaptive-growth-execution-store.service";

@Injectable()
export class AdaptiveGrowthRollbackEngineService {
  constructor(
    private readonly actions:
      AdaptiveGrowthActionService,
    private readonly dispatcher:
      AdaptiveGrowthActionDispatcherService,
    private readonly history:
      AdaptiveGrowthExecutionHistoryService,
    private readonly store:
      AdaptiveGrowthExecutionStoreService,
  ) {}

  async rollback(
    actionId: string,
    actor = "human:khalifa",
    reason =
      "Rollback approved by human authority.",
  ) {
    const action = this.actions.get(actionId);

    if (action.state !== "completed") {
      throw new BadRequestException(
        "Only completed actions may be rolled back.",
      );
    }

    if (!action.supportsRollback) {
      throw new BadRequestException(
        "Action does not support rollback.",
      );
    }

    const execution =
      this.store.latestExecutionForAction(
        action.id,
      );

    if (!execution) {
      throw new BadRequestException(
        "Execution record was not found.",
      );
    }

    this.history.record({
      actionId: action.id,
      executionId: execution.id,
      eventType: "rollback-started",
      fromState: "completed",
      toState: "completed",
      actor,
      reason,
      evidence: {
        humanFinalAuthority: true,
      },
    });

    const rollbackResult =
      await this.dispatcher.rollback(action);

    const updatedAction =
      this.actions.transition(
        action.id,
        "rolled-back",
        actor,
        reason,
      );

    const now = new Date().toISOString();

    const updatedExecution =
      this.store.saveExecution({
        ...execution,
        state: "rolled-back",
        rolledBackAt: now,
        rollbackResult,
        updatedAt: now,
      });

    this.history.record({
      actionId: action.id,
      executionId: execution.id,
      eventType: "rollback-completed",
      fromState: "completed",
      toState: "rolled-back",
      actor,
      reason,
      evidence: rollbackResult,
    });

    return {
      action: updatedAction,
      execution: updatedExecution,
      rollbackResult,
    };
  }
}