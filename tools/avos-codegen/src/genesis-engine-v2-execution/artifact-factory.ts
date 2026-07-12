import { createHash, randomUUID } from "node:crypto";
import {
  ExecutionArtifactKind,
  ExecutionValue,
  GeneratedArtifact,
} from "./contracts";

export class ArtifactFactory {
  create(
    kind: ExecutionArtifactKind,
    relativePath: string,
    content: string,
    metadata: Record<string, ExecutionValue> = {},
    sourceModule?: string,
  ): GeneratedArtifact {
    const normalizedContent = content.endsWith("\n")
      ? content
      : `${content}\n`;

    const artifact: GeneratedArtifact = {
      id: randomUUID(),
      kind,
      relativePath,
      content: normalizedContent,
      hash: createHash("sha256")
        .update(normalizedContent)
        .digest("hex"),
      metadata,
    };

    if (sourceModule !== undefined) {
      artifact.sourceModule = sourceModule;
    }

    return artifact;
  }
}
