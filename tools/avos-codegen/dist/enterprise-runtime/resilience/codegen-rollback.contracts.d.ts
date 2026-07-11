import { CodeGenMetadata } from "../../core/codegen.contracts";
export declare enum CodeGenRollbackStepStatus {
    PENDING = "pending",
    RUNNING = "running",
    SUCCEEDED = "succeeded",
    FAILED = "failed",
    SKIPPED = "skipped"
}
export interface CodeGenRollbackStep {
    id: string;
    key: string;
    description: string;
    priority: number;
    status: CodeGenRollbackStepStatus;
    metadata: CodeGenMetadata;
}
export interface CodeGenRollbackStepResult {
    stepId: string;
    stepKey: string;
    success: boolean;
    error?: string;
    startedAt: string;
    completedAt: string;
    durationMs: number;
}
export interface CodeGenRollbackResult {
    success: boolean;
    results: CodeGenRollbackStepResult[];
    failedSteps: number;
    completedSteps: number;
    startedAt: string;
    completedAt: string;
    durationMs: number;
}
//# sourceMappingURL=codegen-rollback.contracts.d.ts.map