import { ResilienceActionExecutionContext, ResilienceActionExecutionResult, ResilienceActionExecutor } from "./resilience-action-executor.contract";
import { ResilienceActionType } from "../contracts/runtime-resilience.enums";
export declare class SafeResilienceActionExecutor implements ResilienceActionExecutor {
    supports(type: ResilienceActionType): boolean;
    execute(context: ResilienceActionExecutionContext): Promise<ResilienceActionExecutionResult>;
    private success;
}
