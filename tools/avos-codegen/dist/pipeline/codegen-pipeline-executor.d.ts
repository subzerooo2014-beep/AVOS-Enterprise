import { CodeGenPipelineExecutionResult, CodeGenPipelineStep, CodeGenPipelineStepContext } from "./codegen-pipeline.contracts";
export declare class CodeGenPipelineExecutor {
    execute(steps: readonly CodeGenPipelineStep[], context: Omit<CodeGenPipelineStepContext, "executionId">): Promise<CodeGenPipelineExecutionResult>;
}
//# sourceMappingURL=codegen-pipeline-executor.d.ts.map