import { CodeGenExecutionTask, CodeGenExecutionTaskResult } from "../contracts/codegen-execution-task.contracts";
export declare enum CodeGenExecutionWorkerStatus {
    IDLE = "idle",
    BUSY = "busy",
    STOPPED = "stopped",
    FAILED = "failed"
}
export interface CodeGenExecutionWorker {
    id: string;
    status: CodeGenExecutionWorkerStatus;
    currentTaskId?: string;
    completedTasks: number;
    failedTasks: number;
    createdAt: string;
    updatedAt: string;
}
export interface CodeGenExecutionWorkerExecutor {
    execute(worker: CodeGenExecutionWorker, task: CodeGenExecutionTask): Promise<CodeGenExecutionTaskResult>;
}
//# sourceMappingURL=codegen-execution-worker.contracts.d.ts.map