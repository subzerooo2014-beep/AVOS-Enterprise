import { Injectable } from "@nestjs/common";
import {
  MetadataAssetType,
  MetadataDiscoveryResult
} from "../foundation-pack-14.types";
import { MetadataAuditService } from "../observability/metadata-audit.service";

@Injectable()
export class MetadataDiscoveryService {
  private readonly results =
    new Map<string, MetadataDiscoveryResult>();

  constructor(
    private readonly audit: MetadataAuditService
  ) {}

  list() {
    return Array.from(this.results.values());
  }

  discover(input: {
    sourceSystem: string;
    assetId: string;
    assetType: MetadataAssetType;
    payload: Record<string, unknown>;
    actorIdentityId: string;
    correlationId: string;
  }) {
    const discoveredFields =
      Object.keys(input.payload);

    const suggestedTags = discoveredFields
      .filter((field) =>
        [
          "domain",
          "category",
          "module",
          "capability",
          "product",
          "workflow"
        ].some((token) =>
          field.toLowerCase().includes(token)
        )
      )
      .map((field) =>
        String(input.payload[field] ?? field)
      )
      .filter((value) => value.trim().length > 0);

    const suggestedClassifications: string[] = [];

    const serialized =
      JSON.stringify(input.payload).toLowerCase();

    if (
      serialized.includes("password") ||
      serialized.includes("secret") ||
      serialized.includes("token")
    ) {
      suggestedClassifications.push("sensitive");
    }

    if (
      serialized.includes("customer") ||
      serialized.includes("email") ||
      serialized.includes("phone")
    ) {
      suggestedClassifications.push("personal-data");
    }

    if (
      input.assetType === "model" ||
      input.assetType === "agent"
    ) {
      suggestedClassifications.push("ai-asset");
    }

    const confidence = Math.min(
      100,
      40 +
        discoveredFields.length * 3 +
        suggestedClassifications.length * 10
    );

    const result: MetadataDiscoveryResult = {
      id: `metadata-discovery:${Date.now()}:${
        this.results.size + 1
      }`,
      sourceSystem: input.sourceSystem,
      assetId: input.assetId,
      assetType: input.assetType,
      discoveredFields,
      suggestedTags: Array.from(
        new Set(suggestedTags)
      ),
      suggestedClassifications: Array.from(
        new Set(suggestedClassifications)
      ),
      confidence,
      discoveredAt: new Date().toISOString()
    };

    this.results.set(result.id, result);

    this.audit.record({
      correlationId: input.correlationId,
      category: "discovery",
      action: "metadata-discovered",
      subjectId: result.id,
      actorIdentityId: input.actorIdentityId,
      outcome: "success",
      metadata: {
        assetId: input.assetId,
        discoveredFields: discoveredFields.length,
        confidence
      }
    });

    return result;
  }

  summary() {
    return {
      total: this.results.size,
      highConfidence: this.list().filter(
        (result) => result.confidence >= 80
      ).length
    };
  }
}
