import { Injectable } from "@nestjs/common";
import {
  KnowledgeGraphHealthIndex
} from "../foundation-pack-13.types";
import { KnowledgeNodeRegistryService } from "../nodes/knowledge-node-registry.service";
import { KnowledgeRelationshipRegistryService } from "../relationships/knowledge-relationship-registry.service";
import { KnowledgeGraphQualityService } from "../quality/knowledge-graph-quality.service";
import { KnowledgeGraphSnapshotService } from "../snapshots/knowledge-graph-snapshot.service";
import { KnowledgeGraphAuditService } from "../observability/knowledge-graph-audit.service";

@Injectable()
export class KnowledgeGraphHealthService {
  private readonly indexes =
    new Map<string, KnowledgeGraphHealthIndex>();

  constructor(
    private readonly nodes: KnowledgeNodeRegistryService,
    private readonly relationships: KnowledgeRelationshipRegistryService,
    private readonly quality: KnowledgeGraphQualityService,
    private readonly snapshots: KnowledgeGraphSnapshotService,
    private readonly audit: KnowledgeGraphAuditService
  ) {}

  list() {
    return Array.from(this.indexes.values());
  }

  calculate(input: {
    actorIdentityId: string;
    correlationId: string;
  }) {
    const nodes = this.nodes.list();
    const relationships = this.relationships.list();
    const quality = this.quality.summary();
    const snapshots = this.snapshots.summary();

    const connectedNodes = nodes.filter(
      (node) =>
        this.relationships.incoming(node.id).length > 0 ||
        this.relationships.outgoing(node.id).length > 0
    ).length;

    const coverageScore =
      nodes.length === 0
        ? 100
        : this.clamp(
            (connectedNodes / nodes.length) * 100
          );

    const connectivityScore =
      nodes.length <= 1
        ? 100
        : this.clamp(
            Math.min(
              100,
              (relationships.length /
                Math.max(1, nodes.length - 1)) *
                100
            )
          );

    const qualityScore = this.clamp(
      100 -
        quality.critical * 30 -
        quality.errors * 15 -
        quality.warnings * 5
    );

    const confidenceScore =
      nodes.length === 0
        ? 100
        : this.clamp(
            nodes.reduce(
              (sum, node) => sum + node.confidence,
              0
            ) / nodes.length
          );

    const integrityScore =
      snapshots.total > 0 ? 100 : 80;

    const score = this.clamp(
      coverageScore * 0.25 +
        connectivityScore * 0.2 +
        qualityScore * 0.25 +
        confidenceScore * 0.2 +
        integrityScore * 0.1
    );

    const reasons: string[] = [];

    if (coverageScore < 80) {
      reasons.push(
        "Knowledge graph coverage is incomplete."
      );
    }

    if (connectivityScore < 60) {
      reasons.push(
        "Semantic connectivity is limited."
      );
    }

    if (qualityScore < 80) {
      reasons.push(
        "Knowledge quality findings require resolution."
      );
    }

    if (confidenceScore < 70) {
      reasons.push(
        "Knowledge confidence requires improvement."
      );
    }

    if (reasons.length === 0) {
      reasons.push(
        "Enterprise knowledge graph is healthy."
      );
    }

    const index: KnowledgeGraphHealthIndex = {
      id: `knowledge-graph-health:${Date.now()}:${
        this.indexes.size + 1
      }`,
      score,
      level: this.level(score),
      metrics: {
        coverageScore,
        connectivityScore,
        qualityScore,
        confidenceScore,
        integrityScore
      },
      reasons,
      calculatedAt: new Date().toISOString()
    };

    this.indexes.set(index.id, index);

    this.audit.record({
      correlationId: input.correlationId,
      category: "health",
      action: "knowledge-graph-health-calculated",
      subjectId: index.id,
      actorIdentityId: input.actorIdentityId,
      outcome:
        score < 60 ? "warning" : "success",
      metadata: {
        score,
        level: index.level
      }
    });

    return index;
  }

  summary() {
    const indexes = this.list();

    return {
      total: indexes.length,
      latestScore:
        indexes.length === 0
          ? 0
          : indexes[indexes.length - 1]?.score ?? 0,
      healthy: indexes.filter(
        (index) =>
          index.level === "healthy" ||
          index.level === "excellent"
      ).length
    };
  }

  private clamp(value: number) {
    return Math.max(
      0,
      Math.min(100, Number(value.toFixed(2)))
    );
  }

  private level(
    score: number
  ): KnowledgeGraphHealthIndex["level"] {
    if (score >= 90) return "excellent";
    if (score >= 75) return "healthy";
    if (score >= 60) return "stable";
    if (score >= 40) return "degraded";
    return "critical";
  }
}
