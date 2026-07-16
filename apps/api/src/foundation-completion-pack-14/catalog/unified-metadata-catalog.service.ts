import {
  Injectable,
  NotFoundException
} from "@nestjs/common";
import {
  MetadataAssetType,
  MetadataSensitivity,
  MetadataStatus,
  UnifiedMetadataRecord
} from "../foundation-pack-14.types";
import { MetadataAuditService } from "../observability/metadata-audit.service";

@Injectable()
export class UnifiedMetadataCatalogService {
  private readonly records =
    new Map<string, UnifiedMetadataRecord>();

  constructor(
    private readonly audit: MetadataAuditService
  ) {}

  list() {
    return Array.from(this.records.values());
  }

  get(id: string) {
    const record = this.records.get(id);

    if (!record) {
      throw new NotFoundException(
        `Metadata record not found: ${id}`
      );
    }

    return record;
  }

  byAsset(assetId: string) {
    return this.list().filter(
      (record) => record.assetId === assetId
    );
  }

  register(input: {
    id?: string;
    assetId: string;
    assetType: MetadataAssetType;
    canonicalName: string;
    displayName: string;
    description: string;
    version: string;
    schemaVersion: string;
    sensitivity: MetadataSensitivity;
    domain: string;
    sourceSystem: string;
    ownerIdentityId: string;
    tags?: string[];
    classifications?: string[];
    attributes?: Record<string, unknown>;
    confidence?: number;
    correlationId: string;
    actorIdentityId: string;
  }) {
    const now = new Date().toISOString();

    const record: UnifiedMetadataRecord = {
      id:
        input.id ??
        `unified-metadata:${input.assetType}:${Date.now()}:${
          this.records.size + 1
        }`,
      assetId: input.assetId,
      assetType: input.assetType,
      canonicalName: input.canonicalName.trim(),
      displayName: input.displayName.trim(),
      description: input.description.trim(),
      version: input.version,
      schemaVersion: input.schemaVersion,
      status: "active",
      sensitivity: input.sensitivity,
      domain: input.domain,
      sourceSystem: input.sourceSystem,
      ownerIdentityId: input.ownerIdentityId,
      tags: Array.from(new Set(input.tags ?? [])),
      classifications: Array.from(
        new Set(input.classifications ?? [])
      ),
      attributes: input.attributes ?? {},
      qualityScore: 0,
      confidence: this.clamp(input.confidence ?? 100),
      createdAt: now,
      updatedAt: now
    };

    this.records.set(record.id, record);

    this.audit.record({
      correlationId: input.correlationId,
      category: "catalog",
      action: "metadata-record-registered",
      subjectId: record.id,
      actorIdentityId: input.actorIdentityId,
      outcome: "success",
      metadata: {
        assetId: record.assetId,
        assetType: record.assetType,
        domain: record.domain
      }
    });

    return record;
  }

  update(
    id: string,
    patch: {
      displayName?: string;
      description?: string;
      version?: string;
      schemaVersion?: string;
      status?: MetadataStatus;
      sensitivity?: MetadataSensitivity;
      domain?: string;
      sourceSystem?: string;
      ownerIdentityId?: string;
      tags?: string[];
      classifications?: string[];
      attributes?: Record<string, unknown>;
      qualityScore?: number;
      confidence?: number;
    },
    context: {
      actorIdentityId: string;
      correlationId: string;
    }
  ) {
    const current = this.get(id);

    const updated: UnifiedMetadataRecord = {
      ...current,
      ...patch,
      tags:
        patch.tags === undefined
          ? current.tags
          : Array.from(new Set(patch.tags)),
      classifications:
        patch.classifications === undefined
          ? current.classifications
          : Array.from(new Set(patch.classifications)),
      attributes: {
        ...current.attributes,
        ...(patch.attributes ?? {})
      },
      qualityScore:
        patch.qualityScore === undefined
          ? current.qualityScore
          : this.clamp(patch.qualityScore),
      confidence:
        patch.confidence === undefined
          ? current.confidence
          : this.clamp(patch.confidence),
      updatedAt: new Date().toISOString()
    };

    this.records.set(id, updated);

    this.audit.record({
      correlationId: context.correlationId,
      category: "catalog",
      action: "metadata-record-updated",
      subjectId: id,
      actorIdentityId: context.actorIdentityId,
      outcome: "success",
      metadata: {
        assetId: updated.assetId,
        qualityScore: updated.qualityScore
      }
    });

    return updated;
  }

  resolveByCanonicalName(
    canonicalName: string,
    assetType?: MetadataAssetType
  ) {
    const normalized =
      canonicalName.trim().toLowerCase();

    return this.list().find(
      (record) =>
        record.canonicalName.toLowerCase() === normalized &&
        (!assetType || record.assetType === assetType)
    );
  }

  summary() {
    const records = this.list();

    return {
      total: records.length,
      active: records.filter(
        (record) => record.status === "active"
      ).length,
      classified: records.filter(
        (record) => record.classifications.length > 0
      ).length,
      highQuality: records.filter(
        (record) => record.qualityScore >= 80
      ).length,
      restricted: records.filter(
        (record) => record.sensitivity === "restricted"
      ).length
    };
  }

  private clamp(value: number) {
    return Math.max(0, Math.min(100, Number(value.toFixed(2))));
  }
}
