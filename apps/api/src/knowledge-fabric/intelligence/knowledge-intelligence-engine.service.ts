import { Injectable } from "@nestjs/common";
import { randomUUID } from "node:crypto";
import { KnowledgeIntelligenceEngineContract } from "./knowledge-intelligence.contracts";
import { KnowledgeIntelligenceRequest, KnowledgeIntelligenceResult, KnowledgeIntelligenceItem } from "./knowledge-intelligence.types";
import { KnowledgeSemanticSearchService } from "./knowledge-semantic-search.service";
import { KnowledgeRankingService } from "./knowledge-ranking.service";
import { KnowledgeConfidenceService } from "./knowledge-confidence.service";
import { KnowledgeConflictDetectionService } from "./knowledge-conflict-detection.service";
import { KnowledgeGapDetectionService } from "./knowledge-gap-detection.service";
import { KnowledgeInsightGeneratorService } from "./knowledge-insight-generator.service";
import { KnowledgeIntelligenceMetricsService } from "./knowledge-intelligence-metrics.service";

@Injectable()
export class KnowledgeIntelligenceEngineService implements KnowledgeIntelligenceEngineContract {
  private readonly catalog = new Map<string, KnowledgeIntelligenceItem>();
  constructor(private readonly semantic: KnowledgeSemanticSearchService, private readonly ranking: KnowledgeRankingService, private readonly confidenceService: KnowledgeConfidenceService, private readonly conflictsService: KnowledgeConflictDetectionService, private readonly gapsService: KnowledgeGapDetectionService, private readonly insightsService: KnowledgeInsightGeneratorService, private readonly metrics: KnowledgeIntelligenceMetricsService) {}
  upsert(item: KnowledgeIntelligenceItem) { this.catalog.set(item.knowledgeId, item); return item; }
  seed(items: KnowledgeIntelligenceItem[]) { items.forEach((item) => this.upsert(item)); return { accepted: items.length, total: this.catalog.size }; }
  list() { return [...this.catalog.values()]; }
  async analyze(request: KnowledgeIntelligenceRequest): Promise<KnowledgeIntelligenceResult> {
    const started = Date.now(); const correlationId = request.correlationId ?? randomUUID();
    try {
      const candidates = this.list().filter((item) => !request.namespace || item.namespace === request.namespace).filter((item) => !request.tags?.length || request.tags.every((tag) => item.tags.includes(tag)));
      const matches = this.ranking.rank(this.semantic.search(request.query, candidates, request.limit ?? 10));
      const conflicts = this.conflictsService.detect(matches.map((match) => match.item));
      const gaps = this.gapsService.detect(request.query, matches, request.namespace);
      const insights = request.includeInsights === false ? [] : this.insightsService.generate(matches, conflicts, gaps);
      const confidence = this.confidenceService.calculate(matches);
      const threshold = request.minimumConfidence ?? 0.45;
      const decision = confidence >= threshold ? "ACCEPT" : confidence >= threshold * 0.6 ? "REVIEW" : "REJECT";
      const processingTimeMs = Date.now() - started;
      this.metrics.completed(processingTimeMs, { conflicts: conflicts.length, gaps: gaps.length, insights: insights.length });
      return { success: true, correlationId, matches, conflicts, gaps, insights, confidence, decision, processingTimeMs };
    } catch (error) { this.metrics.failed(); throw error; }
  }
}