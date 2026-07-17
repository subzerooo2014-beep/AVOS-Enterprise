import { Module } from "@nestjs/common";
import { EnterpriseKnowledgeGraphController } from "./enterprise-knowledge-graph.controller";
import { KnowledgeEntityRegistryService } from "./services/knowledge-entity-registry.service";
import { KnowledgeGraphAnalysisService } from "./services/knowledge-graph-analysis.service";
import { KnowledgeGraphCertificationService } from "./services/knowledge-graph-certification.service";
import { KnowledgeQueryService } from "./services/knowledge-query.service";
import { KnowledgeRelationRegistryService } from "./services/knowledge-relation-registry.service";

@Module({
  controllers: [EnterpriseKnowledgeGraphController],
  providers: [
    KnowledgeEntityRegistryService,
    KnowledgeRelationRegistryService,
    KnowledgeQueryService,
    KnowledgeGraphAnalysisService,
    KnowledgeGraphCertificationService,
  ],
  exports: [
    KnowledgeEntityRegistryService,
    KnowledgeRelationRegistryService,
    KnowledgeQueryService,
    KnowledgeGraphAnalysisService,
    KnowledgeGraphCertificationService,
  ],
})
export class EnterpriseKnowledgeGraphModule {}