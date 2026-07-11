import {
  hostname,
} from "node:os";
import {
  randomUUID,
} from "node:crypto";
import {
  mkdir,
  readFile,
  rm,
  writeFile,
} from "node:fs/promises";
import {
  join,
  resolve,
} from "node:path";
import {
  CodeGenValidationError,
} from "../../core/codegen.errors";
import {
  CodeGenWorkspaceLock,
} from "../codegen-output.contracts";

export class CodeGenWorkspaceLockManager {
  async acquire(
    workspaceRoot: string,
    ttlMs = 10 * 60 * 1000,
  ): Promise<CodeGenWorkspaceLock> {
    const root =
      resolve(workspaceRoot);

    const lockDirectory =
      join(
        root,
        ".avos-codegen",
      );

    const lockPath =
      join(
        lockDirectory,
        "workspace.lock.json",
      );

    await mkdir(
      lockDirectory,
      {
        recursive: true,
      },
    );

    const existing =
      await this.read(lockPath);

    if (existing) {
      const expired =
        Date.parse(
          existing.expiresAt,
        ) <= Date.now();

      if (!expired) {
        throw new CodeGenValidationError(
          `Workspace is locked by process ${existing.processId} on ${existing.hostname}`,
        );
      }

      await rm(
        lockPath,
        {
          force: true,
        },
      );
    }

    const acquiredAt =
      new Date();

    const lock:
      CodeGenWorkspaceLock = {
      id: randomUUID(),
      workspaceRoot: root,
      lockPath,
      processId:
        process.pid,
      hostname:
        hostname(),
      acquiredAt:
        acquiredAt.toISOString(),
      expiresAt:
        new Date(
          acquiredAt.getTime() +
          ttlMs,
        ).toISOString(),
      metadata: {
        runtime:
          "AVOS CodeGen OS",
      },
    };

    await writeFile(
      lockPath,
      JSON.stringify(
        lock,
        null,
        2,
      ),
      {
        encoding: "utf8",
        flag: "wx",
      },
    );

    return lock;
  }

  async release(
    lock:
      CodeGenWorkspaceLock,
  ): Promise<void> {
    const current =
      await this.read(
        lock.lockPath,
      );

    if (
      current &&
      current.id !== lock.id
    ) {
      throw new CodeGenValidationError(
        "Workspace lock ownership mismatch",
      );
    }

    await rm(
      lock.lockPath,
      {
        force: true,
      },
    );
  }

  private async read(
    lockPath: string,
  ): Promise<
    CodeGenWorkspaceLock | undefined
  > {
    try {
      const raw =
        await readFile(
          lockPath,
          "utf8",
        );

      return JSON.parse(
        raw,
      ) as CodeGenWorkspaceLock;
    } catch {
      return undefined;
    }
  }
}
