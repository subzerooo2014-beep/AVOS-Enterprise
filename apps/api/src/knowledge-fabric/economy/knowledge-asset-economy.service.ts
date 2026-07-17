import { Injectable, NotFoundException } from "@nestjs/common";
import { randomUUID } from "node:crypto";
import { KnowledgeEconomicAsset } from "./knowledge-economy.types";

@Injectable()
export class KnowledgeAssetEconomyService {
  private readonly assets = new Map<string, KnowledgeEconomicAsset>();

  registerAsset(input: Omit<KnowledgeEconomicAsset, "id" | "state" | "createdAt" | "updatedAt">): KnowledgeEconomicAsset {
    const now = new Date().toISOString();
    const asset: KnowledgeEconomicAsset = { ...input, id: randomUUID(), state: "DRAFT", createdAt: now, updatedAt: now };
    this.assets.set(asset.id, asset);
    return structuredClone(asset);
  }

  activateAsset(id: string): KnowledgeEconomicAsset {
    const asset = this.require(id);
    asset.state = "ACTIVE";
    asset.updatedAt = new Date().toISOString();
    return structuredClone(asset);
  }

  freezeAsset(id: string): KnowledgeEconomicAsset {
    const asset = this.require(id);
    asset.state = "FROZEN";
    asset.updatedAt = new Date().toISOString();
    return structuredClone(asset);
  }

  valueAsset(id: string): number {
    const asset = this.require(id);
    const multiplier = 0.30 * asset.qualityScore + 0.25 * asset.reuseScore + 0.25 * asset.impactScore + 0.20 * asset.scarcityScore;
    return Number((asset.unitValue * Math.max(0.1, multiplier / 100)).toFixed(2));
  }

  listAssets(): KnowledgeEconomicAsset[] { return [...this.assets.values()].map((asset) => structuredClone(asset)); }
  getAsset(id: string): KnowledgeEconomicAsset { return structuredClone(this.require(id)); }

  private require(id: string): KnowledgeEconomicAsset {
    const asset = this.assets.get(id);
    if (!asset) throw new NotFoundException(`Knowledge economy asset ${id} was not found.`);
    return asset;
  }
}