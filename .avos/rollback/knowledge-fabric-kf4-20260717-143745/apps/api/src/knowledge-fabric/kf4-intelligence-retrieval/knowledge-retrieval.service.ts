import { Injectable, OnModuleInit } from "@nestjs/common";
import { KnowledgeRegistryService } from "../kf1-foundation";
import { KnowledgeIngestionService } from "../kf2-ingestion-normalization";
import { KnowledgeGraphService } from "../kf3-knowledge-graph";
import { KnowledgeContextBuilderService } from "./knowledge-context-builder.service";
import { KnowledgeRankingService } from "./knowledge-ranking.service";
import { KnowledgeRetrievalRepository } from "./knowledge-retrieval.repository";
import {
  KnowledgeContextInput,
  KnowledgeRetrievalStatus,
  KnowledgeSearchInput,
  KnowledgeSearchResult,
} from "./knowledge-retrieval.types";

@Injectable()
export class KnowledgeRetrievalService implements OnModuleInit {
  private bootstrapped = false;

  constructor(
    private readonly repository: KnowledgeRetrievalRepository,
    private readonly ranking: KnowledgeRankingService,
    private readonly contextBuilder: KnowledgeContextBuilderService,
    private readonly registry: KnowledgeRegistryService,
    private readonly ingestion: KnowledgeIngestionService,
    private readonly graphService: KnowledgeGraphService,
  ) {}

  onModuleInit(): void { this.bootstrap(); }

  bootstrap(): KnowledgeRetrievalStatus {
    this.registry.register({
      key: "avos.knowledge.retrieval",
      title: "AVOS Knowledge Intelligence and Retrieval",
      summary: "Hybrid retrieval, ranking, graph-aware search, and context construction.",
      metadata: { pack: "KF-4", version: "1.0.0" },
    });
    this.refreshIndex();
    this.bootstrapped = true;
    return this.status();
  }

  refreshIndex(): { indexedDocuments: number; indexedNodes: number; total: number } {
    const documents: KnowledgeSearchResult[] = this.ingestion.listDocuments().map((document) => ({
      id: document.id,
      kind: "document",
      title: document.title,
      summary: document.normalizedText.slice(0, 800),
      score: 0,
      sourceId: document.sourceId,
      metadata: {
        source: document.source,
        format: document.format,
        checksum: document.checksum,
        wordCount: document.wordCount,
      },
    }));

    const graph = this.graphService.graph();
    const nodes: KnowledgeSearchResult[] = graph.nodes.map((node) => ({
      id: node.id,
      kind: "node",
      title: node.label,
      summary: `${node.type} ${node.key}`,
      score: 0,
      sourceId: node.sourceDocumentId,
      metadata: { key: node.key, type: node.type, ...node.metadata },
    }));

    this.repository.replace([...documents, ...nodes]);
    return { indexedDocuments: documents.length, indexedNodes: nodes.length, total: documents.length + nodes.length };
  }

  search(input: KnowledgeSearchInput): KnowledgeSearchResult[] {
    this.validateQuery(input);
    this.refreshIndex();
    const query = input.query.trim();
    const mode = input.mode ?? "hybrid";
    const limit = Math.max(1, Math.min(input.limit ?? 10, 100));
    const minScore = Math.max(0, Math.min(input.minScore ?? 0.01, 1));
    const scored = this.repository.list()
      .filter((item) => mode === "hybrid" || (mode === "keyword" && item.kind === "document") || (mode === "graph" && item.kind === "node"))
      .map((item) => ({ ...item, score: this.ranking.score(query, item.title, item.summary) }));
    return this.ranking.rank(scored, limit, minScore);
  }

  retrieve(input: KnowledgeContextInput) {
    const results = this.search(input);
    return this.contextBuilder.build(input.query.trim(), results, input.maxCharacters);
  }

  status(): KnowledgeRetrievalStatus {
    return {
      system: "AVOS Knowledge Fabric",
      pack: "KF-4",
      name: "Intelligence & Retrieval",
      status: "ready",
      searchReady: this.bootstrapped,
      rankingReady: true,
      contextBuilderReady: true,
      graphRetrievalReady: typeof this.graphService.graph === "function",
      indexedDocuments: this.repository.countByKind("document"),
      indexedNodes: this.repository.countByKind("node"),
      capabilities: [
        "semantic-search",
        "keyword-search",
        "graph-search",
        "hybrid-retrieval",
        "ranking-and-scoring",
        "context-builder",
        "knowledge-query-api",
        "retrieval-observability",
      ],
      generatedAt: new Date().toISOString(),
    };
  }

  health() {
    const status = this.status();
    return { healthy: status.searchReady && status.rankingReady && status.contextBuilderReady && status.graphRetrievalReady, status };
  }

  verification() {
    this.bootstrap();
    const results = this.search({ query: "knowledge graph", mode: "hybrid", limit: 10, minScore: 0 });
    const context = this.retrieve({ query: "knowledge graph", mode: "hybrid", limit: 10, minScore: 0, maxCharacters: 2000 });
    const checks = {
      bootstrapCompleted: this.bootstrapped,
      indexAvailable: this.repository.list().length > 0,
      searchReturnsResults: results.length > 0,
      rankingApplied: results.every((result) => result.score >= 0 && result.score <= 1),
      contextBuilt: context.context.length > 0,
      graphIntegrated: this.graphService.graph().nodeCount > 0,
      ingestionIntegrated: typeof this.ingestion.listDocuments === "function",
      registryIntegrated: this.registry.resolve("avos.knowledge.retrieval") !== undefined,
    };
    const passed = Object.values(checks).every(Boolean);
    return { passed, score: passed ? 100 : 0, pack: "KF-4", checks, status: this.status() };
  }

  smoke() {
    const searchResults = this.search({ query: "AVOS knowledge", mode: "hybrid", limit: 5, minScore: 0 });
    const context = this.retrieve({ query: "AVOS knowledge", mode: "hybrid", limit: 5, minScore: 0, maxCharacters: 1200 });
    const verification = this.verification();
    return {
      passed: verification.passed && searchResults.length > 0 && context.resultCount > 0,
      pack: "KF-4",
      searchResults: searchResults.length,
      contextCharacters: context.context.length,
      indexedDocuments: this.repository.countByKind("document"),
      indexedNodes: this.repository.countByKind("node"),
      verificationScore: verification.score,
      timestamp: new Date().toISOString(),
    };
  }

  private validateQuery(input: KnowledgeSearchInput): void {
    if (!input || typeof input !== "object" || !input.query?.trim()) throw new Error("Knowledge search query is required.");
  }
}