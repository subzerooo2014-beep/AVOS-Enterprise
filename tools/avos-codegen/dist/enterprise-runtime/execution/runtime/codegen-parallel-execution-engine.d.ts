import { CodeGenExecutionBatchResult, CodeGenExecutionTask } from "../contracts/codegen-execution-task.contracts";
import { CodeGenPriorityTaskQueue } from "../queue/codegen-priority-task-queue";
import { CodeGenDefaultWorkerExecutor } from "../workers/codegen-default-worker-executor";
import { CodeGenExecutionWorkerPool } from "../workers/codegen-execution-worker-pool";
export declare class CodeGenParallelExecutionEngine {
    readonly queue: CodeGenPriorityTaskQueue;
    readonly pool: CodeGenExecutionWorkerPool;
    readonly executor: CodeGenDefaultWorkerExecutor;
    constructor(queue?: CodeGenPriorityTaskQueue, pool?: CodeGenExecutionWorkerPool, executor?: CodeGenDefaultWorkerExecutor);
    execute(tasks: readonly CodeGenExecutionTask[]): Promise<CodeGenExecutionBatchResult>;
    private runTask;
}
//# sourceMappingURL=codegen-parallel-execution-engine.d.ts.map