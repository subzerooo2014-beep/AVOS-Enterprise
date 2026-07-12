import { GeneratedArtifact } from "./contracts";

export interface WorkspaceWriteOperation {
  relativePath: string;
  content: string;
  hash: string;
  overwrite: boolean;
}

export interface WorkspaceExecutionPlan {
  rootDirectory: string;
  operations: WorkspaceWriteOperation[];
  directories: string[];
  artifactCount: number;
}

export class WorkspaceWriterPlanner {
  plan(
    rootDirectory: string,
    artifacts: readonly GeneratedArtifact[],
    overwrite = false,
  ): WorkspaceExecutionPlan {
    const directories = Array.from(
      new Set(
        artifacts.map((artifact) => {
          const normalized = artifact.relativePath.replace(/\\/g, "/");
          const index = normalized.lastIndexOf("/");
          return index < 0 ? "." : normalized.slice(0, index);
        }),
      ),
    ).sort();

    return {
      rootDirectory,
      operations: artifacts.map((artifact) => ({
        relativePath: artifact.relativePath,
        content: artifact.content,
        hash: artifact.hash,
        overwrite,
      })),
      directories,
      artifactCount: artifacts.length,
    };
  }
}
