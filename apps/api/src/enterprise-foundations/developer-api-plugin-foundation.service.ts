import { Injectable } from "@nestjs/common";
import { randomUUID } from "node:crypto";
import { DeveloperAsset } from "./enterprise-foundations.types";

@Injectable()
export class DeveloperApiPluginFoundationService {
  private readonly assets = new Map<string, DeveloperAsset>();

  register(
    input: Omit<DeveloperAsset, "id" | "status" | "createdAt" | "updatedAt">,
  ): DeveloperAsset {
    const now = new Date().toISOString();

    const asset: DeveloperAsset = {
      ...input,
      id: randomUUID(),
      status: "DRAFT",
      metadata: { ...input.metadata },
      createdAt: now,
      updatedAt: now,
    };

    this.assets.set(asset.id, asset);
    return this.clone(asset);
  }

  publish(id: string): DeveloperAsset {
    const asset = this.requireAsset(id);

    asset.status = "PUBLISHED";
    asset.updatedAt = new Date().toISOString();

    this.assets.set(id, asset);
    return this.clone(asset);
  }

  dashboard() {
    const assets = Array.from(this.assets.values());

    return {
      assets: assets.length,
      apis: assets.filter((item) => item.type === "API").length,
      sdks: assets.filter((item) => item.type === "SDK").length,
      plugins: assets.filter((item) => item.type === "PLUGIN").length,
      connectors: assets.filter(
        (item) => item.type === "CONNECTOR",
      ).length,
      webhooks: assets.filter((item) => item.type === "WEBHOOK").length,
      blueprints: assets.filter(
        (item) => item.type === "BLUEPRINT",
      ).length,
      published: assets.filter(
        (item) => item.status === "PUBLISHED",
      ).length,
      generatedAt: new Date().toISOString(),
    };
  }

  private requireAsset(id: string): DeveloperAsset {
    const asset = this.assets.get(id);

    if (!asset) {
      throw new Error(`Developer asset not found: ${id}`);
    }

    return asset;
  }

  private clone(asset: DeveloperAsset): DeveloperAsset {
    return {
      ...asset,
      metadata: { ...asset.metadata },
    };
  }
}