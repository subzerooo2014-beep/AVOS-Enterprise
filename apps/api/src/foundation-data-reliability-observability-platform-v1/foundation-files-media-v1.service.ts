import { Injectable } from "@nestjs/common";
import { FoundationStorageV1Service } from "./foundation-storage-v1.service";
import type { FoundationMediaAssetV1 } from "./foundation-data-reliability-observability-v1.types";

@Injectable()
export class FoundationFilesMediaV1Service {
  private readonly assets = new Map<string, FoundationMediaAssetV1>();

  constructor(private readonly storage: FoundationStorageV1Service) {}

  create(
    filename: string,
    mimeType: string,
    content: string,
    tags: string[] = [],
  ): FoundationMediaAssetV1 {
    const id = `media-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
    const storageObject = this.storage.put(
      "media",
      id,
      mimeType,
      content,
      { filename },
    );

    const asset: FoundationMediaAssetV1 = {
      id,
      filename,
      mimeType,
      size: storageObject.size,
      storageObjectId: storageObject.id,
      tags: [...tags],
      createdAt: new Date().toISOString(),
    };

    this.assets.set(asset.id, asset);
    return this.clone(asset);
  }

  list(): FoundationMediaAssetV1[] {
    return Array.from(this.assets.values()).map((item) => this.clone(item));
  }

  count(): number {
    return this.assets.size;
  }

  private clone(item: FoundationMediaAssetV1): FoundationMediaAssetV1 {
    return { ...item, tags: [...item.tags] };
  }
}
