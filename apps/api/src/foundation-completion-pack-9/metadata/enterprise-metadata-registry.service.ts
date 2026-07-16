import {
  Injectable,
  NotFoundException
} from "@nestjs/common";
import {
  MetadataAssetType,
  MetadataRecord
} from "../foundation-pack-9.types";
import { DigitalIdentityRegistryService } from "../identity/digital-identity-registry.service";
import { Foundation9AuditService } from "../observability/foundation-9-audit.service";

@Injectable()
export class EnterpriseMetadataRegistryService {
  private readonly records =
    new Map<string, MetadataRecord>();

  constructor(
    private readonly identities: DigitalIdentityRegistryService,
    private readonly audit: Foundation9AuditService
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
    version: string;
    purpose: string;
    description: string;
    tags?: string[];
    ownerIdentityId: string;
    lifecycleStage: string;
    domain: string;
    sensitivity:
      | "public"
      | "internal"
      | "confidential"
      | "restricted";
    sourceSystem: string;
    schemaVersion: string;
    attributes?: Record<string, unknown>;
    correlationId: string;
    actorIdentityId: string;
  }) {
    this.identities.get(input.ownerIdentityId);

    const now = new Date().toISOString();

    const record: MetadataRecord = {
      id:
        input.id ??
        `metadata:${input.assetType}:${Date.now()}:${
          this.records.size + 1
        }`,
      assetId: input.assetId,
      assetType: input.assetType,
      version: input.version,
      purpose: input.purpose,
      description: input.description,
      tags: Array.from(new Set(input.tags ?? [])),
      ownerIdentityId: input.ownerIdentityId,
      lifecycleStage: input.lifecycleStage,
      domain: input.domain,
      sensitivity: input.sensitivity,
      sourceSystem: input.sourceSystem,
      schemaVersion: input.schemaVersion,
      attributes: input.attributes ?? {},
      createdAt: now,
      updatedAt: now
    };

    this.records.set(record.id, record);

    this.audit.record({
      correlationId: input.correlationId,
      category: "metadata",
      action: "metadata-registered",
      subjectId: record.id,
      actorIdentityId: input.actorIdentityId,
      outcome: "success",
      metadata: {
        assetId: record.assetId,
        assetType: record.assetType,
        version: record.version
      }
    });

    return record;
  }

  update(
    id: string,
    patch: {
      version?: string;
      purpose?: string;
      description?: string;
      tags?: string[];
      lifecycleStage?: string;
      domain?: string;
      sensitivity?:
        | "public"
        | "internal"
        | "confidential"
        | "restricted";
      schemaVersion?: string;
      attributes?: Record<string, unknown>;
    },
    context: {
      correlationId: string;
      actorIdentityId: string;
    }
  ) {
    const current = this.get(id);

    const updated: MetadataRecord = {
      ...current,
      ...patch,
      tags:
        patch.tags === undefined
          ? current.tags
          : Array.from(new Set(patch.tags)),
      attributes: {
        ...current.attributes,
        ...(patch.attributes ?? {})
      },
      updatedAt: new Date().toISOString()
    };

    this.records.set(id, updated);

    this.audit.record({
      correlationId: context.correlationId,
      category: "metadata",
      action: "metadata-updated",
      subjectId: id,
      actorIdentityId: context.actorIdentityId,
      outcome: "success",
      metadata: {
        assetId: updated.assetId,
        version: updated.version
      }
    });

    return updated;
  }

  search(input: {
    assetType?: MetadataAssetType;
    domain?: string;
    tag?: string;
    lifecycleStage?: string;
  }) {
    return this.list().filter((record) => {
      if (
        input.assetType &&
        record.assetType !== input.assetType
      ) {
        return false;
      }

      if (
        input.domain &&
        record.domain.toLowerCase() !==
          input.domain.toLowerCase()
      ) {
        return false;
      }

      if (
        input.tag &&
        !record.tags.some(
          (tag) =>
            tag.toLowerCase() === input.tag?.toLowerCase()
        )
      ) {
        return false;
      }

      if (
        input.lifecycleStage &&
        record.lifecycleStage !== input.lifecycleStage
      ) {
        return false;
      }

      return true;
    });
  }

  summary() {
    const records = this.list();

    return {
      total: records.length,
      capabilities: records.filter(
        (record) => record.assetType === "capability"
      ).length,
      workflows: records.filter(
        (record) => record.assetType === "workflow"
      ).length,
      dataAssets: records.filter(
        (record) => record.assetType === "data"
      ).length,
      restricted: records.filter(
        (record) => record.sensitivity === "restricted"
      ).length
    };
  }
}
