import { Module } from "@nestjs/common";
import { ConversationMemoryService } from "./conversation-memory.service";
import { EnterpriseKnowledgeIntelligencePlatformController } from "./enterprise-knowledge-intelligence-platform.controller";
import { EnterpriseKnowledgeIntelligencePlatformService } from "./enterprise-knowledge-intelligence-platform.service";
import { EnterpriseReasoningService } from "./enterprise-reasoning.service";
import { KnowledgeCatalogService } from "./knowledge-catalog.service";
import { KnowledgeGovernanceService } from "./knowledge-governance.service";
import { KnowledgeGraphService } from "./knowledge-graph.service";
import { PromptManagementService } from "./prompt-management.service";
import { RagRetrievalService } from "./rag-retrieval.service";
import { SemanticSearchService } from "./semantic-search.service";
import { VectorMemoryService } from "./vector-memory.service";

@Module({
  controllers: [EnterpriseKnowledgeIntelligencePlatformController],
  providers: [
    ConversationMemoryService,
    EnterpriseKnowledgeIntelligencePlatformService,
    EnterpriseReasoningService,
    KnowledgeCatalogService,
    KnowledgeGovernanceService,
    KnowledgeGraphService,
    PromptManagementService,
    RagRetrievalService,
    SemanticSearchService,
    VectorMemoryService,
  ],
  exports: [
    ConversationMemoryService,
    EnterpriseKnowledgeIntelligencePlatformService,
    EnterpriseReasoningService,
    KnowledgeCatalogService,
    KnowledgeGovernanceService,
    KnowledgeGraphService,
    PromptManagementService,
    RagRetrievalService,
    SemanticSearchService,
    VectorMemoryService,
  ],
})
export class EnterpriseKnowledgeIntelligencePlatformModule {}
