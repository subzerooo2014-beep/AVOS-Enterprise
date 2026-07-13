import { Injectable, OnModuleInit } from "@nestjs/common";
import { promises as fs } from "node:fs";
import * as path from "node:path";
import { VehicleLifecycleRecord } from "./vehicle-lifecycle.types";

@Injectable()
export class VehicleLifecycleStoreService implements OnModuleInit {
  private readonly records = new Map<string, VehicleLifecycleRecord>();
  private readonly filePath = path.join(
    process.cwd(),
    "runtime-data",
    "vehicle-intelligence-lifecycle.json",
  );

  async onModuleInit(): Promise<void> {
    await this.load();
  }

  private async load(): Promise<void> {
    try {
      const raw = await fs.readFile(this.filePath, "utf8");
      const parsed = JSON.parse(raw) as VehicleLifecycleRecord[];

      for (const record of parsed) {
        this.records.set(record.id, record);
      }
    } catch (error) {
      const code =
        error && typeof error === "object" && "code" in error
          ? String((error as { code?: unknown }).code)
          : "";

      if (code !== "ENOENT") {
        throw error;
      }

      await this.persist();
    }
  }

  private async persist(): Promise<void> {
    await fs.mkdir(path.dirname(this.filePath), { recursive: true });
    await fs.writeFile(
      this.filePath,
      JSON.stringify(this.list(), null, 2),
      "utf8",
    );
  }

  async save(record: VehicleLifecycleRecord): Promise<VehicleLifecycleRecord> {
    this.records.set(record.id, record);
    await this.persist();
    return record;
  }

  get(id: string): VehicleLifecycleRecord | undefined {
    return this.records.get(id);
  }

  list(): VehicleLifecycleRecord[] {
    return [...this.records.values()].sort((a, b) =>
      b.createdAt.localeCompare(a.createdAt),
    );
  }
}
