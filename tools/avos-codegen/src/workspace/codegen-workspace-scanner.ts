import {
  readdir,
  stat,
} from "node:fs/promises";
import {
  extname,
  join,
  relative,
  resolve,
} from "node:path";
import {
  CodeGenFileDescriptor,
} from "../filesystem/codegen-filesystem.contracts";

export interface ScanWorkspaceOptions {
  includeExtensions?: string[];
  excludeDirectories?: string[];
  maximumDepth?: number;
}

export interface CodeGenWorkspaceSnapshot {
  root: string;
  files: CodeGenFileDescriptor[];
  directories: number;
  totalFiles: number;
  totalBytes: number;
  scannedAt: string;
}

export class CodeGenWorkspaceScanner {
  async scan(
    workspaceRoot: string,
    options: ScanWorkspaceOptions = {},
  ): Promise<CodeGenWorkspaceSnapshot> {
    const root = resolve(workspaceRoot);
    const files: CodeGenFileDescriptor[] = [];
    let directories = 0;

    const excluded = new Set(
      options.excludeDirectories ?? [
        "node_modules",
        ".git",
        "dist",
        "coverage",
      ],
    );

    const visit = async (
      current: string,
      depth: number,
    ): Promise<void> => {
      if (
        options.maximumDepth !== undefined &&
        depth > options.maximumDepth
      ) {
        return;
      }

      const entries = await readdir(
        current,
        { withFileTypes: true },
      );

      for (const entry of entries) {
        const absolutePath = join(
          current,
          entry.name,
        );

        if (entry.isDirectory()) {
          if (excluded.has(entry.name)) {
            continue;
          }

          directories += 1;
          await visit(
            absolutePath,
            depth + 1,
          );
          continue;
        }

        if (!entry.isFile()) {
          continue;
        }

        const extension = extname(
          entry.name,
        );

        if (
          options.includeExtensions &&
          !options.includeExtensions.includes(
            extension,
          )
        ) {
          continue;
        }

        const fileStat = await stat(
          absolutePath,
        );

        files.push({
          absolutePath,
          relativePath: relative(
            root,
            absolutePath,
          ),
          exists: true,
          sizeBytes: fileStat.size,
          extension,
          createdAt:
            fileStat.birthtime.toISOString(),
          updatedAt:
            fileStat.mtime.toISOString(),
        });
      }
    };

    await visit(root, 0);

    return {
      root,
      files: files.sort(
        (a, b) =>
          a.relativePath.localeCompare(
            b.relativePath,
          ),
      ),
      directories,
      totalFiles: files.length,
      totalBytes: files.reduce(
        (total, file) =>
          total + file.sizeBytes,
        0,
      ),
      scannedAt:
        new Date().toISOString(),
    };
  }
}
