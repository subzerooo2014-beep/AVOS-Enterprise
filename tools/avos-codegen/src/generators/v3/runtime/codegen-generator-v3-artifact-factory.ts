import {
  createHash,
} from "node:crypto";
import {
  CodeGenArtifactDescriptor,
  CodeGenArtifactType,
} from "../../../artifacts/codegen-artifact.contracts";
import {
  CodeGenWriteMode,
} from "../../../filesystem/codegen-filesystem.contracts";

export class CodeGenGeneratorV3ArtifactFactory {
  create(
    input: {
      id: string;
      key: string;
      type:
        CodeGenArtifactType;
      relativePath: string;
      content: string;
      dependencies?: string[];
      tags?: string[];
      metadata?: Record<
        string,
        string | number | boolean
      >;
    },
  ): CodeGenArtifactDescriptor {
    return {
      id:
        input.id,
      key:
        input.key,
      type:
        input.type,
      relativePath:
        input.relativePath,
      content:
        input.content,
      writeMode:
        CodeGenWriteMode.CREATE,
      dependencies:
        [...(input.dependencies ?? [])],
      tags:
        [...(input.tags ?? [])],
      metadata: {
        generator:
          "generator-v3",
        ...(input.metadata ?? {}),
      },
      checksum:
        createHash("sha256")
          .update(
            input.content,
          )
          .digest("hex"),
    };
  }
}
