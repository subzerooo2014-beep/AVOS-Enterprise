import { Injectable, NotFoundException } from "@nestjs/common";
import type { DataAssetRecord } from "./enterprise-data-foundation.types";

@Injectable()
export class DataCatalogService {
  private readonly assets = new Map<string, DataAssetRecord>();

  upsert(
    input: Omit<DataAssetRecord, "version" | "createdAt" | "updatedAt">,
  ): DataAssetRecord {
    const existing = this.assets.get(input.id);
    const now = new Date().toISOString();

    const asset: DataAssetRecord = {
      ...input,
      schema: { ...input.schema },
      tags: [...input.tags],
      version: (existing?.version ?? 0) + 1,
      createdAt: existing?.createdAt ?? now,
      updatedAt: now,
    };

    this.assets.set(asset.id, asset);
    return this.clone(asset);
  }

  get(id: string): DataAssetRecord {
    const asset = this.assets.get(id);

    if (!asset) {
      throw new NotFoundException(`Data asset '${id}' was not found.`);
    }

    return this.clone(asset);
  }

  list(domain?: string): DataAssetRecord[] {
    return Array.from(this.assets.values())
      .filter((asset) => (domain ? asset.domain === domain : true))
      .map((asset) => this.clone(asset));
  }

  count(): number {
    return this.assets.size;
  }

  private clone(asset: DataAssetRecord): DataAssetRecord {
    return {
      ...asset,
      schema: { ...asset.schema },
      tags: [...asset.tags],
    };
  }
}
