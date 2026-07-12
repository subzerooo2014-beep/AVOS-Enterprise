import { createHash } from "node:crypto";
import {
  GenesisV3Artifact,
  GenesisV3ArtifactKind,
  GenesisV3Value,
} from "./contracts";

export class GenesisV3ArtifactFactory {
  create(
    relativePath: string,
    kind: GenesisV3ArtifactKind,
    content: string,
    metadata: Record<string, GenesisV3Value> = {},
  ): GenesisV3Artifact {
    const normalized = content.endsWith("\n")
      ? content
      : `${content}\n`;

    return {
      relativePath,
      kind,
      content: normalized,
      hash: createHash("sha256").update(normalized).digest("hex"),
      metadata,
    };
  }
}
