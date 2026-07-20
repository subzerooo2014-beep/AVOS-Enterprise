import {
  BadRequestException,
  Injectable,
} from "@nestjs/common";
import { AdaptiveGrowthActionDispatcherService } from "./adaptive-growth-action-dispatcher.service";
import { AdaptiveGrowthActionService } from "./adaptive-growth-action.service";
import {
  AgsExecutionRecord,
  AgsExecutionState,
} from "./adaptive-growth-execution.contracts";
import { AdaptiveGrowthExecutionHistoryService } from "./adaptive-growth-execution-history.service";
import { AdaptiveGrowthExecutionIdService } from "./adaptive-growth-execution-id.service";
import { AdaptiveGrowthExecutionStoreService } from "./adaptive-growth-execution-store.service";

@Injectable()
export class AdaptiveGrowthExecutionEngineService {
  constructor(
    private readonly actions:
      AdaptiveGrowthActionService,
    private readonly dispatcher:
      AdaptiveGrowthActionDispatcherService,
    private readonly history:
      AdaptiveGrowthExecutionHistoryService,
    private readonly ids:
      AdaptiveGrowthExecutionIdService,
    private readonly store:
      AdaptiveGrowthExecutionStoreService,
  ) {}

  async start(
    actionId: string,
    actor = "system:ags",
  ): Promise<AgsExecutionRecord> {
    let action = this.actions.get(actionId);

    if (action.state === "pending-approval") {
      throw new BadRequestException({
        message:
          "Human approval is required before execution.",
        actionId,
        currentState: action.state,
        nextRequiredState: "approved",
        approvalGovernance:
          "Mega Pack 2B",
      });
    }

    if (
      action.state !== "approved" &&
      action.state !== "failed"
    ) {
      throw new BadRequestException(
        `Action cannot start from state ${action.state}.`,
      );
    }

    if (action.state === "failed") {
      action = this.actions.transition(
        action.id,
        "queued",
        actor,
        "Retry requested.",
      );
    } else {
      action = this.actions.transition(
        action.id,
        "queued",
        actor,
      );
    }

    action = this.actions.transition(
      action.id,
      "running",
      actor,
    );

    const now = new Date().toISOString();
    const previous =
      this.store.latestExecutionForAction(
        action.id,
      );

    let execution: AgsExecutionRecord = {
      id: this.ids.create("ags-execution"),
      actionId: action.id,
      definitionKey: action.definitionKey,
      state: "running",
      attempt: (previous?.attempt ?? 0) + 1,
      startedAt: now,
      createdAt: now,
      updatedAt: now,
    };

    this.store.saveExecution(execution);

    this.history.record({
      actionId: action.id,
      executionId: execution.id,
      eventType: "execution-started",
      fromState: "queued",
      toState: "running",
      actor,
      evidence: {
        attempt: execution.attempt,
      },
    });

    try {
      const result =
        await this.dispatcher.dispatch(action);

      this.actions.transition(
        action.id,
        "completed",
        actor,
      );

      execution = {
        ...execution,
        state: "completed",
        result,
        completedAt: result.completedAt,
        updatedAt: result.completedAt,
      };

      this.store.saveExecution(execution);

      this.history.record({
        actionId: action.id,
        executionId: execution.id,
        eventType:
          "execution-completed",
        fromState: "running",
        toState: "completed",
        actor,
        evidence: {
          metrics: result.metrics,
        },
      });

      return execution;
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Unknown execution error.";

      this.actions.transition(
        action.id,
        "failed",
        actor,
        message,
      );

      execution = {
        ...execution,
        state: "failed",
        error: message,
        completedAt:
          new Date().toISOString(),
        updatedAt:
          new Date().toISOString(),
      };

      this.store.saveExecution(execution);

      this.history.record({
        actionId: action.id,
        executionId: execution.id,
        eventType: "execution-failed",
        fromState: "running",
        toState: "failed",
        actor,
        reason: message,
        evidence: {},
      });

      throw error;
    }
  }

  cancel(
    actionId: string,
    actor = "human:khalifa",
    reason = "Cancelled by authorized actor.",
  ) {
    const action = this.actions.get(actionId);

    const cancellable:
      AgsExecutionState[] = [
        "draft",
        "pending-approval",
        "approved",
        "queued",
        "running",
        "failed",
      ];

    if (!cancellable.includes(action.state)) {
      throw new BadRequestException(
        `Action cannot be cancelled from state ${action.state}.`,
      );
    }

    const updated = this.actions.transition(
      action.id,
      "cancelled",
      actor,
      reason,
    );

    const execution =
      this.store.latestExecutionForAction(
        action.id,
      );

    if (execution) {
      this.store.saveExecution({
        ...execution,
        state: "cancelled",
        cancelledAt:
          new Date().toISOString(),
        updatedAt:
          new Date().toISOString(),
      });
    }

    return updated;
  }

  async retry(
    actionId: string,
    actor = "human:khalifa",
  ) {
    const action = this.actions.get(actionId);

    if (action.state !== "failed") {
      throw new BadRequestException(
        "Only failed actions may be retried.",
      );
    }

    return this.start(actionId, actor);
  }

  list(): AgsExecutionRecord[] {
    return this.store.listExecutions();
  }

  get(id: string): AgsExecutionRecord {
    return this.store.getExecution(id);
  }
}