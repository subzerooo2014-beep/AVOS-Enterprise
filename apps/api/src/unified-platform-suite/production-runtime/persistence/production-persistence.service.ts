import { Injectable, OnModuleInit } from "@nestjs/common";
import { promises as fs } from "fs";
import { dirname, join } from "path";
import { PersistedRecord, PersistenceEntity } from "../contracts/production-runtime.types";

interface PersistenceSnapshot {
  schemaVersion: number;
  records: PersistedRecord[];
  updatedAt: string;
}

@Injectable()
export class ProductionPersistenceService implements OnModuleInit {
  private readonly records = new Map<string, PersistedRecord>();
  private readonly storagePath =
    process.env.AVOS_UNIFIED_PLATFORM_STORAGE_PATH ??
    join(process.cwd(), ".avos", "runtime", "unified-platform", "production-store.json");
  private initialized = false;
  private writing: Promise<void> = Promise.resolve();

  async onModuleInit() {
    await this.initialize();
  }

  async initialize() {
    if (this.initialized) return this.status();
    await fs.mkdir(dirname(this.storagePath), { recursive: true });
    try {
      const raw = await fs.readFile(this.storagePath, "utf8");
      const snapshot = JSON.parse(raw) as PersistenceSnapshot;
      for (const record of snapshot.records ?? []) {
        this.records.set(this.key(record.entity, record.id), record);
      }
    } catch (error) {
      const code = (error as NodeJS.ErrnoException).code;
      if (code !== "ENOENT") throw error;
      await this.flush();
    }
    this.initialized = true;
    return this.status();
  }

  async upsert<T>(entity: PersistenceEntity, id: string, data: T) {
    await this.initialize();
    const now = new Date().toISOString();
    const existing = this.records.get(this.key(entity, id));
    const record: PersistedRecord<T> = {
      id,
      entity,
      version: (existing?.version ?? 0) + 1,
      data,
      createdAt: existing?.createdAt ?? now,
      updatedAt: now
    };
    this.records.set(this.key(entity, id), record);
    await this.flush();
    return record;
  }

  async get<T>(entity: PersistenceEntity, id: string) {
    await this.initialize();
    return (this.records.get(this.key(entity, id)) as PersistedRecord<T> | undefined) ?? null;
  }

  async list<T>(entity: PersistenceEntity) {
    await this.initialize();
    return [...this.records.values()].filter((record) => record.entity === entity) as PersistedRecord<T>[];
  }

  async remove(entity: PersistenceEntity, id: string) {
    await this.initialize();
    const removed = this.records.delete(this.key(entity, id));
    if (removed) await this.flush();
    return removed;
  }

  status() {
    return {
      initialized: this.initialized,
      driver: "durable-json",
      storagePath: this.storagePath,
      records: this.records.size,
      entities: [...new Set([...this.records.values()].map((item) => item.entity))].length,
      productionUpgradePath: "PostgreSQL/Prisma repository adapter"
    };
  }

  private key(entity: PersistenceEntity, id: string) {
    return `${entity}:${id}`;
  }

  private async flush() {
    const snapshot: PersistenceSnapshot = {
      schemaVersion: 1,
      records: [...this.records.values()],
      updatedAt: new Date().toISOString()
    };
    this.writing = this.writing.then(async () => {
      const temporaryPath = `${this.storagePath}.tmp`;
      await fs.writeFile(temporaryPath, JSON.stringify(snapshot, null, 2), "utf8");
      await fs.rename(temporaryPath, this.storagePath);
    });
    await this.writing;
  }
}