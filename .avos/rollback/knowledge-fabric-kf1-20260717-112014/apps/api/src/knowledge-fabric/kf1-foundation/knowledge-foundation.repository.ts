import { Injectable } from "@nestjs/common";
import {
  CreateKnowledgeAssetInput,
  KnowledgeAsset,
} from "./knowledge-foundation.types";

@Injectable()
export class KnowledgeFoundationRepository {
  private readonly assets = new Map<string, KnowledgeAsset>();

  create(input: CreateKnowledgeAssetInput): KnowledgeAsset {
    const existing = this.findByKey(input.key);
    if (existing) {
      return existing;
    }

    const now = new Date().toISOString();
    const asset: KnowledgeAsset = {
      id: `knowledge:${input.key}:${Date.now()}`,
      key: input.key,
      title: input.title,
      summary: input.summary,
      status: input.status ?? "active",
      version: 1,
      metadata: input.metadata ?? {},
      createdAt: now,
      updatedAt: now,
    };

    this.assets.set(asset.id, asset);
    return asset;
  }

  findAll(): KnowledgeAsset[] {
    return Array.from(this.assets.values()).sort((a, b) =>
      a.key.localeCompare(b.key),
    );
  }

  findById(id: string): KnowledgeAsset | undefined {
    return this.assets.get(id);
  }

  findByKey(key: string): KnowledgeAsset | undefined {
    return this.findAll().find((asset) => asset.key === key);
  }

  count(): number {
    return this.assets.size;
  }
}