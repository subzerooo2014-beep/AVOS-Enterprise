import {
  CodeGenArtifactDescriptor,
} from "../../artifacts/codegen-artifact.contracts";
import {
  CodeGenMetadata,
} from "../../core/codegen.contracts";
import {
  CodeGenExecutionPlan,
} from "../../planning/contracts/codegen-planning.contracts";
import {
  CodeGenIncrementalSnapshot,
} from "../contracts/codegen-incremental.contracts";
import {
  CodeGenArtifactStateFactory,
} from "../detection/codegen-artifact-state-factory";

export class CodeGenIncrementalSnapshotFactory {
  constructor(
    readonly states =
      new CodeGenArtifactStateFactory(),
  ) {}

  create(
    input: {
      workspaceRoot: string;
      targetRoot: string;
      artifacts:
        readonly CodeGenArtifactDescriptor[];
      executionPlan?:
        CodeGenExecutionPlan;
      metadata?:
        CodeGenMetadata;
      previous?:
        CodeGenIncrementalSnapshot;
    },
  ): CodeGenIncrementalSnapshot {
    const now =
      new Date().toISOString();

    return {
      version:
        "1.0.0",
      workspaceRoot:
        input.workspaceRoot,
      targetRoot:
        input.targetRoot,
      artifacts:
        this.states.createMany(
          input.artifacts,
        ),
      ...(input.executionPlan
        ? {
            executionPlan:
              structuredClone(
                input.executionPlan,
              ),
          }
        : {}),
      metadata:
        structuredClone(
          input.metadata ?? {},
        ),
      createdAt:
        input.previous
          ?.createdAt ??
        now,
      updatedAt:
        now,
    };
  }
}
