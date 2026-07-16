import { Injectable } from "@nestjs/common";
import { EnterpriseReasoningService } from "./enterprise-reasoning.service";
import { KnowledgeCatalogService } from "./knowledge-catalog.service";
import { KnowledgeGovernanceService } from "./knowledge-governance.service";
import { KnowledgeGraphService } from "./knowledge-graph.service";
import { PromptManagementService } from "./prompt-management.service";
import { SemanticSearchService } from "./semantic-search.service";
import { VectorMemoryService } from "./vector-memory.service";
import type { KnowledgeHealth, KnowledgeMetrics } from "./enterprise-knowledge-intelligence.types";

@Injectable()
export class EnterpriseKnowledgeIntelligencePlatformService {
  constructor(
    private readonly graph: KnowledgeGraphService,
    private readonly catalog: KnowledgeCatalogService,
    private readonly vectors: VectorMemoryService,
    private readonly prompts: PromptManagementService,
    private readonly search: SemanticSearchService,
    private readonly reasoning: EnterpriseReasoningService,
    private readonly governance: KnowledgeGovernanceService,
  ) {}

  metrics(): KnowledgeMetrics {
    return {
      nodes: this.graph.nodeCount(),
      edges: this.graph.edgeCount(),
      documents: this.catalog.count(),
      vectorMemories: this.vectors.count(),
      prompts: this.prompts.count(),
      searches: this.search.searchCount(),
      retrievals: this.vectors.retrievalCount(),
      reasoningSessions: this.reasoning.sessionCount(),
    };
  }

  health(): KnowledgeHealth {
    const governance = this.governance.validate();
    return {
      success: true,
      system: "AVOS Enterprise Knowledge Intelligence Platform",
      version: "1.0.0",
      status: governance.compliant ? "READY" : "DEGRADED",
      metrics: this.metrics(),
      components: {
        knowledgeGraph: "READY",
        semanticSearch: "READY",
        vectorMemory: "READY",
        knowledgeCatalog: "READY",
        documentIntelligence: "READY",
        ragFoundation: "READY",
        promptManagement: "READY",
        conversationMemory: "READY",
        knowledgeVersioning: "READY",
        governance: governance.compliant ? "READY" : "DEGRADED",
        analytics: "READY",
        contextFusion: "READY",
        enterpriseReasoning: "READY",
        decisionSupport: "READY",
      },
    };
  }

  diagnostics() {
    return {
      success: true,
      health: this.health(),
      nodes: this.graph.listNodes(),
      edges: this.graph.listEdges(),
      documents: this.catalog.list(),
      prompts: this.prompts.list(),
      governance: this.governance.validate(),
    };
  }
}
