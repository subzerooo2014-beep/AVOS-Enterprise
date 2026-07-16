import { Module } from "@nestjs/common";
import { EnterpriseKnowledgeGraphPlatformV2Controller } from "./enterprise-knowledge-graph-platform-v2.controller";
import { KnowledgeEntityRegistryV2Service } from "./knowledge-entity-registry-v2.service";
import { KnowledgeGraphAnalyticsV2Service } from "./knowledge-graph-analytics-v2.service";
import { KnowledgeInferenceEngineV2Service } from "./knowledge-inference-engine-v2.service";
import { KnowledgeLineageV2Service } from "./knowledge-lineage-v2.service";
import { KnowledgeRelationshipEngineV2Service } from "./knowledge-relationship-engine-v2.service";
import { KnowledgeSemanticSearchV2Service } from "./knowledge-semantic-search-v2.service";

@Module({
  controllers: [EnterpriseKnowledgeGraphPlatformV2Controller],
  providers: [
    KnowledgeEntityRegistryV2Service,
    KnowledgeGraphAnalyticsV2Service,
    KnowledgeInferenceEngineV2Service,
    KnowledgeLineageV2Service,
    KnowledgeRelationshipEngineV2Service,
    KnowledgeSemanticSearchV2Service,
  ],
  exports: [
    KnowledgeEntityRegistryV2Service,
    KnowledgeGraphAnalyticsV2Service,
    KnowledgeInferenceEngineV2Service,
    KnowledgeLineageV2Service,
    KnowledgeRelationshipEngineV2Service,
    KnowledgeSemanticSearchV2Service,
  ],
})
export class EnterpriseKnowledgeGraphPlatformV2Module {}
