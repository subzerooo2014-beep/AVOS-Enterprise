import { Injectable, Logger, OnModuleInit } from "@nestjs/common";
import { promises as fs } from "node:fs";
import * as path from "node:path";

@Injectable()
export class AssuranceStorageService implements OnModuleInit {
  private readonly logger = new Logger(AssuranceStorageService.name);

  private readonly storageDirectory = path.resolve(
    process.cwd(),
    "storage",
    "production-hardening-v7",
  );

  async onModuleInit(): Promise<void> {
    await this.ensureStorageDirectory();
  }

  async readCollection<T>(collection: string): Promise<T[]> {
    await this.ensureStorageDirectory();

    const filePath = this.getCollectionPath(collection);

    try {
      const raw = await fs.readFile(filePath, "utf8");

      const normalized = this.normalizeJsonContent(raw);

      if (!normalized) {
        await this.writeCollection(collection, []);
        return [];
      }

      const parsed = JSON.parse(normalized) as unknown;

      if (!Array.isArray(parsed)) {
        this.logger.warn(
          `Collection ${collection} did not contain an array. Resetting to an empty collection.`,
        );

        await this.writeCollection(collection, []);
        return [];
      }

      return parsed as T[];
    } catch (error) {
      if (this.isMissingFileError(error)) {
        await this.writeCollection(collection, []);
        return [];
      }

      if (error instanceof SyntaxError) {
        this.logger.error(
          `Invalid JSON detected in collection ${collection}. A backup will be created and the collection will be reset.`,
        );

        await this.backupCorruptedCollection(
          collection,
          filePath,
        );

        await this.writeCollection(collection, []);
        return [];
      }

      throw error;
    }
  }

  async writeCollection<T>(
    collection: string,
    records: T[],
  ): Promise<void> {
    await this.ensureStorageDirectory();

    const destination = this.getCollectionPath(collection);
    const temporary = `${destination}.${process.pid}.${Date.now()}.tmp`;
    const payload = JSON.stringify(records, null, 2);

    await fs.writeFile(
      temporary,
      payload,
      {
        encoding: "utf8",
      },
    );

    await fs.rename(temporary, destination);
  }

  async append<T>(
    collection: string,
    record: T,
  ): Promise<T> {
    const records = await this.readCollection<T>(collection);

    records.push(record);

    await this.writeCollection(
      collection,
      records,
    );

    return record;
  }

  async replaceById<T extends { id: string }>(
    collection: string,
    id: string,
    replacement: T,
  ): Promise<T | null> {
    const records = await this.readCollection<T>(collection);

    const index = records.findIndex(
      (record) => record.id === id,
    );

    if (index < 0) {
      return null;
    }

    records[index] = replacement;

    await this.writeCollection(
      collection,
      records,
    );

    return replacement;
  }

  async findById<T extends { id: string }>(
    collection: string,
    id: string,
  ): Promise<T | null> {
    const records = await this.readCollection<T>(collection);

    return (
      records.find(
        (record) => record.id === id,
      ) ?? null
    );
  }

  async removeById<T extends { id: string }>(
    collection: string,
    id: string,
  ): Promise<boolean> {
    const records = await this.readCollection<T>(collection);

    const filtered = records.filter(
      (record) => record.id !== id,
    );

    if (records.length === filtered.length) {
      return false;
    }

    await this.writeCollection(
      collection,
      filtered,
    );

    return true;
  }

  async collectionCount(
    collection: string,
  ): Promise<number> {
    const records =
      await this.readCollection(collection);

    return records.length;
  }

  private normalizeJsonContent(raw: string): string {
    return raw
      .replace(/^\uFEFF/, "")
      .replace(/^\uFFFE/, "")
      .trim();
  }

  private async ensureStorageDirectory(): Promise<void> {
    await fs.mkdir(
      this.storageDirectory,
      {
        recursive: true,
      },
    );
  }

  private getCollectionPath(
    collection: string,
  ): string {
    const safeCollection = collection.replace(
      /[^a-zA-Z0-9-_]/g,
      "_",
    );

    return path.join(
      this.storageDirectory,
      `${safeCollection}.json`,
    );
  }

  private async backupCorruptedCollection(
    collection: string,
    filePath: string,
  ): Promise<void> {
    try {
      const backupPath = path.join(
        this.storageDirectory,
        `${collection}.corrupted.${Date.now()}.json`,
      );

      await fs.copyFile(
        filePath,
        backupPath,
      );
    } catch (error) {
      this.logger.error(
        `Could not create backup for collection ${collection}`,
        error instanceof Error
          ? error.stack
          : String(error),
      );
    }
  }

  private isMissingFileError(
    error: unknown,
  ): boolean {
    return (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      (error as { code?: string }).code ===
        "ENOENT"
    );
  }
}
