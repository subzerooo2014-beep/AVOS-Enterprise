import { CodeGenExecutionTask } from "../contracts/codegen-execution-task.contracts";
export declare class CodeGenPriorityTaskQueue {
    private readonly tasks;
    enqueue(task: CodeGenExecutionTask): CodeGenExecutionTask;
    dequeueReady(completedKeys: ReadonlySet<string>): CodeGenExecutionTask | undefined;
    update(task: CodeGenExecutionTask): CodeGenExecutionTask;
    get(taskId: string): CodeGenExecutionTask;
    list(): CodeGenExecutionTask[];
    hasPending(): boolean;
    clear(): void;
}
//# sourceMappingURL=codegen-priority-task-queue.d.ts.map