import {
  Injectable,
  Logger,
  OnModuleInit,
} from "@nestjs/common";
import { promises as fs } from "node:fs";
import * as path from "node:path";

@Injectable()
export class MegaPack6StorageService
  implements OnModuleInit
{
  private readonly logger = new Logger(
    MegaPack6StorageService.name,
  );

  private readonly root = path.resolve(
    process.cwd(),
    "storage",
    "production-hardening-v7-mega-pack-6",
  );

  private writeQueue: Promise<void> =
    Promise.resolve();

  async onModuleInit(): Promise<void> {
    await fs.mkdir(this.root, {
      recursive: true,
    });
  }

  async readCollection<T>(
    collection: string,
  ): Promise<T[]> {
    await fs.mkdir(this.root, {
      recursive: true,
    });

    const filePath =
      this.collectionPath(collection);

    try {
      const raw = await fs.readFile(
        filePath,
        "utf8",
      );

      const normalized = raw
        .replace(/^\uFEFF/, "")
        .replace(/^\uFFFE/, "")
        .trim();

      if (!normalized) {
        await this.writeCollection(
          collection,
          [],
        );

        return [];
      }

      const parsed =
        JSON.parse(normalized) as unknown;

      if (!Array.isArray(parsed)) {
        await this.backupInvalidFile(
          collection,
          filePath,
        );

        await this.writeCollection(
          collection,
          [],
        );

        return [];
      }

      return parsed as T[];
    } catch (error) {
      if (this.isMissingFile(error)) {
        await this.writeCollection(
          collection,
          [],
        );

        return [];
      }

      if (error instanceof SyntaxError) {
        this.logger.error(
          `Invalid JSON in collection ${collection}. Resetting safely.`,
        );

        await this.backupInvalidFile(
          collection,
          filePath,
        );

        await this.writeCollection(
          collection,
          [],
        );

        return [];
      }

      throw error;
    }
  }

  async writeCollection<T>(
    collection: string,
    records: T[],
  ): Promise<void> {
    this.writeQueue = this.writeQueue.then(
      async () => {
        await fs.mkdir(this.root, {
          recursive: true,
        });

        const destination =
          this.collectionPath(collection);

        const temporary =
          `${destination}.${process.pid}.${Date.now()}.tmp`;

        const payload =
          JSON.stringify(records, null, 2);

        await fs.writeFile(
          temporary,
          payload,
          "utf8",
        );

        try {
          await fs.rename(
            temporary,
            destination,
          );
        } catch {
          await fs.copyFile(
            temporary,
            destination,
          );

          await fs.unlink(temporary);
        }
      },
    );

    return this.writeQueue;
  }

  async append<T>(
    collection: string,
    record: T,
  ): Promise<T> {
    const records =
      await this.readCollection<T>(
        collection,
      );

    records.push(record);

    await this.writeCollection(
      collection,
      records,
    );

    return record;
  }

  async findById<T extends { id: string }>(
    collection: string,
    id: string,
  ): Promise<T | null> {
    const records =
      await this.readCollection<T>(
        collection,
      );

    return (
      records.find(
        (record) => record.id === id,
      ) ?? null
    );
  }

  async replaceById<T extends { id: string }>(
    collection: string,
    id: string,
    replacement: T,
  ): Promise<T | null> {
    const records =
      await this.readCollection<T>(
        collection,
      );

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

  async mutateCollection<T>(
    collection: string,
    mutator: (
      records: T[],
    ) => Promise<T[]> | T[],
  ): Promise<T[]> {
    const records =
      await this.readCollection<T>(
        collection,
      );

    const updated =
      await mutator(records);

    await this.writeCollection(
      collection,
      updated,
    );

    return updated;
  }

  async count(
    collection: string,
  ): Promise<number> {
    const records =
      await this.readCollection(collection);

    return records.length;
  }

  async ensureCollections(
    collections: string[],
  ): Promise<void> {
    for (const collection of collections) {
      const filePath =
        this.collectionPath(collection);

      try {
        await fs.access(filePath);
      } catch {
        await this.writeCollection(
          collection,
          [],
        );
      }
    }
  }

  private collectionPath(
    collection: string,
  ): string {
    const safe = collection.replace(
      /[^a-zA-Z0-9-_]/g,
      "_",
    );

    return path.join(
      this.root,
      `${safe}.json`,
    );
  }

  private async backupInvalidFile(
    collection: string,
    filePath: string,
  ): Promise<void> {
    try {
      const backupPath = path.join(
        this.root,
        `${collection}.invalid.${Date.now()}.json`,
      );

      await fs.copyFile(
        filePath,
        backupPath,
      );
    } catch (error) {
      this.logger.error(
        `Failed to backup invalid collection ${collection}`,
        error instanceof Error
          ? error.stack
          : String(error),
      );
    }
  }

  private isMissingFile(
    error: unknown,
  ): boolean {
    return (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      (error as { code?: string })
        .code === "ENOENT"
    );
  }
}
