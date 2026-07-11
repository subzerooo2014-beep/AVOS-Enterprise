import { CodeGenJsonValue, CodeGenMetadata } from "../core/codegen.contracts";
export declare enum CodeGenPipelineStepStatus {
    PENDING = "pending",
    RUNNING = "running",
    SUCCEEDED = "succeeded",
    FAILED = "failed",
    SKIPPED = "skipped"
}
export interface CodeGenPipelineStepContext {
    executionId: string;
    workspaceRoot: string;
    values: Record<string, CodeGenJsonValue>;
    metadata: CodeGenMetadata;
}
export interface CodeGenPipelineStepResult {
    stepKey: string;
    status: CodeGenPipelineStepStatus;
    output: Record<string, CodeGenJsonValue>;
    error?: string;
    startedAt: string;
    completedAt: string;
}
export interface CodeGenPipelineStep {
    readonly key: string;
    readonly name: string;
    readonly order: number;
    readonly enabled: boolean;
    execute(context: CodeGenPipelineStepContext): Promise<CodeGenPipelineStepResult> | CodeGenPipelineStepResult;
}
export interface CodeGenPipelineExecutionResult {
    executionId: string;
    success: boolean;
    steps: CodeGenPipelineStepResult[];
    startedAt: string;
    completedAt: string;
}
//# sourceMappingURL=codegen-pipeline.contracts.d.ts.map