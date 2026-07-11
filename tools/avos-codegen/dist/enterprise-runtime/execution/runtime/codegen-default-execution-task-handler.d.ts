import { CodeGenExecutionTaskHandler } from "../contracts/codegen-execution-task-handler.contracts";
import { CodeGenExecutionTaskContext, CodeGenExecutionTaskResult, CodeGenExecutionTaskType } from "../contracts/codegen-execution-task.contracts";
export declare class CodeGenDefaultExecutionTaskHandler implements CodeGenExecutionTaskHandler {
    readonly type: CodeGenExecutionTaskType;
    constructor(type: CodeGenExecutionTaskType);
    execute(context: CodeGenExecutionTaskContext): Promise<CodeGenExecutionTaskResult>;
}
//# sourceMappingURL=codegen-default-execution-task-handler.d.ts.map