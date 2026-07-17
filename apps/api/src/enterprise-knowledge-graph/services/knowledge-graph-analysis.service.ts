import { Injectable } from "@nestjs/common";
import {
  KnowledgeGraphHealth,
  KnowledgeGraphInsight,
} from "../contracts/enterprise-knowledge-graph.contracts";
import { KnowledgeEntityRegistryService } from "./knowledge-entity-registry.service";
import { KnowledgeRelationRegistryService } from "./knowledge-relation-registry.service";

@Injectable()
export class KnowledgeGraphAnalysisService {
  constructor(
    private readonly entities: KnowledgeEntityRegistryService,
    private readonly relations: KnowledgeRelationRegistryService,
  ) {}

  health(): KnowledgeGraphHealth {
    const entities = this.entities.list();
    const relations = this.relations.list();
    const keys = entities.map((entity) => entity.key);
    const duplicateKeys = keys.length - new Set(keys).size;

    const orphanEntities = entities.filter(
      (entity) =>
        this.relations.incoming(entity.id).length === 0 &&
        this.relations.outgoing(entity.id).length === 0,
    );

    const invalidRelations = relations.filter((relation) => {
      try {
        this.entities.get(relation.sourceId);
        this.entities.get(relation.targetId);
        return false;
      } catch {
        return true;
      }
    });

    const lowTrustEntities = entities.filter((entity) => entity.trustScore < 70);
    const averageTrustScore =
      entities.length === 0
        ? 0
        : Math.round(
            entities.reduce((sum, entity) => sum + entity.trustScore, 0) / entities.length,
          );

    const findings: string[] = [];
    if (orphanEntities.length > 0) findings.push(`${orphanEntities.length} orphan knowledge entities detected.`);
    if (duplicateKeys > 0) findings.push(`${duplicateKeys} duplicate knowledge keys detected.`);
    if (invalidRelations.length > 0) findings.push(`${invalidRelations.length} invalid relations detected.`);
    if (lowTrustEntities.length > 0) findings.push(`${lowTrustEntities.length} low-trust knowledge entities detected.`);

    const score = Math.max(
      0,
      100 -
        orphanEntities.length * 8 -
        duplicateKeys * 20 -
        invalidRelations.length * 25 -
        lowTrustEntities.length * 5 -
        Math.max(0, 90 - averageTrustScore),
    );

    return {
      id: `knowledge-graph-health:${Date.now()}`,
      status: score >= 85 ? "healthy" : score >= 65 ? "degraded" : "critical",
      score,
      entities: entities.length,
      activeEntities: entities.filter((entity) => entity.status === "active").length,
      relations: relations.length,
      orphanEntities: orphanEntities.length,
      duplicateKeys,
      invalidRelations: invalidRelations.length,
      lowTrustEntities: lowTrustEntities.length,
      averageTrustScore,
      findings,
      generatedAt: new Date().toISOString(),
    };
  }

  insights(): readonly KnowledgeGraphInsight[] {
    const entities = this.entities.list();
    const insights: KnowledgeGraphInsight[] = [];

    const highConnectivity = entities
      .map((entity) => ({
        entity,
        degree:
          this.relations.incoming(entity.id).length +
          this.relations.outgoing(entity.id).length,
      }))
      .sort((a, b) => b.degree - a.degree)[0];

    if (highConnectivity) {
      insights.push({
        id: `knowledge-insight:${Date.now()}:structure`,
        category: "structure",
        title: "Primary knowledge hub",
        description: `${highConnectivity.entity.name} is the most connected knowledge entity with degree ${highConnectivity.degree}.`,
        priority: "medium",
        entityIds: [highConnectivity.entity.id],
        generatedAt: new Date().toISOString(),
      });
    }

    if (entities.every((entity) => entity.trustScore >= 90)) {
      insights.push({
        id: `knowledge-insight:${Date.now()}:governance`,
        category: "governance",
        title: "High-trust knowledge foundation",
        description: "All registered knowledge entities meet the high-trust threshold.",
        priority: "low",
        entityIds: entities.map((entity) => entity.id),
        generatedAt: new Date().toISOString(),
      });
    }

    insights.push({
      id: `knowledge-insight:${Date.now()}:opportunity`,
      category: "opportunity",
      title: "Knowledge reasoning readiness",
      description: "The graph is ready to support semantic reasoning, agent context, and governed knowledge retrieval.",
      priority: "high",
      entityIds: entities.map((entity) => entity.id),
      generatedAt: new Date().toISOString(),
    });

    return insights;
  }
}