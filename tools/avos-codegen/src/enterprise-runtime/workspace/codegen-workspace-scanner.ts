import {
  createHash,
} from "node:crypto";
import {
  readdir,
  readFile,
  stat,
} from "node:fs/promises";
import {
  extname,
  join,
  relative,
  resolve,
} from "node:path";
import {
  CodeGenWorkspaceFileRecord,
  CodeGenWorkspaceScanOptions,
  CodeGenWorkspaceScanResult,
} from "./codegen-workspace.contracts";

export class CodeGenWorkspaceScanner {
  async scan(
    workspaceRoot: string,
    optionsInput:
      Partial<
        CodeGenWorkspaceScanOptions
      > = {},
  ): Promise<
    CodeGenWorkspaceScanResult
  > {
    const startedAt =
      new Date().toISOString();

    const root =
      resolve(workspaceRoot);

    const options:
      CodeGenWorkspaceScanOptions = {
      includeExtensions:
        optionsInput.includeExtensions ??
        [
          ".ts",
          ".tsx",
          ".js",
          ".json",
          ".prisma",
          ".md",
        ],
      excludeDirectories:
        optionsInput.excludeDirectories ??
        [
          "node_modules",
          "dist",
          ".git",
          ".avos-codegen",
        ],
      includeHidden:
        optionsInput.includeHidden ??
        false,
      calculateChecksums:
        optionsInput.calculateChecksums ??
        false,
      maximumFiles:
        Math.max(
          1,
          optionsInput.maximumFiles ??
          25000,
        ),
    };

    const files:
      CodeGenWorkspaceFileRecord[] =
      [];

    const warnings: string[] = [];
    const errors: string[] = [];

    let scannedDirectories = 0;
    let skippedDirectories = 0;

    const walk = async (
      directory: string,
    ): Promise<void> => {
      if (
        files.length >=
        options.maximumFiles
      ) {
        warnings.push(
          `Workspace scan reached maximum file limit: ${options.maximumFiles}`,
        );
        return;
      }

      scannedDirectories += 1;

      let entries;

      try {
        entries =
          await readdir(
            directory,
            {
              withFileTypes: true,
            },
          );
      } catch (error) {
        errors.push(
          error instanceof Error
            ? error.message
            : String(error),
        );
        return;
      }

      for (const entry of entries) {
        if (
          !options.includeHidden &&
          entry.name.startsWith(".")
        ) {
          continue;
        }

        const absolutePath =
          join(
            directory,
            entry.name,
          );

        if (entry.isDirectory()) {
          if (
            options.excludeDirectories.includes(
              entry.name,
            )
          ) {
            skippedDirectories += 1;
            continue;
          }

          await walk(
            absolutePath,
          );
          continue;
        }

        if (!entry.isFile()) {
          continue;
        }

        const extension =
          extname(
            entry.name,
          ).toLowerCase();

        if (
          options.includeExtensions.length > 0 &&
          !options.includeExtensions.includes(
            extension,
          )
        ) {
          continue;
        }

        const fileStat =
          await stat(
            absolutePath,
          );

        let checksum:
          string | undefined;

        if (
          options.calculateChecksums
        ) {
          const content =
            await readFile(
              absolutePath,
            );

          checksum =
            createHash("sha256")
              .update(content)
              .digest("hex");
        }

        files.push({
          relativePath:
            relative(
              root,
              absolutePath,
            ).replaceAll(
              "\\",
              "/",
            ),
          absolutePath,
          extension,
          sizeBytes:
            fileStat.size,
          modifiedAt:
            fileStat.mtime
              .toISOString(),
          ...(checksum
            ? {
                checksum,
              }
            : {}),
          metadata: {},
        });

        if (
          files.length >=
          options.maximumFiles
        ) {
          break;
        }
      }
    };

    await walk(root);

    const completedAt =
      new Date().toISOString();

    return {
      workspaceRoot:
        root,
      files:
        files.sort(
          (left, right) =>
            left.relativePath.localeCompare(
              right.relativePath,
            ),
        ),
      scannedDirectories,
      skippedDirectories,
      warnings,
      errors,
      startedAt,
      completedAt,
      durationMs:
        Date.parse(
          completedAt,
        ) -
        Date.parse(
          startedAt,
        ),
    };
  }
}
