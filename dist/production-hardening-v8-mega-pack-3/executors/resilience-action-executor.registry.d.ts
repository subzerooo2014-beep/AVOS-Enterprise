import { ResilienceActionType } from "../contracts/runtime-resilience.enums";
import { SafeResilienceActionExecutor } from "./safe-resilience-action.executor";
import { ResilienceActionExecutor } from "./resilience-action-executor.contract";
export declare class ResilienceActionExecutorRegistry {
    private readonly executors;
    constructor(safeExecutor: SafeResilienceActionExecutor);
    resolve(type: ResilienceActionType): ResilienceActionExecutor;
}
