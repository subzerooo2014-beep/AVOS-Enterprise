import {
  mkdir,
  readFile,
  writeFile,
} from "node:fs/promises";
import {
  dirname,
  join,
  resolve,
} from "node:path";
import {
  CodeGenArtifactDescriptor,
} from "../../artifacts/codegen-artifact.contracts";

export interface CodeGenWorkspaceSynchronizationResult {
  written: string[];
  unchanged: string[];
  failed: string[];
  warnings: string[];
  completedAt: string;
}

export class CodeGenWorkspaceSynchronizer {
  async synchronize(
    targetRoot: string,
    artifacts:
      readonly CodeGenArtifactDescriptor[],
    dryRun = false,
  ): Promise<
    CodeGenWorkspaceSynchronizationResult
  > {
    const root =
      resolve(targetRoot);

    const written: string[] = [];
    const unchanged: string[] = [];
    const failed: string[] = [];
    const warnings: string[] = [];

    for (const artifact of artifacts) {
      const targetPath =
        join(
          root,
          artifact.relativePath,
        );

      try {
        let current:
          string | undefined;

        try {
          current =
            await readFile(
              targetPath,
              "utf8",
            );
        } catch {
          current =
            undefined;
        }

        if (
          current ===
          artifact.content
        ) {
          unchanged.push(
            artifact.relativePath,
          );
          continue;
        }

        if (!dryRun) {
          await mkdir(
            dirname(
              targetPath,
            ),
            {
              recursive: true,
            },
          );

          await writeFile(
            targetPath,
            artifact.content,
            "utf8",
          );
        }

        written.push(
          artifact.relativePath,
        );
      } catch (error) {
        failed.push(
          artifact.relativePath,
        );

        warnings.push(
          error instanceof Error
            ? error.message
            : String(error),
        );
      }
    }

    return {
      written,
      unchanged,
      failed,
      warnings,
      completedAt:
        new Date().toISOString(),
    };
  }
}
