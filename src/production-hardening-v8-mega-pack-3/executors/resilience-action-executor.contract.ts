import {
  JsonValue,
  ResilienceAction,
} from "../contracts/runtime-resilience.contracts";
import { ResilienceActionType } from "../contracts/runtime-resilience.enums";

export interface ResilienceActionExecutionContext {
  action: ResilienceAction;
  runtimeContext: Record<string, JsonValue>;
}

export interface ResilienceActionExecutionResult {
  succeeded: boolean;
  output: Record<string, JsonValue>;
  error?: string;
}

export interface ResilienceActionExecutor {
  supports(type: ResilienceActionType): boolean;

  execute(
    context: ResilienceActionExecutionContext,
  ): Promise<ResilienceActionExecutionResult>;
}
