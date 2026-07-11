import {
  randomUUID,
} from "node:crypto";
import {
  CodeGenArtifactDescriptor,
} from "../../artifacts/codegen-artifact.contracts";
import {
  CodeGenMetadata,
} from "../../core/codegen.contracts";
import {
  CodeGenWorkspaceSnapshot,
} from "./codegen-workspace-snapshot.contracts";

export class CodeGenWorkspaceSnapshotFactory {
  create(
    input: {
      sessionId: string;
      workspaceRoot: string;
      targetRoot: string;
      artifacts:
        readonly CodeGenArtifactDescriptor[];
      metadata?:
        CodeGenMetadata;
    },
  ): CodeGenWorkspaceSnapshot {
    return {
      id:
        randomUUID(),
      sessionId:
        input.sessionId,
      workspaceRoot:
        input.workspaceRoot,
      targetRoot:
        input.targetRoot,
      artifacts:
        structuredClone(
          [...input.artifacts],
        ),
      metadata:
        structuredClone(
          input.metadata ?? {},
        ),
      createdAt:
        new Date().toISOString(),
    };
  }
}

