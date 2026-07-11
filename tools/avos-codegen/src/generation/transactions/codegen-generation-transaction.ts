import {
  createHash,
  randomUUID,
} from "node:crypto";
import {
  mkdir,
  readFile,
  rm,
  writeFile,
} from "node:fs/promises";
import {
  dirname,
} from "node:path";
import {
  CodeGenGenerationTransactionSnapshot,
  CodeGenTransactionOperation,
  CodeGenTransactionOperationType,
} from "../codegen-generation.contracts";

export class CodeGenGenerationTransaction {
  readonly id =
    randomUUID();

  private readonly operations:
    CodeGenTransactionOperation[] = [];

  private committed = false;
  private committedAt:
    string | undefined;

  readonly createdAt =
    new Date().toISOString();

  constructor(
    readonly sessionId: string,
  ) {}

  async stageWrite(
    input: {
      artifactKey: string;
      absolutePath: string;
      content: string;
    },
  ): Promise<
    CodeGenTransactionOperation
  > {
    let beforeExists = false;
    let beforeContent:
      string | undefined;

    try {
      beforeContent =
        await readFile(
          input.absolutePath,
          "utf8",
        );
      beforeExists = true;
    } catch {
      beforeExists = false;
    }

    const operation:
      CodeGenTransactionOperation = {
      id: randomUUID(),
      type:
        beforeExists
          ? CodeGenTransactionOperationType.UPDATE_FILE
          : CodeGenTransactionOperationType.CREATE_FILE,
      artifactKey:
        input.artifactKey,
      absolutePath:
        input.absolutePath,
      beforeExists,
      ...(beforeContent !== undefined
        ? {
            beforeContent,
            checksumBefore:
              this.hash(
                beforeContent,
              ),
          }
        : {}),
      afterContent:
        input.content,
      checksumAfter:
        this.hash(
          input.content,
        ),
      executed: false,
      rolledBack: false,
      createdAt:
        new Date().toISOString(),
    };

    this.operations.push(
      operation,
    );

    return structuredClone(operation);
  }

  async execute():
    Promise<
      CodeGenTransactionOperation[]
    > {
    for (
      const operation of
      this.operations
    ) {
      if (
        operation.executed ||
        operation.afterContent ===
          undefined
      ) {
        continue;
      }

      await mkdir(
        dirname(
          operation.absolutePath,
        ),
        {
          recursive: true,
        },
      );

      await writeFile(
        operation.absolutePath,
        operation.afterContent,
        "utf8",
      );

      operation.executed = true;
      operation.executedAt =
        new Date().toISOString();
    }

    return this.list();
  }

  commit(): void {
    this.committed = true;
    this.committedAt =
      new Date().toISOString();
  }

  async rollback():
    Promise<
      CodeGenTransactionOperation[]
    > {
    for (
      const operation of
      [...this.operations].reverse()
    ) {
      if (
        !operation.executed ||
        operation.rolledBack
      ) {
        continue;
      }

      if (
        operation.beforeExists &&
        operation.beforeContent !==
          undefined
      ) {
        await mkdir(
          dirname(
            operation.absolutePath,
          ),
          {
            recursive: true,
          },
        );

        await writeFile(
          operation.absolutePath,
          operation.beforeContent,
          "utf8",
        );
      } else {
        await rm(
          operation.absolutePath,
          {
            force: true,
          },
        );
      }

      operation.rolledBack = true;
      operation.rolledBackAt =
        new Date().toISOString();
    }

    this.committed = false;
    this.committedAt = undefined;

    return this.list();
  }

  list():
    CodeGenTransactionOperation[] {
    return this.operations.map(
      (operation) =>
        structuredClone(operation),
    );
  }

  snapshot():
    CodeGenGenerationTransactionSnapshot {
    return {
      id: this.id,
      sessionId:
        this.sessionId,
      operations:
        this.operations.length,
      executed:
        this.operations.filter(
          (operation) =>
            operation.executed,
        ).length,
      rolledBack:
        this.operations.filter(
          (operation) =>
            operation.rolledBack,
        ).length,
      committed:
        this.committed,
      createdAt:
        this.createdAt,
      ...(this.committedAt
        ? {
            committedAt:
              this.committedAt,
          }
        : {}),
      generatedAt:
        new Date().toISOString(),
    };
  }

  private hash(
    content: string,
  ): string {
    return createHash("sha256")
      .update(content)
      .digest("hex");
  }
}

