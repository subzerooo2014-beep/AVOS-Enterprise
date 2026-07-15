import { Injectable } from "@nestjs/common";
import { randomUUID } from "node:crypto";
import { DataAssetRegistration } from "./enterprise-foundations.types";

@Injectable()
export class DataAiFoundationService {
  private readonly assets = new Map<string, DataAssetRegistration>();

  registerAsset(
    input: Omit<DataAssetRegistration, "id" | "createdAt" | "updatedAt">,
  ): DataAssetRegistration {
    if (input.qualityScore < 0 || input.qualityScore > 100) {
      throw new Error("qualityScore must be between 0 and 100");
    }

    const now = new Date().toISOString();

    const asset: DataAssetRegistration = {
      ...input,
      id: randomUUID(),
      lineage: [...input.lineage],
      metadata: { ...input.metadata },
      createdAt: now,
      updatedAt: now,
    };

    this.assets.set(asset.id, asset);
    return this.clone(asset);
  }

  updateQuality(id: string, qualityScore: number): DataAssetRegistration {
    const asset = this.requireAsset(id);

    if (qualityScore < 0 || qualityScore > 100) {
      throw new Error("qualityScore must be between 0 and 100");
    }

    asset.qualityScore = qualityScore;
    asset.updatedAt = new Date().toISOString();
    this.assets.set(id, asset);

    return this.clone(asset);
  }

  dashboard() {
    const assets = Array.from(this.assets.values());

    return {
      assets: assets.length,
      datasets: assets.filter((item) => item.type === "DATASET").length,
      models: assets.filter((item) => item.type === "MODEL").length,
      features: assets.filter((item) => item.type === "FEATURE").length,
      knowledgeGraphs: assets.filter(
        (item) => item.type === "KNOWLEDGE_GRAPH",
      ).length,
      averageQuality:
        assets.length === 0
          ? 0
          : Number(
              (
                assets.reduce(
                  (sum, item) => sum + item.qualityScore,
                  0,
                ) / assets.length
              ).toFixed(2),
            ),
      generatedAt: new Date().toISOString(),
    };
  }

  private requireAsset(id: string): DataAssetRegistration {
    const asset = this.assets.get(id);

    if (!asset) {
      throw new Error(`Data asset not found: ${id}`);
    }

    return asset;
  }

  private clone(asset: DataAssetRegistration): DataAssetRegistration {
    return {
      ...asset,
      lineage: [...asset.lineage],
      metadata: { ...asset.metadata },
    };
  }
}