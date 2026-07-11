import {
  randomUUID,
} from "node:crypto";
import {
  CodeGenArtifactDescriptor,
} from "../../../artifacts/codegen-artifact.contracts";
import {
  CodeGenExecutionTask,
  CodeGenExecutionTaskStatus,
  CodeGenExecutionTaskType,
} from "../contracts/codegen-execution-task.contracts";

export class CodeGenExecutionTaskFactory {
  fromArtifact(
    artifact:
      CodeGenArtifactDescriptor,
    input: {
      type?:
        CodeGenExecutionTaskType;
      priority?: number;
      weight?: number;
      maximumAttempts?: number;
    } = {},
  ): CodeGenExecutionTask {
    const now =
      new Date().toISOString();

    return {
      id:
        randomUUID(),
      key:
        artifact.key,
      type:
        input.type ??
        CodeGenExecutionTaskType.GENERATE,
      artifact:
        structuredClone(
          artifact,
        ),
      dependencies:
        [...artifact.dependencies],
      priority:
        input.priority ??
        100,
      weight:
        input.weight ??
        Math.max(
          1,
          Math.ceil(
            artifact.content.length /
            1000,
          ),
        ),
      status:
        CodeGenExecutionTaskStatus.CREATED,
      attempts: 0,
      maximumAttempts:
        input.maximumAttempts ??
        1,
      metadata: {
        relativePath:
          artifact.relativePath,
        artifactType:
          artifact.type,
      },
      createdAt:
        now,
      updatedAt:
        now,
    };
  }

  fromArtifacts(
    artifacts:
      readonly CodeGenArtifactDescriptor[],
  ): CodeGenExecutionTask[] {
    return artifacts.map(
      (artifact) =>
        this.fromArtifact(
          artifact,
        ),
    );
  }
}
