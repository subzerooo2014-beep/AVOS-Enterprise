import { CodeGenArtifactDescriptor } from "../../../artifacts/codegen-artifact.contracts";
import { CodeGenExecutionTask, CodeGenExecutionTaskType } from "../contracts/codegen-execution-task.contracts";
export declare class CodeGenExecutionTaskFactory {
    fromArtifact(artifact: CodeGenArtifactDescriptor, input?: {
        type?: CodeGenExecutionTaskType;
        priority?: number;
        weight?: number;
        maximumAttempts?: number;
    }): CodeGenExecutionTask;
    fromArtifacts(artifacts: readonly CodeGenArtifactDescriptor[]): CodeGenExecutionTask[];
}
//# sourceMappingURL=codegen-execution-task-factory.d.ts.map