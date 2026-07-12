import path from "node:path";
import {
  mkdir,
  readFile,
  rename,
  stat,
  unlink,
  writeFile,
} from "node:fs/promises";
import { randomUUID } from "node:crypto";
import {
  GenesisV3MaterializationArtifact,
  GenesisV3MaterializationOperation,
  GenesisV3MaterializationStatus,
  GenesisV3RollbackEntry,
} from "./contracts";
import { GenesisV3WorkspacePathGuard } from "./path-guard";
import { GenesisV3WorkspaceIntegrity } from "./integrity";

export interface GenesisV3MaterializationInput {
  rootDirectory: string;
  artifacts: GenesisV3MaterializationArtifact[];
}

export interface GenesisV3MaterializationResult {
  success: boolean;
  status: GenesisV3MaterializationStatus;
  operations: GenesisV3MaterializationOperation[];
  rollbackEntries: GenesisV3RollbackEntry[];
  directories: string[];
  bootstrapCommands: string[];
  buildReadinessScore: number;
  completedAt: string;
}

export class GenesisV3SystemMaterializer {
  constructor(
    readonly guard = new GenesisV3WorkspacePathGuard(),
    readonly integrity = new GenesisV3WorkspaceIntegrity(),
  ) {}

  async execute(
    input: GenesisV3MaterializationInput,
  ): Promise<GenesisV3MaterializationResult> {
    const operations: GenesisV3MaterializationOperation[] = [];
    const rollbackEntries: GenesisV3RollbackEntry[] = [];
    const directories = new Set<string>();

    for (const artifact of input.artifacts) {
      const absolutePath = this.guard.resolve(
        input.rootDirectory,
        artifact.relativePath,
      );

      directories.add(path.dirname(artifact.relativePath));

      let exists = false;
      let previousContent: string | null = null;
      let previousHash: string | null = null;

      try {
        await stat(absolutePath);
        exists = true;
        previousContent = await readFile(absolutePath, "utf8");
        previousHash = this.integrity.hash(previousContent);
      } catch {
        exists = false;
      }

      if (exists && !artifact.overwrite) {
        operations.push({
          relativePath: artifact.relativePath,
          absolutePath,
          action: "skip",
          success: true,
          verified: previousHash === artifact.hash,
          previousHash,
          currentHash: previousHash,
        });
        continue;
      }

      await mkdir(path.dirname(absolutePath), { recursive: true });

      const temporaryPath = `${absolutePath}.avos-v3-tmp-${randomUUID()}`;
      await writeFile(temporaryPath, artifact.content, "utf8");
      await rename(temporaryPath, absolutePath);

      const currentHash = await this.integrity.hashFile(absolutePath);
      const verified = currentHash === artifact.hash;

      rollbackEntries.push({
        relativePath: artifact.relativePath,
        action: exists ? "restore-overwritten" : "delete-created",
        previousContent,
        previousHash,
      });

      operations.push({
        relativePath: artifact.relativePath,
        absolutePath,
        action: exists ? "overwrite" : "create",
        success: verified,
        verified,
        previousHash,
        currentHash,
      });
    }

    const successful = operations.filter((item) => item.success).length;
    const verified = operations.filter((item) => item.verified).length;

    const buildReadinessScore =
      operations.length === 0
        ? 0
        : Math.round(
            ((successful / operations.length) * 0.5 +
              (verified / operations.length) * 0.5) *
              100,
          );

    const requiredPaths = [
      "package.json",
      "apps/api/prisma/schema.prisma",
      "README.md",
    ];

    const hasRequiredPaths = requiredPaths.every((requiredPath) =>
      operations.some(
        (operation) =>
          operation.relativePath === requiredPath &&
          operation.success,
      ),
    );

    const success =
      hasRequiredPaths &&
      operations.every((operation) => operation.success);

    return {
      success,
      status: success
        ? GenesisV3MaterializationStatus.READY
        : buildReadinessScore >= 70
          ? GenesisV3MaterializationStatus.DEGRADED
          : GenesisV3MaterializationStatus.BLOCKED,
      operations,
      rollbackEntries,
      directories: Array.from(directories).sort(),
      bootstrapCommands: [
        "pnpm install",
        "pnpm prisma generate",
        "pnpm build",
        "pnpm test",
        "pnpm lint",
      ],
      buildReadinessScore,
      completedAt: new Date().toISOString(),
    };
  }

  async rollback(
    rootDirectory: string,
    entries: readonly GenesisV3RollbackEntry[],
  ): Promise<GenesisV3MaterializationOperation[]> {
    const results: GenesisV3MaterializationOperation[] = [];

    for (const entry of [...entries].reverse()) {
      const absolutePath = this.guard.resolve(
        rootDirectory,
        entry.relativePath,
      );

      if (entry.action === "delete-created") {
        try {
          await unlink(absolutePath);
        } catch {
          // Already absent.
        }

        results.push({
          relativePath: entry.relativePath,
          absolutePath,
          action: "skip",
          success: true,
          verified: true,
          previousHash: null,
          currentHash: null,
        });
        continue;
      }

      if (entry.previousContent === null) {
        continue;
      }

      await mkdir(path.dirname(absolutePath), { recursive: true });
      await writeFile(absolutePath, entry.previousContent, "utf8");

      const currentHash = await this.integrity.hashFile(absolutePath);
      const verified = currentHash === entry.previousHash;

      results.push({
        relativePath: entry.relativePath,
        absolutePath,
        action: "overwrite",
        success: verified,
        verified,
        previousHash: entry.previousHash,
        currentHash,
      });
    }

    return results;
  }
}
