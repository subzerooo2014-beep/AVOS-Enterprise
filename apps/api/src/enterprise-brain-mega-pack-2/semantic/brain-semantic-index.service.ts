import { Injectable } from "@nestjs/common";
import {
  BrainKnowledgeIndexEntry,
  BrainKnowledgeNode,
  BrainKnowledgeSearchResult
} from "../enterprise-brain-mega-pack-2.types";
import { BrainKnowledgeGraphService } from "../knowledge/brain-knowledge-graph.service";
import { BrainKnowledgeAuditService } from "../observability/brain-knowledge-audit.service";

@Injectable()
export class BrainSemanticIndexService {
  private readonly index = new Map<string, BrainKnowledgeIndexEntry>();

  constructor(
    private readonly graph: BrainKnowledgeGraphService,
    private readonly audit: BrainKnowledgeAuditService
  ) {
    this.rebuild({
      actorIdentityId: "brain:system",
      correlationId: "brain-semantic-index-seed"
    });
  }

  list() {
    return Array.from(this.index.values());
  }

  rebuild(context: {
    actorIdentityId: string;
    correlationId: string;
  }) {
    this.index.clear();

    for (const node of this.graph.listNodes()) {
      const searchableText = [
        node.name,
        node.description,
        ...node.aliases,
        ...node.tags
      ].join(" ").toLowerCase();

      const tokens = Array.from(
        new Set(
          searchableText
            .split(/[^a-zA-Z0-9\u0600-\u06FF]+/)
            .filter(Boolean)
        )
      );

      const entry: BrainKnowledgeIndexEntry = {
        id: `brain-index:${node.id}`,
        nodeId: node.id,
        tokens,
        semanticVector: this.vectorize(searchableText),
        searchableText,
        rank: node.confidence,
        indexedAt: new Date().toISOString()
      };

      this.index.set(entry.id, entry);
    }

    this.audit.record({
      correlationId: context.correlationId,
      category: "index",
      action: "brain-semantic-index-rebuilt",
      subjectId: "brain-semantic-index",
      actorIdentityId: context.actorIdentityId,
      outcome: "success",
      metadata: {
        entries: this.index.size
      }
    });

    return this.list();
  }

  search(query: string, limit = 10): BrainKnowledgeSearchResult[] {
    const normalized = query.trim().toLowerCase();
    const queryTokens = normalized
      .split(/[^a-zA-Z0-9\u0600-\u06FF]+/)
      .filter(Boolean);

    const queryVector = this.vectorize(normalized);

    return this.list()
      .map((entry) => {
        const node = this.graph.getNode(entry.nodeId);
        const tokenHits = queryTokens.filter(
          (token) => entry.tokens.includes(token)
        ).length;

        const tokenScore =
          queryTokens.length === 0
            ? 0
            : tokenHits / queryTokens.length * 100;

        const vectorScore = this.cosine(
          queryVector,
          entry.semanticVector
        ) * 100;

        const score = Number(
          (
            tokenScore * 0.6 +
            vectorScore * 0.3 +
            entry.rank * 0.1
          ).toFixed(2)
        );

        const reasons: string[] = [];

        if (tokenHits > 0) {
          reasons.push(`${tokenHits} token match(es).`);
        }

        if (vectorScore > 50) {
          reasons.push("Semantic similarity detected.");
        }

        return {
          nodeId: node.id,
          score,
          reasons,
          node
        };
      })
      .filter((result) => result.score > 0)
      .sort((left, right) => right.score - left.score)
      .slice(0, Math.max(1, limit));
  }

  summary() {
    return {
      entries: this.index.size,
      indexedNodes: new Set(this.list().map((x) => x.nodeId)).size
    };
  }

  private vectorize(text: string) {
    const vector = new Array<number>(16).fill(0);

    for (let index = 0; index < text.length; index += 1) {
      const code = text.charCodeAt(index);
      const bucket = index % vector.length;
      vector[bucket] = (vector[bucket] ?? 0) + code / 1000;
    }

    return vector;
  }

  private cosine(left: number[], right: number[]) {
    let dot = 0;
    let leftMagnitude = 0;
    let rightMagnitude = 0;

    const length = Math.max(left.length, right.length);

    for (let index = 0; index < length; index += 1) {
      const l = left[index] ?? 0;
      const r = right[index] ?? 0;
      dot += l * r;
      leftMagnitude += l * l;
      rightMagnitude += r * r;
    }

    if (leftMagnitude === 0 || rightMagnitude === 0) {
      return 0;
    }

    return dot / (
      Math.sqrt(leftMagnitude) *
      Math.sqrt(rightMagnitude)
    );
  }
}
