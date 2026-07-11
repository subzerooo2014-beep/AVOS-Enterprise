import { CodeGenExecutionTaskHandlerRegistry } from "../runtime/codegen-execution-task-handler-registry";
import { CodeGenExecutionWorker, CodeGenExecutionWorkerExecutor } from "./codegen-execution-worker.contracts";
import { CodeGenExecutionTask, CodeGenExecutionTaskResult } from "../contracts/codegen-execution-task.contracts";
export declare class CodeGenDefaultWorkerExecutor implements CodeGenExecutionWorkerExecutor {
    readonly handlers: CodeGenExecutionTaskHandlerRegistry;
    constructor(handlers?: CodeGenExecutionTaskHandlerRegistry);
    execute(worker: CodeGenExecutionWorker, task: CodeGenExecutionTask): Promise<CodeGenExecutionTaskResult>;
}
//# sourceMappingURL=codegen-default-worker-executor.d.ts.map