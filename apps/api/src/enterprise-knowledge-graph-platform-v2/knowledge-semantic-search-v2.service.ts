import { Injectable } from "@nestjs/common";
import { KnowledgeEntityRegistryV2Service } from "./knowledge-entity-registry-v2.service";
import type { KnowledgeSearchResultV2 } from "./enterprise-knowledge-graph-platform-v2.types";

@Injectable()
export class KnowledgeSemanticSearchV2Service {
  private searchCountValue = 0;

  constructor(private readonly entities: KnowledgeEntityRegistryV2Service) {}

  search(query: string, limit = 10): KnowledgeSearchResultV2[] {
    this.searchCountValue += 1;
    const normalized = query.trim().toLowerCase();

    return this.entities
      .list()
      .map((entity) => {
        const matchedFields: string[] = [];
        let score = 0;

        if (entity.name.toLowerCase().includes(normalized)) {
          matchedFields.push("name");
          score += 5;
        }

        if (entity.type.toLowerCase().includes(normalized)) {
          matchedFields.push("type");
          score += 3;
        }

        if ((entity.description ?? "").toLowerCase().includes(normalized)) {
          matchedFields.push("description");
          score += 2;
        }

        if (entity.tags.some((tag) => tag.toLowerCase().includes(normalized))) {
          matchedFields.push("tags");
          score += 2;
        }

        if (
          JSON.stringify(entity.properties)
            .toLowerCase()
            .includes(normalized)
        ) {
          matchedFields.push("properties");
          score += 1;
        }

        return {
          id: entity.id,
          name: entity.name,
          type: entity.type,
          score,
          matchedFields,
        };
      })
      .filter((result) => result.score > 0)
      .sort((left, right) => right.score - left.score)
      .slice(0, Math.max(1, limit));
  }

  searchCount(): number {
    return this.searchCountValue;
  }
}
