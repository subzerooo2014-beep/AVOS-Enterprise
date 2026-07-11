import { Injectable } from "@nestjs/common";
import {
  ResilienceActionExecutionContext,
  ResilienceActionExecutionResult,
  ResilienceActionExecutor,
} from "./resilience-action-executor.contract";
import { ResilienceActionType } from "../contracts/runtime-resilience.enums";

@Injectable()
export class SafeResilienceActionExecutor
  implements ResilienceActionExecutor
{
  supports(type: ResilienceActionType): boolean {
    return Object.values(ResilienceActionType).includes(type);
  }

  async execute(
    context: ResilienceActionExecutionContext,
  ): Promise<ResilienceActionExecutionResult> {
    const action = context.action;

    if (action.dryRun) {
      return {
        succeeded: true,
        output: {
          executionMode: "dry_run",
          actionType: action.type,
          target: action.target,
          parameters: action.parameters,
          runtimeContext: context.runtimeContext,
          executedAt: new Date().toISOString(),
        },
      };
    }

    switch (action.type) {
      case ResilienceActionType.NOTIFY:
        return this.success(action, {
          operation: "notification_dispatched",
        });

      case ResilienceActionType.THROTTLE:
        return this.success(action, {
          operation: "runtime_throttle_requested",
        });

      case ResilienceActionType.ISOLATE:
        return this.success(action, {
          operation: "service_isolation_requested",
        });

      case ResilienceActionType.DISABLE_FEATURE:
        return this.success(action, {
          operation: "feature_disable_requested",
        });

      case ResilienceActionType.PAUSE_WORKFLOW:
        return this.success(action, {
          operation: "workflow_pause_requested",
        });

      case ResilienceActionType.SWITCH_DEPENDENCY:
        return this.success(action, {
          operation: "dependency_switch_requested",
        });

      case ResilienceActionType.SCALE_OUT:
        return this.success(action, {
          operation: "scale_out_requested",
        });

      case ResilienceActionType.SCALE_IN:
        return this.success(action, {
          operation: "scale_in_requested",
        });

      case ResilienceActionType.ROLLBACK:
        return this.success(action, {
          operation: "rollback_requested",
        });

      case ResilienceActionType.RESTORE_BASELINE:
        return this.success(action, {
          operation: "baseline_restore_requested",
        });

      case ResilienceActionType.LOCKDOWN:
        return this.success(action, {
          operation: "runtime_lockdown_requested",
        });

      case ResilienceActionType.CUSTOM:
        return this.success(action, {
          operation: "custom_action_requested",
        });

      default:
        return {
          succeeded: false,
          output: {},
          error: `Unsupported action type: ${String(action.type)}`,
        };
    }
  }

  private success(
    action: ResilienceActionExecutionContext["action"],
    values: Record<string, string>,
  ): ResilienceActionExecutionResult {
    return {
      succeeded: true,
      output: {
        ...values,
        actionId: action.id,
        actionType: action.type,
        target: action.target,
        parameters: action.parameters,
        executedAt: new Date().toISOString(),
      },
    };
  }
}
