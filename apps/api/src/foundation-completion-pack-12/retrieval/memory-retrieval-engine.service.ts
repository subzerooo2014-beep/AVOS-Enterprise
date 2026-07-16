import { Injectable } from "@nestjs/common";
import {
  MemoryRetrievalQuery,
  MemoryRetrievalResult
} from "../foundation-pack-12.types";
import { EnterpriseMemoryRegistryService } from "../memory/enterprise-memory-registry.service";
import { MemoryAuditService } from "../observability/memory-audit.service";

@Injectable()
export class MemoryRetrievalEngineService {
  constructor(
    private readonly memories: EnterpriseMemoryRegistryService,
    private readonly audit: MemoryAuditService
  ) {}

  search(
    query: MemoryRetrievalQuery,
    context: {
      actorIdentityId: string;
      correlationId: string;
    }
  ) {
    const results: MemoryRetrievalResult[] = [];

    for (const memory of this.memories.list()) {
      let score = 0;
      const reasons: string[] = [];

      if (
        query.types &&
        !query.types.includes(memory.type)
      ) {
        continue;
      }

      if (
        query.tags &&
        !query.tags.every((tag) =>
          memory.tags.includes(tag)
        )
      ) {
        continue;
      }

      if (
        query.subjectId &&
        memory.subjectId !== query.subjectId
      ) {
        continue;
      }

      if (
        query.correlationId &&
        memory.correlationId !== query.correlationId
      ) {
        continue;
      }

      if (
        query.ownerIdentityId &&
        memory.ownerIdentityId !== query.ownerIdentityId
      ) {
        continue;
      }

      if (
        query.status &&
        !query.status.includes(memory.status)
      ) {
        continue;
      }

      if (query.text) {
        const text = query.text.toLowerCase();

        if (memory.title.toLowerCase().includes(text)) {
          score += 40;
          reasons.push("Title match.");
        }

        if (
          memory.summary.toLowerCase().includes(text)
        ) {
          score += 30;
          reasons.push("Summary match.");
        }

        if (
          memory.description.toLowerCase().includes(text)
        ) {
          score += 20;
          reasons.push("Description match.");
        }

        if (
          JSON.stringify(memory.content)
            .toLowerCase()
            .includes(text)
        ) {
          score += 10;
          reasons.push("Content match.");
        }

        if (score === 0) {
          continue;
        }
      }
      else {
        score = 50;
        reasons.push("Structured filter match.");
      }

      if (memory.status === "active") {
        score += 10;
        reasons.push("Active memory.");
      }

      results.push({
        memory,
        score: Math.min(100, score),
        reasons
      });
    }

    const limited = results
      .sort((left, right) => right.score - left.score)
      .slice(0, Math.max(1, query.limit ?? 20));

    this.audit.record({
      correlationId: context.correlationId,
      category: "retrieval",
      action: "memory-search-executed",
      subjectId: "memory-retrieval",
      actorIdentityId: context.actorIdentityId,
      outcome: "success",
      metadata: {
        results: limited.length,
        query
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
