import { Injectable } from "@nestjs/common";
import { DataCatalogService } from "./data-catalog.service";
import type { DataLineageRecord } from "./enterprise-data-foundation.types";

@Injectable()
export class DataLineageService {
  private readonly links = new Map<string, DataLineageRecord>();

  constructor(private readonly catalog: DataCatalogService) {}

  connect(
    input: Omit<DataLineageRecord, "id" | "createdAt"> & { id?: string },
  ): DataLineageRecord {
    this.catalog.get(input.sourceAssetId);
    this.catalog.get(input.targetAssetId);

    const link: DataLineageRecord = {
      sourceAssetId: input.sourceAssetId,
      targetAssetId: input.targetAssetId,
      transformation: input.transformation,
      id:
        input.id ??
        `lineage-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`,
      createdAt: new Date().toISOString(),
    };

    this.links.set(link.id, link);
    return { ...link };
  }

  upstream(assetId: string): DataLineageRecord[] {
    return this.list().filter((link) => link.targetAssetId === assetId);
  }

  downstream(assetId: string): DataLineageRecord[] {
    return this.list().filter((link) => link.sourceAssetId === assetId);
  }

  list(): DataLineageRecord[] {
    return Array.from(this.links.values()).map((link) => ({ ...link }));
  }

  count(): number {
    return this.links.size;
  }
}
