import { Injectable } from "@nestjs/common";
import {
  SemanticSearchQuery,
  SemanticSearchResult
} from "../foundation-pack-13.types";
import { KnowledgeNodeRegistryService } from "../nodes/knowledge-node-registry.service";
import { KnowledgeGraphAuditService } from "../observability/knowledge-graph-audit.service";

@Injectable()
export class SemanticKnowledgeSearchService {
  constructor(
    private readonly nodes: KnowledgeNodeRegistryService,
    private readonly audit: KnowledgeGraphAuditService
  ) {}

  search(
    query: SemanticSearchQuery,
    context: {
      actorIdentityId: string;
      correlationId: string;
    }
  ) {
    const results: SemanticSearchResult[] = [];

    for (const node of this.nodes.list()) {
      if (
        query.nodeTypes &&
        !query.nodeTypes.includes(node.type)
      ) {
        continue;
      }

      if (
        query.domains &&
        !query.domains.includes(node.domain)
      ) {
        continue;
      }

      if (
        query.tags &&
        !query.tags.every((tag) =>
          node.tags.includes(tag)
        )
      ) {
        continue;
      }

      if (
        query.status &&
        !query.status.includes(node.status)
      ) {
        continue;
      }

      if (
        query.minConfidence !== undefined &&
        node.confidence < query.minConfidence
      ) {
        continue;
      }

      let score = 0;
      const reasons: string[] = [];

      if (query.text) {
        const text = query.text.toLowerCase();

        if (
          node.canonicalName.toLowerCase().includes(text)
        ) {
          score += 35;
          reasons.push("Canonical name match.");
        }

        if (
          node.displayName.toLowerCase().includes(text)
        ) {
          score += 30;
          reasons.push("Display name match.");
        }

        if (
          node.description.toLowerCase().includes(text)
        ) {
          score += 20;
          reasons.push("Description match.");
        }

        if (
          JSON.stringify(node.attributes)
            .toLowerCase()
            .includes(text)
        ) {
          score += 10;
          reasons.push("Attribute match.");
        }

        if (
          node.tags.some((tag) =>
            tag.toLowerCase().includes(text)
          )
        ) {
          score += 10;
          reasons.push("Tag match.");
        }

        if (score === 0) {
          continue;
        }
      }
      else {
        score = 50;
        reasons.push("Structured filter match.");
      }

      score += node.confidence * 0.05;

      results.push({
        node,
        score: Math.min(100, Number(score.toFixed(2))),
        reasons
      });
    }

    const limited = results
      .sort((left, right) => right.score - left.score)
      .slice(0, Math.max(1, query.limit ?? 25));

    this.audit.record({
      correlationId: context.correlationId,
      category: "search",
      action: "semantic-search-executed",
      subjectId: "enterprise-knowledge-graph",
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
