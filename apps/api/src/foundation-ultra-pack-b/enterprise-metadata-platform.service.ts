import { Injectable } from "@nestjs/common";
import {
  AuditRecord,
  MetadataRecord,
} from "./foundation-ultra-pack-b.types";
import { FoundationUltraPackBFileStoreService } from "./foundation-ultra-pack-b-file-store.service";

@Injectable()
export class EnterpriseMetadataPlatformService {
  constructor(
    private readonly store: FoundationUltraPackBFileStoreService,
  ) {
    this.seed();
  }

  private now(): string {
    return new Date().toISOString();
  }

  private id(prefix: string): string {
    return `${prefix}:${Date.now()}:${Math.random().toString(36).slice(2, 8)}`;
  }

  private seed(): void {
    if (this.list().length > 0) {
      return;
    }

    const seeds: Array<Omit<MetadataRecord, "id" | "createdAt" | "updatedAt">> = [
      {
        assetId: "foundation:constitution",
        assetType: "foundation",
        canonicalName: "Digital Constitution Runtime",
        description: "Runtime constitutional authority for AVOS.",
        domain: "governance",
        owner: "AVOS",
        steward: "Foundation Governance",
        tags: ["foundation", "constitution", "governance"],
        classifications: ["core-foundation"],
        sensitivity: "internal",
        jurisdictionScope: ["global"],
        sourceSystem: "foundation-ultra-pack-a",
        version: "1.0.0",
        status: "active",
      },
      {
        assetId: "foundation:living-blueprint",
        assetType: "foundation",
        canonicalName: "Living Blueprint",
        description: "Continuously synchronized architectural source of truth.",
        domain: "architecture",
        owner: "AVOS",
        steward: "Architecture Governance",
        tags: ["blueprint", "architecture"],
        classifications: ["core-foundation"],
        sensitivity: "internal",
        jurisdictionScope: ["global"],
        sourceSystem: "foundation-ultra-pack-a",
        version: "1.0.0",
        status: "active",
      },
      {
        assetId: "foundation:metadata-platform",
        assetType: "foundation",
        canonicalName: "Enterprise Metadata Platform",
        description: "Canonical metadata registry for AVOS assets.",
        domain: "metadata",
        owner: "AVOS",
        steward: "Data Governance",
        tags: ["metadata", "registry", "governance"],
        classifications: ["core-foundation"],
        sensitivity: "internal",
        jurisdictionScope: ["global"],
        sourceSystem: "foundation-ultra-pack-b",
        version: "1.0.0",
        status: "active",
      },
    ];

    for (const seed of seeds) {
      this.create(seed, "system:seed");
    }
  }

  create(
    input: Omit<MetadataRecord, "id" | "createdAt" | "updatedAt">,
    actor = "human:khalifa",
  ): MetadataRecord {
    const timestamp = this.now();
    const record: MetadataRecord = {
      ...input,
      id: this.id("metadata"),
      createdAt: timestamp,
      updatedAt: timestamp,
    };

    this.store.writeJson(`metadata/${record.id}.json`, record);
    this.audit("metadata.created", actor, record.id, {
      assetId: record.assetId,
      canonicalName: record.canonicalName,
    });

    return record;
  }

  list(): MetadataRecord[] {
    return this.store
      .listJson<MetadataRecord>("metadata")
      .sort((a, b) => a.canonicalName.localeCompare(b.canonicalName));
  }

  findByAssetId(assetId: string): MetadataRecord | null {
    return this.list().find((record) => record.assetId === assetId) ?? null;
  }

  search(query: string): MetadataRecord[] {
    const normalized = query.trim().toLowerCase();

    if (!normalized) {
      return this.list();
    }

    return this.list().filter((record) => {
      const haystack = [
        record.assetId,
        record.assetType,
        record.canonicalName,
        record.description,
        record.domain,
        record.owner,
        record.steward,
        ...record.tags,
        ...record.classifications,
      ]
        .join(" ")
        .toLowerCase();

      return haystack.includes(normalized);
    });
  }

  validate(record: MetadataRecord): {
    valid: boolean;
    score: number;
    missing: string[];
  } {
    const required: Array<keyof MetadataRecord> = [
      "assetId",
      "assetType",
      "canonicalName",
      "description",
      "domain",
      "owner",
      "steward",
      "tags",
      "classifications",
      "sensitivity",
      "jurisdictionScope",
      "sourceSystem",
      "version",
      "status",
    ];

    const missing = required.filter((key) => {
      const value = record[key];

      if (value === null || value === undefined) {
        return true;
      }

      if (typeof value === "string") {
        return value.trim().length === 0;
      }

      return false;
    });

    const score = Math.round(
      ((required.length - missing.length) / required.length) * 100,
    );

    return {
      valid: missing.length === 0,
      score,
      missing: missing.map(String),
    };
  }

  private audit(
    action: string,
    actor: string,
    assetId: string,
    details: Record<string, unknown>,
  ): void {
    const record: AuditRecord = {
      id: this.id("audit"),
      action,
      actor,
      assetId,
      details,
      createdAt: this.now(),
    };

    this.store.writeJson(`audit/${record.id}.json`, record);
  }
}