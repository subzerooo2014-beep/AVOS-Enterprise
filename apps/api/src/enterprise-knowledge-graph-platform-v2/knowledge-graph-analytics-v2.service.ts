import { Injectable } from "@nestjs/common";
import { KnowledgeEntityRegistryV2Service } from "./knowledge-entity-registry-v2.service";
import { KnowledgeInferenceEngineV2Service } from "./knowledge-inference-engine-v2.service";
import { KnowledgeLineageV2Service } from "./knowledge-lineage-v2.service";
import { KnowledgeRelationshipEngineV2Service } from "./knowledge-relationship-engine-v2.service";
import { KnowledgeSemanticSearchV2Service } from "./knowledge-semantic-search-v2.service";
import type {
  KnowledgeGraphHealthV2,
  KnowledgeGraphMetricsV2,
} from "./enterprise-knowledge-graph-platform-v2.types";

@Injectable()
export class KnowledgeGraphAnalyticsV2Service {
  constructor(
    private readonly entities: KnowledgeEntityRegistryV2Service,
    private readonly relations: KnowledgeRelationshipEngineV2Service,
    private readonly lineage: KnowledgeLineageV2Service,
    private readonly inference: KnowledgeInferenceEngineV2Service,
    private readonly search: KnowledgeSemanticSearchV2Service,
  ) {}

  metrics(): KnowledgeGraphMetricsV2 {
    const connected = this.relations.connectedEntityIds();

    return {
      entities: this.entities.count(),
      relations: this.relations.count(),
      lineageRecords: this.lineage.count(),
      inferences: this.inference.count(),
      searches: this.search.searchCount(),
      connectedEntities: connected.size,
      orphanEntities: Math.max(0, this.entities.count() - connected.size),
    };
  }

  health(): KnowledgeGraphHealthV2 {
    const metrics = this.metrics();

    return {
      success: true,
      system: "AVOS Enterprise Knowledge Graph Platform V2",
      version: "2.0.0",
      status:
        metrics.entities > 0 && metrics.orphanEntities === metrics.entities
          ? "DEGRADED"
          : "READY",
      metrics,
      components: {
        entityRegistry: "READY",
        relationshipEngine: "READY",
        semanticSearch: "READY",
        inferenceEngine: "READY",
        knowledgeLineage: "READY",
        knowledgeExplorer: "READY",
        graphAnalytics: "READY",
      },
    };
  }

  diagnostics() {
    return {
      success: true,
      health: this.health(),
      entities: this.entities.list(),
      relations: this.relations.list(),
      lineage: this.lineage.list(),
      inferences: this.inference.list(),
    };
  }
}
