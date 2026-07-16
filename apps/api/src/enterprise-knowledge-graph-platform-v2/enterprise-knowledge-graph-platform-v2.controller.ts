import { Body, Controller, Get, Param, Post, Query } from "@nestjs/common";
import { KnowledgeEntityRegistryV2Service } from "./knowledge-entity-registry-v2.service";
import { KnowledgeGraphAnalyticsV2Service } from "./knowledge-graph-analytics-v2.service";
import { KnowledgeInferenceEngineV2Service } from "./knowledge-inference-engine-v2.service";
import { KnowledgeLineageV2Service } from "./knowledge-lineage-v2.service";
import { KnowledgeRelationshipEngineV2Service } from "./knowledge-relationship-engine-v2.service";
import { KnowledgeSemanticSearchV2Service } from "./knowledge-semantic-search-v2.service";
import type { KnowledgeGraphEntityV2 } from "./enterprise-knowledge-graph-platform-v2.types";

@Controller("enterprise-knowledge-graph-platform-v2")
export class EnterpriseKnowledgeGraphPlatformV2Controller {
  constructor(
    private readonly analytics: KnowledgeGraphAnalyticsV2Service,
    private readonly entities: KnowledgeEntityRegistryV2Service,
    private readonly relations: KnowledgeRelationshipEngineV2Service,
    private readonly search: KnowledgeSemanticSearchV2Service,
    private readonly inference: KnowledgeInferenceEngineV2Service,
    private readonly lineage: KnowledgeLineageV2Service,
  ) {}

  @Get("status")
  status() {
    return this.analytics.health();
  }

  @Get("diagnostics")
  diagnostics() {
    return this.analytics.diagnostics();
  }

  @Post("entities")
  upsertEntity(
    @Body()
    body: Omit<KnowledgeGraphEntityV2, "version" | "createdAt" | "updatedAt">,
  ) {
    const existingVersion = (() => {
      try {
        return this.entities.get(body.id).version;
      } catch {
        return undefined;
      }
    })();

    const entity = this.entities.upsert(body);

    this.lineage.record(
      entity.id,
      "API",
      existingVersion ? "UPDATE" : "CREATE",
      entity.version,
      existingVersion,
    );

    return { success: true, entity };
  }

  @Post("relations")
  connect(
    @Body()
    body: {
      sourceId: string;
      targetId: string;
      relationType: string;
      weight?: number;
      properties?: Record<string, unknown>;
    },
  ) {
    return {
      success: true,
      relation: this.relations.connect(
        body.sourceId,
        body.targetId,
        body.relationType,
        body.weight,
        body.properties,
      ),
    };
  }

  @Get("search")
  semanticSearch(
    @Query("q") query: string,
    @Query("limit") limit?: string,
  ) {
    return {
      success: true,
      items: this.search.search(query ?? "", Number(limit ?? 10)),
    };
  }

  @Post("entities/:id/infer")
  infer(@Param("id") id: string) {
    return {
      success: true,
      inferences: this.inference.infer(id),
    };
  }

  @Get("entities/:id/neighbors")
  neighbors(@Param("id") id: string) {
    return {
      success: true,
      items: this.relations.neighbors(id),
    };
  }

  @Get("entities/:id/lineage")
  lineageHistory(@Param("id") id: string) {
    return {
      success: true,
      items: this.lineage.list(id),
    };
  }
}
