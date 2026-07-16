import { Injectable } from "@nestjs/common";
import {
  BrainMemoryRetrievalResult,
  BrainMemoryType
} from "../enterprise-brain-mega-pack-2.types";
import { BrainMemoryStoreService } from "../memory/brain-memory-store.service";
import { BrainKnowledgeAuditService } from "../observability/brain-knowledge-audit.service";

@Injectable()
export class BrainMemoryRetrievalService {
  constructor(
    private readonly memory: BrainMemoryStoreService,
    private readonly audit: BrainKnowledgeAuditService
  ) {}

  retrieve(input: {
    query: string;
    types?: BrainMemoryType[];
    ownerIdentityId?: string;
    sessionId?: string;
    organizationId?: string;
    includeSensitive: boolean;
    limit?: number;
    actorIdentityId: string;
    correlationId: string;
  }): BrainMemoryRetrievalResult[] {
    const normalized = input.query.trim().toLowerCase();
    const tokens = normalized
      .split(/[^a-zA-Z0-9\u0600-\u06FF]+/)
      .filter(Boolean);

    const now = Date.now();

    const results = this.memory
      .list()
      .filter((item) => item.status === "active")
      .filter(
        (item) =>
          !item.expiresAt ||
          new Date(item.expiresAt).getTime() > now
      )
      .filter(
        (item) =>
          input.includeSensitive ||
          !item.sensitive
      )
      .filter(
        (item) =>
          !input.types ||
          input.types.includes(item.type)
      )
      .filter(
        (item) =>
          !input.ownerIdentityId ||
          item.ownerIdentityId === input.ownerIdentityId
      )
      .filter(
        (item) =>
          !input.sessionId ||
          item.sessionId === input.sessionId
      )
      .filter(
        (item) =>
          !input.organizationId ||
          item.organizationId === input.organizationId
      )
      .map((item) => {
        const text = [
          item.subject,
          item.summary,
          JSON.stringify(item.content),
          ...item.tags
        ].join(" ").toLowerCase();

        const hits = tokens.filter(
          (token) => text.includes(token)
        ).length;

        const textScore =
          tokens.length === 0
            ? 0
            : hits / tokens.length * 100;

        const score = Number(
          (
            textScore * 0.55 +
            item.importance * 0.2 +
            item.confidence * 0.15 +
            item.retentionScore * 0.1
          ).toFixed(2)
        );

        const reasons: string[] = [];

        if (hits > 0) {
          reasons.push(`${hits} query token match(es).`);
        }

        if (item.importance >= 80) {
          reasons.push("High-importance memory.");
        }

        if (item.retentionScore >= 80) {
          reasons.push("High retention score.");
        }

        return {
          memoryId: item.id,
          score,
          reasons,
          memory: item
        };
      })
      .filter((result) => result.score > 0)
      .sort((left, right) => right.score - left.score)
      .slice(0, Math.max(1, input.limit ?? 10));

    this.audit.record({
      correlationId: input.correlationId,
      category: "retrieval",
      action: "brain-memory-retrieval-completed",
      subjectId: "brain-memory-retrieval",
      actorIdentityId: input.actorIdentityId,
      outcome: "success",
      metadata: {
        query: input.query,
        results: results.length
      }
    });

    return results;
  }
}
