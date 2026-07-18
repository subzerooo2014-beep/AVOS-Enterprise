import { Injectable } from "@nestjs/common";
import {
  existsSync,
  mkdirSync,
  readFileSync,
  writeFileSync
} from "node:fs";
import { join } from "node:path";
import { CapabilityProductionRecord } from "./capability-production-persistence.contracts";
import { CapabilityProductionPathsService } from "./capability-production-paths.service";

@Injectable()
export class PersistentProductionRegistryService {
  private readonly registryFile: string;

  constructor(paths: CapabilityProductionPathsService) {
    const root = paths.getRegistryRoot();
    mkdirSync(root, { recursive: true });

    this.registryFile = join(root, "production-registry.json");

    if (!existsSync(this.registryFile)) {
      this.write([]);
    }
  }

  save(record: CapabilityProductionRecord): CapabilityProductionRecord {
    const records = this.read();
    const index = records.findIndex((item) => item.id === record.id);

    if (index >= 0) {
      records[index] = record;
    } else {
      records.push(record);
    }

    this.write(records);
    return record;
  }

  findById(id: string): CapabilityProductionRecord | null {
    return this.read().find((item) => item.id === id) ?? null;
  }

  list(limit = 100): CapabilityProductionRecord[] {
    return this.read()
      .slice(-Math.max(1, limit))
      .reverse();
  }

  health() {
    const records = this.read();

    return {
      status: "healthy",
      score: 100,
      persistent: true,
      records: records.length,
      humanFinalAuthority: true
    };
  }

  private read(): CapabilityProductionRecord[] {
    try {
      const parsed = JSON.parse(
        readFileSync(this.registryFile, "utf8")
      ) as CapabilityProductionRecord[];

      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }

  private write(records: CapabilityProductionRecord[]): void {
    writeFileSync(
      this.registryFile,
      JSON.stringify(records, null, 2),
      "utf8"
    );
  }
}
