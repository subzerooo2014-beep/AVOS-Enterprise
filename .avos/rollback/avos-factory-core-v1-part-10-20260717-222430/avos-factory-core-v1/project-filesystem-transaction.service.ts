import { Injectable } from "@nestjs/common";
import { createHash, randomUUID } from "crypto";
import {
  cp,
  mkdir,
  readFile,
  rename,
  rm,
  stat,
  writeFile
} from "fs/promises";
import { dirname, isAbsolute, relative, resolve } from "path";
import {
  ProjectFilesystemTransaction,
  ProjectFilesystemWriteRecord
} from "./project-execution.contracts";
import {
  ProjectArtifactKind,
  ProjectGenerationPlan,
  ProjectStructureNode
} from "./project-generator.contracts";
import {
  ProjectFilesystemBoundaryError,
  ProjectTargetExistsError,
  ProjectTransactionNotFoundError,
  ProjectTransactionStateError
} from "./project-execution.errors";

@Injectable()
export class ProjectFilesystemTransactionService {
  private readonly transactions =
    new Map<string, ProjectFilesystemTransaction>();

  async prepare(
    plan: ProjectGenerationPlan,
    projectRoot: string,
    options: {
      overwrite: boolean;
      dryRun: boolean;
    }
  ): Promise<ProjectFilesystemTransaction> {
    const root = resolve(projectRoot);
    const targetPath = this.resolveInside(root, plan.outputPath);
    const transactionId = randomUUID();
    const stagingPath = this.resolveInside(
      root,
      `.avos-staging/${transactionId}`
    );

    if (!options.dryRun) {
      await rm(stagingPath, { recursive: true, force: true });
      await mkdir(stagingPath, { recursive: true });
    }

    const transaction: ProjectFilesystemTransaction = {
      id: transactionId,
      planId: plan.id,
      projectId: plan.projectId,
      projectRoot: root,
      stagingPath,
      targetPath,
      status: "prepared",
      overwrite: options.overwrite,
      dryRun: options.dryRun,
      writes: [],
      createdAt: new Date().toISOString()
    };

    this.transactions.set(transactionId, transaction);
    return this.clone(transaction);
  }

  async writeStructure(
    transactionId: string,
    nodes: ProjectStructureNode[]
  ): Promise<ProjectFilesystemTransaction> {
    const transaction = this.requireMutable(transactionId);

    if (
      transaction.status !== "prepared" &&
      transaction.status !== "writing"
    ) {
      throw new ProjectTransactionStateError(
        transaction.id,
        transaction.status
      );
    }

    transaction.status = "writing";

    const orderedNodes = [...nodes].sort((left, right) => {
      if (left.kind === "directory" && right.kind !== "directory") return -1;
      if (left.kind !== "directory" && right.kind === "directory") return 1;
      return left.relativePath.localeCompare(right.relativePath);
    });

    for (const node of orderedNodes) {
      await this.writeNode(transaction, node);
    }

    transaction.status = "ready-to-commit";
    this.transactions.set(transaction.id, transaction);

    return this.clone(transaction);
  }

  async writeGeneratedFile(
    transactionId: string,
    relativePath: string,
    content: string,
    kind: ProjectArtifactKind = "configuration"
  ): Promise<ProjectFilesystemWriteRecord> {
    const transaction = this.requireMutable(transactionId);

    if (
      transaction.status !== "writing" &&
      transaction.status !== "ready-to-commit"
    ) {
      throw new ProjectTransactionStateError(
        transaction.id,
        transaction.status
      );
    }

    const absolutePath = this.resolveInside(
      transaction.stagingPath,
      relativePath
    );

    const payload = Buffer.from(content, "utf8");

    if (!transaction.dryRun) {
      await mkdir(dirname(absolutePath), { recursive: true });
      await writeFile(absolutePath, payload);
    }

    const record: ProjectFilesystemWriteRecord = {
      id: randomUUID(),
      kind,
      relativePath: this.normalizeRelative(relativePath),
      absolutePath,
      bytesWritten: payload.byteLength,
      checksum: this.checksum(payload),
      createdAt: new Date().toISOString()
    };

    transaction.writes.push(record);
    transaction.status = "ready-to-commit";
    this.transactions.set(transaction.id, transaction);

    return structuredClone(record);
  }

