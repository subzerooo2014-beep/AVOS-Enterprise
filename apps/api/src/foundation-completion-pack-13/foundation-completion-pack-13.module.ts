import { Module } from "@nestjs/common";
import { FoundationCompletionPack13Controller } from "./foundation-completion-pack-13.controller";
import { FoundationCompletionPack13Service } from "./foundation-completion-pack-13.service";
import { KnowledgeNodeRegistryService } from "./nodes/knowledge-node-registry.service";
import { KnowledgeRelationshipRegistryService } from "./relationships/knowledge-relationship-registry.service";
import { SemanticKnowledgeSearchService } from "./search/semantic-knowledge-search.service";
import { KnowledgeGraphTraversalService } from "./traversal/knowledge-graph-traversal.service";
import { KnowledgeGraphQualityService } from "./quality/knowledge-graph-quality.service";
import { KnowledgeGraphVersionService } from "./versions/knowledge-graph-version.service";
import { KnowledgeGraphSnapshotService } from "./snapshots/knowledge-graph-snapshot.service";
import { KnowledgeGraphReplayService } from "./replay/knowledge-graph-replay.service";
import { KnowledgeGraphHealthService } from "./health/knowledge-graph-health.service";
import { KnowledgeGraphAuditService } from "./observability/knowledge-graph-audit.service";

@Module({
  controllers: [FoundationCompletionPack13Controller],
  providers: [
    FoundationCompletionPack13Service,
    KnowledgeNodeRegistryService,
    KnowledgeRelationshipRegistryService,
    SemanticKnowledgeSearchService,
    KnowledgeGraphTraversalService,
    KnowledgeGraphQualityService,
    KnowledgeGraphVersionService,
    KnowledgeGraphSnapshotService,
    KnowledgeGraphReplayService,
    KnowledgeGraphHealthService,
    KnowledgeGraphAuditService
  ],
  exports: [
    FoundationCompletionPack13Service,
    KnowledgeNodeRegistryService,
    KnowledgeRelationshipRegistryService,
    SemanticKnowledgeSearchService,
    KnowledgeGraphTraversalService,
    KnowledgeGraphQualityService,
    KnowledgeGraphVersionService,
    KnowledgeGraphSnapshotService,
    KnowledgeGraphReplayService,
    KnowledgeGraphHealthService,
    KnowledgeGraphAuditService
  ]
})
export class FoundationCompletionPack13Module {}
