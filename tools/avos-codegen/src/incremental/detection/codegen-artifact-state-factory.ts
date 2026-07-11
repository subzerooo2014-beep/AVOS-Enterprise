import {
  createHash,
} from "node:crypto";
import {
  CodeGenArtifactDescriptor,
} from "../../artifacts/codegen-artifact.contracts";
import {
  CodeGenArtifactState,
} from "../contracts/codegen-incremental.contracts";

export class CodeGenArtifactStateFactory {
  create(
    artifact:
      CodeGenArtifactDescriptor,
  ): CodeGenArtifactState {
    return {
      artifactKey:
        artifact.key,
      relativePath:
        artifact.relativePath,
      checksum:
        artifact.checksum ??
        createHash("sha256")
          .update(
            artifact.content,
          )
          .digest("hex"),
      sizeBytes:
        Buffer.byteLength(
          artifact.content,
          "utf8",
        ),
      generatedAt:
        new Date().toISOString(),
      metadata:
        structuredClone(
          artifact.metadata,
        ),
    };
  }

  createMany(
    artifacts:
      readonly CodeGenArtifactDescriptor[],
  ): CodeGenArtifactState[] {
    return artifacts.map(
      (artifact) =>
        this.create(
          artifact,
        ),
    );
  }
}
