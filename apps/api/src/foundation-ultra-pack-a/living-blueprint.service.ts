import { Injectable } from "@nestjs/common";
import {
  ArchitectureDriftRecord,
  BlueprintRecord,
} from "./foundation-ultra-pack-a.types";
import { FoundationFileStoreService } from "./foundation-file-store.service";

@Injectable()
export class LivingBlueprintService {
  constructor(private readonly store: FoundationFileStoreService) {}

  private now(): string {
    return new Date().toISOString();
  }

  private id(prefix: string): string {
    return `${prefix}:${Date.now()}:${Math.random().toString(36).slice(2, 8)}`;
  }

  create(
    input: Omit<BlueprintRecord, "id" | "createdAt" | "updatedAt">,
  ): BlueprintRecord {
    const timestamp = this.now();
    const record: BlueprintRecord = {
      ...input,
      id: this.id("blueprint"),
      createdAt: timestamp,
      updatedAt: timestamp,
    };
    this.store.writeJson(`blueprints/${record.id}.json`, record);
    return record;
  }

  list(): BlueprintRecord[] {
    return this.store.listJson<BlueprintRecord>("blueprints");
  }

  synchronize(
    blueprintId: string,
    runtimeAssets: string[],
  ): { blueprint: BlueprintRecord; drifts: ArchitectureDriftRecord[] } {
    const blueprint = this.list().find((item) => item.id === blueprintId);
    if (!blueprint) throw new Error(`Blueprint not found: ${blueprintId}`);

    const expected = new Set(blueprint.designedAssets);
    const actual = new Set(runtimeAssets);
    const drifts: ArchitectureDriftRecord[] = [];

    for (const asset of expected) {
      if (!actual.has(asset)) {
        drifts.push(this.recordDrift({
          blueprintId,
          severity: "high",
          category: "missing-runtime-asset",
          expected: asset,
          actual: null,
          resolved: false,
        }));
      }
    }

    for (const asset of actual) {
      if (!expected.has(asset)) {
        drifts.push(this.recordDrift({
          blueprintId,
          severity: "medium",
          category: "unexpected-runtime-asset",
          expected: null,
          actual: asset,
          resolved: false,
        }));
      }
    }

    const updated: BlueprintRecord = {
      ...blueprint,
      runtimeAssets: [...actual],
      updatedAt: this.now(),
    };
    this.store.writeJson(`blueprints/${updated.id}.json`, updated);
    return { blueprint: updated, drifts };
  }

  listDrifts(): ArchitectureDriftRecord[] {
    return this.store.listJson<ArchitectureDriftRecord>("drift");
  }

  resolveDrift(id: string, resolution: string): ArchitectureDriftRecord {
    const drift = this.listDrifts().find((item) => item.id === id);
    if (!drift) throw new Error(`Drift not found: ${id}`);
    const updated: ArchitectureDriftRecord = {
      ...drift,
      resolved: true,
      resolution,
      resolvedAt: this.now(),
    };
    this.store.writeJson(`drift/${updated.id}.json`, updated);
    return updated;
  }

  private recordDrift(
    input: Omit<ArchitectureDriftRecord, "id" | "detectedAt">,
  ): ArchitectureDriftRecord {
    const record: ArchitectureDriftRecord = {
      ...input,
      id: this.id("drift"),
      detectedAt: this.now(),
    };
    this.store.writeJson(`drift/${record.id}.json`, record);
    return record;
  }
}