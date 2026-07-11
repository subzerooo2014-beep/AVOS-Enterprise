import { CodeGenArtifactDescriptor } from "../../../artifacts/codegen-artifact.contracts";
import { CodeGenMetadata } from "../../../core/codegen.contracts";
export declare enum CodeGenExecutionTaskStatus {
    CREATED = "created",
    QUEUED = "queued",
    DISPATCHED = "dispatched",
    RUNNING = "running",
    SUCCEEDED = "succeeded",
    FAILED = "failed",
    CANCELLED = "cancelled",
    SKIPPED = "skipped"
}
export declare enum CodeGenExecutionTaskType {
    GENERATE = "generate",
    VALIDATE = "validate",
    WRITE = "write",
    TRANSFORM = "transform",
    CUSTOM = "custom"
}
export interface CodeGenExecutionTask {
    id: string;
    key: string;
    type: CodeGenExecutionTaskType;
    artifact?: CodeGenArtifactDescriptor;
    dependencies: string[];
    priority: number;
    weight: number;
    status: CodeGenExecutionTaskStatus;
    attempts: number;
    maximumAttempts: number;
    metadata: CodeGenMetadata;
    createdAt: string;
    updatedAt: string;
}
export interface CodeGenExecutionTaskContext {
    task: CodeGenExecutionTask;
    workerId: string;
    signal?: AbortSignal;
}
export interface CodeGenExecutionTaskResult {
    taskId: string;
    taskKey: string;
    workerId: string;
    success: boolean;
    skipped: boolean;
    output?: unknown;
    error?: string;
    startedAt: string;
    completedAt: string;
    durationMs: number;
    metadata: CodeGenMetadata;
}
export interface CodeGenExecutionBatchResult {
    success: boolean;
    results: CodeGenExecutionTaskResult[];
    succeeded: number;
    failed: number;
    skipped: number;
    cancelled: number;
    startedAt: string;
    completedAt: string;
    durationMs: number;
}
//# sourceMappingURL=codegen-execution-task.contracts.d.ts.map