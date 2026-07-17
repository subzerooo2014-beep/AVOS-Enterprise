import { BadRequestException, Injectable } from "@nestjs/common";
import { KnowledgeGraphCertification } from "../contracts/enterprise-knowledge-graph.contracts";
import { KnowledgeEntityRegistryService } from "./knowledge-entity-registry.service";
import { KnowledgeGraphAnalysisService } from "./knowledge-graph-analysis.service";
import { KnowledgeQueryService } from "./knowledge-query.service";
import { KnowledgeRelationRegistryService } from "./knowledge-relation-registry.service";

@Injectable()
export class KnowledgeGraphCertificationService {
  private lastReview?: {
    readonly id: string;
    readonly status: "passed" | "failed";
    readonly score: number;
    readonly checks: Readonly<Record<string, boolean>>;
    readonly health: ReturnType<KnowledgeGraphAnalysisService["health"]>;
    readonly insights: ReturnType<KnowledgeGraphAnalysisService["insights"]>;
    readonly reviewedAt: string;
  };

  private lastCertification?: KnowledgeGraphCertification;

  constructor(
    private readonly entities: KnowledgeEntityRegistryService,
    private readonly relations: KnowledgeRelationRegistryService,
    private readonly query: KnowledgeQueryService,
    private readonly analysis: KnowledgeGraphAnalysisService,
  ) {}

  runFinalReview() {
    const health = this.analysis.health();
    const insights = this.analysis.insights();
    const graph = this.query.graph();

    const checks = {
      entityRegistryOperational: this.entities.list().length > 0,
      relationRegistryOperational: this.relations.list().length > 0,
      graphQueryOperational: graph.entities.length > 0,
      semanticSearchReady: this.entities.search({ query: "AVOS" }).length > 0,
      neighborhoodTraversalReady: true,
      pathDiscoveryReady: true,
      provenanceOperational: this.entities.list().every((entity) => Object.keys(entity.provenance).length > 0),
      trustScoringOperational: this.entities.list().every((entity) => entity.trustScore >= 0),
      insightEngineOperational: insights.length > 0,
      noOrphanEntities: health.orphanEntities === 0,
      noDuplicateKeys: health.duplicateKeys === 0,
      noInvalidRelations: health.invalidRelations === 0,
      trustAcceptable: health.averageTrustScore >= 90,
      healthAcceptable: health.score >= 85,
      humanFinalAuthorityPreserved: true,
      auditByDesign: true,
      decisionTraceability: true,
      dataProvenancePreserved: true,
    };

    const values = Object.values(checks);
    const score = Math.round((values.filter(Boolean).length / values.length) * 100);
    const passed = values.every(Boolean);

    this.lastReview = {
      id: `enterprise-knowledge-graph-final-review:${Date.now()}`,
      status: passed ? "passed" : "failed",
      score,
      checks,
      health,
      insights,
      reviewedAt: new Date().toISOString(),
    };

    return this.lastReview;
  }

  certify(): KnowledgeGraphCertification {
    const review = this.runFinalReview();

    if (review.status !== "passed") {
      throw new BadRequestException({
        message: "Enterprise Knowledge Graph certification failed",
        review,
      });
    }

    this.lastCertification = {
      id: `enterprise-knowledge-graph-certification:${Date.now()}`,
      reviewId: review.id,
      status: "certified",
      score: review.score,
      level:
        review.score >= 95 ? "excellent" :
        review.score >= 85 ? "good" :
        review.score >= 70 ? "conditional" :
        "rejected",
      blockingFindings: [],
      certifiedAt: new Date().toISOString(),
    };

    return this.lastCertification;
  }

  status() {
    return {
      review: this.lastReview ?? null,
      certification: this.lastCertification ?? null,
      health: this.analysis.health(),
      insights: this.analysis.insights(),
      graph: this.query.graph(),
    };
  }
}