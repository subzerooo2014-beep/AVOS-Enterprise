import { Body, Controller, Get, Param, Post, Query } from "@nestjs/common";
import { ConversationMemoryService } from "./conversation-memory.service";
import { EnterpriseKnowledgeIntelligencePlatformService } from "./enterprise-knowledge-intelligence-platform.service";
import { EnterpriseReasoningService } from "./enterprise-reasoning.service";
import { KnowledgeCatalogService } from "./knowledge-catalog.service";
import { KnowledgeGraphService } from "./knowledge-graph.service";
import { PromptManagementService } from "./prompt-management.service";
import { RagRetrievalService } from "./rag-retrieval.service";
import { SemanticSearchService } from "./semantic-search.service";
import { VectorMemoryService } from "./vector-memory.service";
import type { KnowledgeDocument, KnowledgeEdge, KnowledgeNode, PromptTemplate } from "./enterprise-knowledge-intelligence.types";

@Controller("enterprise-knowledge-intelligence-platform")
export class EnterpriseKnowledgeIntelligencePlatformController {
  constructor(
    private readonly platform: EnterpriseKnowledgeIntelligencePlatformService,
    private readonly graph: KnowledgeGraphService,
    private readonly catalog: KnowledgeCatalogService,
    private readonly vectors: VectorMemoryService,
    private readonly search: SemanticSearchService,
    private readonly rag: RagRetrievalService,
    private readonly prompts: PromptManagementService,
    private readonly conversations: ConversationMemoryService,
    private readonly reasoning: EnterpriseReasoningService,
  ) {}

  @Get("status")
  status() { return this.platform.health(); }

  @Get("diagnostics")
  diagnostics() { return this.platform.diagnostics(); }

  @Post("nodes")
  upsertNode(@Body() body: Omit<KnowledgeNode, "version" | "createdAt" | "updatedAt">) {
    return { success: true, node: this.graph.upsertNode(body) };
  }

  @Post("edges")
  connect(@Body() body: Omit<KnowledgeEdge, "id" | "createdAt"> & { id?: string }) {
    return { success: true, edge: this.graph.connect(body) };
  }

  @Post("documents")
  upsertDocument(@Body() body: Omit<KnowledgeDocument, "version" | "createdAt" | "updatedAt">) {
    const document = this.catalog.upsert(body);
    this.vectors.store("knowledge", document.content, {
      title: document.title,
      documentId: document.id,
      tags: document.tags,
    });
    return { success: true, document };
  }

  @Get("search")
  semanticSearch(@Query("q") query: string, @Query("limit") limit?: string) {
    return {
      success: true,
      items: this.search.search(query ?? "", "knowledge", Number(limit ?? 10)),
    };
  }

  @Post("retrieve")
  retrieve(@Body() body: { query: string; limit?: number; promptId?: string }) {
    return this.rag.retrieve(body.query, "knowledge", body.limit ?? 5, body.promptId);
  }

  @Post("prompts")
  registerPrompt(@Body() body: PromptTemplate) {
    return { success: true, prompt: this.prompts.register(body) };
  }

  @Post("conversations/:id/messages")
  appendMessage(
    @Param("id") id: string,
    @Body() body: { role: "USER" | "ASSISTANT" | "SYSTEM"; content: string },
  ) {
    return { success: true, message: this.conversations.append(id, body.role, body.content) };
  }

  @Get("conversations/:id")
  conversationHistory(@Param("id") id: string) {
    return { success: true, items: this.conversations.history(id) };
  }

  @Post("reason")
  reason(@Body() body: { question: string; entityId?: string }) {
    return this.reasoning.reason(body.question, body.entityId);
  }
}
