import { Module } from "@nestjs/common";
import { EnterpriseBrainMegaPack2Controller } from "./enterprise-brain-mega-pack-2.controller";
import { EnterpriseBrainMegaPack2Service } from "./enterprise-brain-mega-pack-2.service";
import { BrainKnowledgeAuditService } from "./observability/brain-knowledge-audit.service";
import { BrainKnowledgeGraphService } from "./knowledge/brain-knowledge-graph.service";
import { BrainOntologyRegistryService } from "./ontology/brain-ontology-registry.service";
import { BrainSemanticIndexService } from "./semantic/brain-semantic-index.service";
import { BrainMemoryStoreService } from "./memory/brain-memory-store.service";
import { BrainMemoryRetrievalService } from "./retrieval/brain-memory-retrieval.service";
import { BrainMemoryConsolidationService } from "./consolidation/brain-memory-consolidation.service";
import { BrainKnowledgeValidationService } from "./validation/brain-knowledge-validation.service";
import { BrainKnowledgeMemoryHealthService } from "./health/brain-knowledge-memory-health.service";

@Module({
  controllers: [EnterpriseBrainMegaPack2Controller],
  providers: [
    EnterpriseBrainMegaPack2Service,
    BrainKnowledgeAuditService,
    BrainKnowledgeGraphService,
    BrainOntologyRegistryService,
    BrainSemanticIndexService,
    BrainMemoryStoreService,
    BrainMemoryRetrievalService,
    BrainMemoryConsolidationService,
    BrainKnowledgeValidationService,
    BrainKnowledgeMemoryHealthService
  ],
  exports: [
    EnterpriseBrainMegaPack2Service,
    BrainKnowledgeAuditService,
    BrainKnowledgeGraphService,
    BrainOntologyRegistryService,
    BrainSemanticIndexService,
    BrainMemoryStoreService,
    BrainMemoryRetrievalService,
    BrainMemoryConsolidationService,
    BrainKnowledgeValidationService,
    BrainKnowledgeMemoryHealthService
  ]
})
export class EnterpriseBrainMegaPack2Module {}
