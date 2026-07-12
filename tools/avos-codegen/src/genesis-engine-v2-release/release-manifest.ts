import { createHash, randomUUID } from "node:crypto";
import { ReleaseArtifactDescriptor } from "./contracts";

export interface GeneratedSystemReleaseManifest {
  releaseId: string;
  systemKey: string;
  version: string;
  strategy: "promote" | "promote-with-controls";
  qualityScore: number;
  workspaceDirectory: string;
  artifacts: ReleaseArtifactDescriptor[];
  artifactIndexHash: string;
  controls: string[];
  createdAt: string;
}

export class ReleaseManifestFactory {
  create(input: {
    systemKey: string;
    version: string;
    strategy: "promote" | "promote-with-controls";
    qualityScore: number;
    workspaceDirectory: string;
    artifacts: ReleaseArtifactDescriptor[];
    controls: string[];
  }): GeneratedSystemReleaseManifest {
    const artifactIndexHash = createHash("sha256")
      .update(
        JSON.stringify(
          [...input.artifacts].sort((a, b) =>
            a.relativePath.localeCompare(b.relativePath),
          ),
        ),
      )
      .digest("hex");

    return {
      releaseId: randomUUID(),
      systemKey: input.systemKey,
      version: input.version,
      strategy: input.strategy,
      qualityScore: input.qualityScore,
      workspaceDirectory: input.workspaceDirectory,
      artifacts: input.artifacts.map((artifact) => ({ ...artifact })),
      artifactIndexHash,
      controls: [...input.controls],
      createdAt: new Date().toISOString(),
    };
  }
}
