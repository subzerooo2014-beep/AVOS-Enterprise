import { Injectable } from "@nestjs/common";
import {
  AssetIdentityRecord,
  DigitalDnaRecord,
  DigitalGenomeRecord,
} from "./foundation-ultra-pack-a.types";
import { FoundationFileStoreService } from "./foundation-file-store.service";

@Injectable()
export class DigitalIdentityFoundationService {
  constructor(private readonly store: FoundationFileStoreService) {}

  private now(): string {
    return new Date().toISOString();
  }

  private id(prefix: string): string {
    return `${prefix}:${Date.now()}:${Math.random().toString(36).slice(2, 8)}`;
  }

  createAssetIdentity(
    input: Omit<AssetIdentityRecord, "id" | "createdAt" | "updatedAt">,
  ): AssetIdentityRecord {
    const timestamp = this.now();
    const record: AssetIdentityRecord = {
      ...input,
      id: this.id("asset"),
      createdAt: timestamp,
      updatedAt: timestamp,
    };
    this.store.writeJson(`assets/${record.id}.json`, record);
    return record;
  }

  listAssetIdentities(): AssetIdentityRecord[] {
    return this.store.listJson<AssetIdentityRecord>("assets");
  }

  createDna(
    input: Omit<DigitalDnaRecord, "id" | "createdAt" | "updatedAt">,
  ): DigitalDnaRecord {
    const timestamp = this.now();
    const record: DigitalDnaRecord = {
      ...input,
      id: this.id("dna"),
      createdAt: timestamp,
      updatedAt: timestamp,
    };
    this.store.writeJson(`dna/${record.id}.json`, record);
    return record;
  }

  listDna(): DigitalDnaRecord[] {
    return this.store.listJson<DigitalDnaRecord>("dna");
  }

  createGenome(
    input: Omit<DigitalGenomeRecord, "id" | "createdAt" | "updatedAt">,
  ): DigitalGenomeRecord {
    const timestamp = this.now();
    const record: DigitalGenomeRecord = {
      ...input,
      id: this.id("genome"),
      createdAt: timestamp,
      updatedAt: timestamp,
    };
    this.store.writeJson(`genome/${record.id}.json`, record);
    return record;
  }

  listGenomes(): DigitalGenomeRecord[] {
    return this.store.listJson<DigitalGenomeRecord>("genome");
  }

  validateDna(record: DigitalDnaRecord): {
    valid: boolean;
    score: number;
    missing: string[];
  } {
    const required: Array<keyof DigitalDnaRecord> = [
      "assetId",
      "assetType",
      "purpose",
      "owner",
      "version",
      "lifecycle",
      "dependencies",
      "contracts",
      "policies",
      "permissions",
      "events",
      "metrics",
      "risks",
      "compliance",
      "trust",
      "certification",
      "evolutionHistory",
    ];
    const missing = required.filter((key) => {
      const value = record[key];
      if (value === null || value === undefined) return true;
      if (typeof value === "string") return value.trim().length === 0;
      return false;
    });
    const score = Math.round(((required.length - missing.length) / required.length) * 100);
    return { valid: missing.length === 0, score, missing: missing.map(String) };
  }

  buildGenomeSnapshot(name = "AVOS Enterprise Genome"): DigitalGenomeRecord {
    const assets = this.listAssetIdentities();
    const dnas = this.listDna();
    return this.createGenome({
      name,
      version: "1.0.0",
      assetIds: assets.map((asset) => asset.id),
      capabilityIds: assets.filter((asset) => asset.assetType === "capability").map((asset) => asset.id),
      platformIds: assets.filter((asset) => asset.assetType === "platform").map((asset) => asset.id),
      productIds: assets.filter((asset) => asset.assetType === "product").map((asset) => asset.id),
      dependencyEdges: dnas.flatMap((dna) =>
        dna.dependencies.map((dependency) => ({
          from: dna.assetId,
          to: dependency,
          type: "depends-on",
        })),
      ),
      constitutionalRuleIds: [],
    });
  }
}