import { Injectable } from "@nestjs/common";
import {
  MetadataSearchQuery,
  MetadataSearchResult
} from "../foundation-pack-14.types";
import { UnifiedMetadataCatalogService } from "../catalog/unified-metadata-catalog.service";
import { MetadataAuditService } from "../observability/metadata-audit.service";

@Injectable()
export class MetadataSearchService {
  constructor(
    private readonly catalog: UnifiedMetadataCatalogService,
    private readonly audit: MetadataAuditService
  ) {}

  search(
    query: MetadataSearchQuery,
    context: {
      actorIdentityId: string;
      correlationId: string;
    }
  ) {
    const results: MetadataSearchResult[] = [];

    for (const record of this.catalog.list()) {
      if (
        query.assetTypes &&
        !query.assetTypes.includes(record.assetType)
      ) {
        continue;
      }

      if (
        query.domains &&
        !query.domains.includes(record.domain)
      ) {
        continue;
      }

      if (
        query.tags &&
        !query.tags.every((tag) =>
          record.tags.includes(tag)
        )
      ) {
        continue;
      }

      if (
        query.classifications &&
        !query.classifications.every(
          (classification) =>
            record.classifications.includes(
              classification
            )
        )
      ) {
        continue;
      }

      if (
        query.sensitivities &&
        !query.sensitivities.includes(
          record.sensitivity
        )
      ) {
        continue;
      }

      if (
        query.minQualityScore !== undefined &&
        record.qualityScore < query.minQualityScore
      ) {
        continue;
      }

      if (
        query.minConfidence !== undefined &&
        record.confidence < query.minConfidence
      ) {
        continue;
      }

      let score = 0;
      const reasons: string[] = [];

      if (query.text) {
        const text = query.text.toLowerCase();

        if (
          record.canonicalName
            .toLowerCase()
            .includes(text)
        ) {
          score += 35;
          reasons.push("Canonical name match.");
        }

        if (
          record.displayName
            .toLowerCase()
            .includes(text)
        ) {
          score += 25;
          reasons.push("Display name match.");
        }

        if (
          record.description
            .toLowerCase()
            .includes(text)
        ) {
          score += 20;
          reasons.push("Description match.");
        }

        if (
          record.tags.some((tag) =>
            tag.toLowerCase().includes(text)
          )
        ) {
          score += 10;
          reasons.push("Tag match.");
        }

        if (
          record.classifications.some(
            (classification) =>
              classification
                .toLowerCase()
                .includes(text)
          )
        ) {
          score += 10;
          reasons.push("Classification match.");
        }

        if (score === 0) {
          continue;
        }
      }
      else {
        score = 50;
        reasons.push("Structured filter match.");
      }

      score += record.qualityScore * 0.05;
      score += record.confidence * 0.05;

      results.push({
        record,
        score: Math.min(
          100,
          Number(score.toFixed(2))
        ),
        reasons
      });
    }

    const limited = results
      .sort((left, right) => right.score - left.score)
      .slice(0, Math.max(1, query.limit ?? 25));

    this.audit.record({
      correlationId: context.correlationId,
      category: "search",
      action: "metadata-search-executed",
      subjectId: "unified-metadata-catalog",
      actorIdentityId: context.actorIdentityId,
      outcome: "success",
      metadata: {
        query,
        results: limited.length
      }
    });

    return {
      query,
      results: limited,
      total: limited.length,
      searchedAt: new Date().toISOString()
    };
  }
}
