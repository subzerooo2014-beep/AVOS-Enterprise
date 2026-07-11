import { CodeGenExecutionTaskHandler } from "../contracts/codegen-execution-task-handler.contracts";
import { CodeGenExecutionTaskType } from "../contracts/codegen-execution-task.contracts";
export declare class CodeGenExecutionTaskHandlerRegistry {
    private readonly handlers;
    register(handler: CodeGenExecutionTaskHandler, replace?: boolean): CodeGenExecutionTaskHandler;
    get(type: CodeGenExecutionTaskType): CodeGenExecutionTaskHandler;
    list(): readonly CodeGenExecutionTaskHandler[];
    clear(): void;
}
//# sourceMappingURL=codegen-execution-task-handler-registry.d.ts.map