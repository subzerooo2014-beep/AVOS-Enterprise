import {
  createHash,
} from "node:crypto";
import {
  resolve,
} from "node:path";
import {
  CodeGenArtifactDescriptor,
} from "../../artifacts/codegen-artifact.contracts";
import {
  CodeGenConflictPolicy,
  CodeGenPreviewResult,
} from "../codegen-output.contracts";
import {
  CodeGenOutputConflictDetector,
} from "../conflicts/codegen-output-conflict-detector";

export class CodeGenOutputPreviewEngine {
  constructor(
    readonly conflicts =
      new CodeGenOutputConflictDetector(),
  ) {}

  async preview(
    input: {
      targetRoot: string;
      artifacts:
        readonly CodeGenArtifactDescriptor[];
      policy:
        CodeGenConflictPolicy;
    },
  ): Promise<
    CodeGenPreviewResult
  > {
    const entries:
      CodeGenPreviewResult["entries"] =
      [];

    const conflicts:
      CodeGenPreviewResult["conflicts"] =
      [];

    for (
      const artifact of
      input.artifacts
    ) {
      const absolutePath =
        resolve(
          input.targetRoot,
          artifact.relativePath,
        );

      const conflict =
        await this.conflicts.detect({
          artifactKey:
            artifact.key,
          targetRoot:
            input.targetRoot,
          absolutePath,
          content:
            artifact.content,
          policy:
            input.policy,
        });

      conflicts.push(conflict);

      const action =
        conflict.type === "none"
          ? "create"
          : conflict.allowed
            ? input.policy ===
                CodeGenConflictPolicy.SKIP
              ? "skip"
              : "overwrite"
            : "error";

      entries.push({
        artifactKey:
          artifact.key,
        relativePath:
          artifact.relativePath,
        absolutePath,
        action,
        conflictType:
          conflict.type,
        checksum:
          createHash("sha256")
            .update(
              artifact.content,
            )
            .digest("hex"),
        bytes:
          Buffer.byteLength(
            artifact.content,
            "utf8",
          ),
      });
    }

    return {
      valid:
        entries.every(
          (entry) =>
            entry.action !==
            "error",
        ),
      entries,
      conflicts,
      generatedAt:
        new Date().toISOString(),
    };
  }
}