  async commit(
    transactionId: string
  ): Promise<ProjectFilesystemTransaction> {
    const transaction = this.requireMutable(transactionId);

    if (transaction.status !== "ready-to-commit") {
      throw new ProjectTransactionStateError(
        transaction.id,
        transaction.status
      );
    }

    if (transaction.dryRun) {
      transaction.status = "committed";
      transaction.committedAt = new Date().toISOString();
      this.transactions.set(transaction.id, transaction);
      return this.clone(transaction);
    }

    const targetExists = await this.exists(transaction.targetPath);

    if (targetExists && !transaction.overwrite) {
      throw new ProjectTargetExistsError(transaction.targetPath);
    }

    if (targetExists) {
      const backupPath = this.resolveInside(
        transaction.projectRoot,
        `.avos-project-backups/${transaction.id}`
      );

      await mkdir(dirname(backupPath), { recursive: true });
      await rm(backupPath, { recursive: true, force: true });
      await rename(transaction.targetPath, backupPath);
      transaction.backupPath = backupPath;
    }

    await mkdir(dirname(transaction.targetPath), { recursive: true });

    try {
      await rename(transaction.stagingPath, transaction.targetPath);
    } catch (error) {
      if (transaction.backupPath && await this.exists(transaction.backupPath)) {
        await rename(transaction.backupPath, transaction.targetPath);
        transaction.backupPath = undefined;
      }

      throw error;
    }

    transaction.status = "committed";
    transaction.committedAt = new Date().toISOString();
    this.transactions.set(transaction.id, transaction);

    return this.clone(transaction);
  }

  async rollback(
    transactionId: string
  ): Promise<ProjectFilesystemTransaction> {
    const transaction = this.requireMutable(transactionId);

    if (transaction.dryRun) {
      transaction.status = "rolled-back";
      transaction.rolledBackAt = new Date().toISOString();
      this.transactions.set(transaction.id, transaction);
      return this.clone(transaction);
    }

    if (transaction.status === "committed") {
      await rm(transaction.targetPath, { recursive: true, force: true });

      if (
        transaction.backupPath &&
        await this.exists(transaction.backupPath)
      ) {
        await mkdir(dirname(transaction.targetPath), { recursive: true });
        await rename(transaction.backupPath, transaction.targetPath);
      }
    } else {
      await rm(transaction.stagingPath, { recursive: true, force: true });
    }

    transaction.status = "rolled-back";
    transaction.rolledBackAt = new Date().toISOString();
    this.transactions.set(transaction.id, transaction);

    return this.clone(transaction);
  }

  async cleanupStaging(transactionId: string): Promise<void> {
    const transaction = this.requireMutable(transactionId);

    if (!transaction.dryRun) {
      await rm(transaction.stagingPath, { recursive: true, force: true });
    }
  }

  get(transactionId: string): ProjectFilesystemTransaction {
    const transaction = this.transactions.get(transactionId);

    if (!transaction) {
      throw new ProjectTransactionNotFoundError(transactionId);
    }

    return this.clone(transaction);
  }

  list(): ProjectFilesystemTransaction[] {
    return [...this.transactions.values()]
      .map((transaction) => this.clone(transaction));
  }

  private async writeNode(
    transaction: ProjectFilesystemTransaction,
    node: ProjectStructureNode
  ): Promise<void> {
    const absolutePath = this.resolveInside(
      transaction.stagingPath,
      node.relativePath
    );

    if (node.kind === "directory") {
      if (!transaction.dryRun) {
        await mkdir(absolutePath, { recursive: true });
      }

      transaction.writes.push({
        id: randomUUID(),
        kind: node.kind,
        relativePath: this.normalizeRelative(node.relativePath),
        absolutePath,
        bytesWritten: 0,
        checksum: this.checksum(Buffer.alloc(0)),
        createdAt: new Date().toISOString()
      });

      return;
    }

    const payload = Buffer.from(node.content ?? "", "utf8");

    if (!transaction.dryRun) {
      await mkdir(dirname(absolutePath), { recursive: true });
      await writeFile(absolutePath, payload);
    }

    transaction.writes.push({
      id: randomUUID(),
      kind: node.kind,
      relativePath: this.normalizeRelative(node.relativePath),
      absolutePath,
      bytesWritten: payload.byteLength,
      checksum: this.checksum(payload),
      createdAt: new Date().toISOString()
    });
  }

  private resolveInside(root: string, value: string): string {
    if (isAbsolute(value)) {
      throw new ProjectFilesystemBoundaryError(value);
    }

    const resolvedRoot = resolve(root);
    const candidate = resolve(resolvedRoot, value);
    const relation = relative(resolvedRoot, candidate);

    if (
      relation === ".." ||
      relation.startsWith(`..\\`) ||
      relation.startsWith("../") ||
      isAbsolute(relation)
    ) {
      throw new ProjectFilesystemBoundaryError(value);
    }

    return candidate;
  }

  private normalizeRelative(value: string): string {
    return value.replace(/\\/g, "/").replace(/^\/+/, "");
  }

  private checksum(content: Buffer): string {
    return createHash("sha256").update(content).digest("hex");
  }

  private async exists(path: string): Promise<boolean> {
    try {
      await stat(path);
      return true;
    } catch {
      return false;
    }
  }

  private requireMutable(
    transactionId: string
  ): ProjectFilesystemTransaction {
    const transaction = this.transactions.get(transactionId);

    if (!transaction) {
      throw new ProjectTransactionNotFoundError(transactionId);
    }

    return transaction;
  }

  private clone(
    transaction: ProjectFilesystemTransaction
  ): ProjectFilesystemTransaction {
    return structuredClone(transaction);
  }
}
