import { Injectable } from "@nestjs/common";
import { BrainKnowledgeMemoryHealthIndex } from "../enterprise-brain-mega-pack-2.types";
import { BrainKnowledgeGraphService } from "../knowledge/brain-knowledge-graph.service";
import { BrainOntologyRegistryService } from "../ontology/brain-ontology-registry.service";
import { BrainSemanticIndexService } from "../semantic/brain-semantic-index.service";
import { BrainMemoryStoreService } from "../memory/brain-memory-store.service";
import { BrainMemoryConsolidationService } from "../consolidation/brain-memory-consolidation.service";
import { BrainKnowledgeValidationService } from "../validation/brain-knowledge-validation.service";
import { BrainKnowledgeAuditService } from "../observability/brain-knowledge-audit.service";

@Injectable()
export class BrainKnowledgeMemoryHealthService {
  private readonly indexes =
    new Map<string, BrainKnowledgeMemoryHealthIndex>();

  constructor(
    private readonly graph: BrainKnowledgeGraphService,
    private readonly ontologies: BrainOntologyRegistryService,
    private readonly index: BrainSemanticIndexService,
    private readonly memory: BrainMemoryStoreService,
    private readonly consolidation: BrainMemoryConsolidationService,
    private readonly validation: BrainKnowledgeValidationService,
    private readonly audit: BrainKnowledgeAuditService
  ) {}

  list() {
    return Array.from(this.indexes.values());
  }

  calculate(input: {
    actorIdentityId: string;
    correlationId: string;
  }) {
    const graph = this.graph.summary();
    const ontology = this.ontologies.summary();
    const index = this.index.summary();
    const memory = this.memory.summary();
    const consolidation = this.consolidation.summary();
    const validation = this.validation.latest();

    const knowledgeGraphScore =
      graph.nodes >= 2 &&
      graph.relations >= 1
        ? 100
        : 60;

    const ontologyScore =
      ontology.active >= 1
        ? 100
        : 0;

    const semanticIndexScore =
      index.indexedNodes === graph.nodes
        ? 100
        : graph.nodes === 0
          ? 0
          : Number(
              (
                index.indexedNodes /
                graph.nodes *
                100
              ).toFixed(2)
            );

    const memoryCoverageScore =
      memory.total === 0
        ? 100
        : Math.max(
            0,
            100 -
            memory.sensitive * 0
          );

    const consolidationScore =
      consolidation.failed === 0
        ? 100
        : Math.max(
            0,
            100 -
            consolidation.failed * 25
          );

    const validationScore =
      validation?.score ?? 100;

    const score = Number(
      (
        knowledgeGraphScore * 0.2 +
        ontologyScore * 0.15 +
        semanticIndexScore * 0.2 +
        memoryCoverageScore * 0.15 +
        consolidationScore * 0.1 +
        validationScore * 0.2
      ).toFixed(2)
    );

    const reasons: string[] = [];

    if (knowledgeGraphScore < 90) {
      reasons.push("Brain knowledge graph coverage is incomplete.");
    }

    if (ontologyScore < 90) {
      reasons.push("Brain ontology registry is incomplete.");
    }

    if (semanticIndexScore < 90) {
      reasons.push("Brain semantic index is not synchronized.");
    }

    if (consolidationScore < 90) {
      reasons.push("Brain memory consolidation contains failures.");
    }

    if (validationScore < 90) {
      reasons.push("Brain knowledge validation is below target.");
    }

    if (reasons.length === 0) {
      reasons.push("Enterprise Brain knowledge and memory foundation is healthy.");
    }

    const health: BrainKnowledgeMemoryHealthIndex = {
      id: `brain-knowledge-memory-health:${Date.now()}:${this.indexes.size + 1}`,
      score,
      level: this.level(score),
      metrics: {
        knowledgeGraphScore,
        ontologyScore,
        semanticIndexScore,
        memoryCoverageScore,
        consolidationScore,
        validationScore
      },
      reasons,
      calculatedAt: new Date().toISOString()
    };

    this.indexes.set(health.id, health);

    this.audit.record({
      correlationId: input.correlationId,
      category: "health",
      action: "brain-knowledge-memory-health-calculated",
      subjectId: health.id,
      actorIdentityId: input.actorIdentityId,
      outcome:
        score >= 75
          ? "success"
          : score >= 50
            ? "warning"
            : "failure",
      metadata: {
        score,
        level: health.level
      }
    });

    return health;
  }

  summary() {
    const items = this.list();

    return {
      total: items.length,
      latestScore:
        items.length === 0
          ? 0
          : items[items.length - 1]?.score ?? 0,
      healthy:
        items.filter(
          (item) =>
            item.level === "healthy" ||
            item.level === "excellent"
        ).length
    };
  }

  private level(
    score: number
  ): BrainKnowledgeMemoryHealthIndex["level"] {
    if (score >= 90) return "excellent";
    if (score >= 75) return "healthy";
    if (score >= 60) return "stable";
    if (score >= 40) return "degraded";
    return "critical";
  }
}
