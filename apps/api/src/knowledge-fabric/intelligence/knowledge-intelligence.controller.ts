import { Body, Controller, Get, Param, Post, Query } from "@nestjs/common";
import { KnowledgeIntelligenceEngineService } from "./knowledge-intelligence-engine.service";
import { KnowledgeIntelligenceHealthService } from "./knowledge-intelligence-health.service";
import { KnowledgeIntelligenceMetricsService } from "./knowledge-intelligence-metrics.service";
import { KnowledgeLearningLoopService } from "./knowledge-learning-loop.service";
import { KnowledgeReasoningEngineService } from "./knowledge-reasoning-engine.service";
import { KnowledgeRecommendationService } from "./knowledge-recommendation.service";
import { KnowledgeSimilarityService } from "./knowledge-similarity.service";
import { KnowledgeIntelligenceItem, KnowledgeIntelligenceRequest } from "./knowledge-intelligence.types";
import { KnowledgeLearningSignal } from "./knowledge-intelligence.contracts";

@Controller("knowledge-fabric/intelligence")
export class KnowledgeIntelligenceController {
  constructor(private readonly engine: KnowledgeIntelligenceEngineService, private readonly healthService: KnowledgeIntelligenceHealthService, private readonly metrics: KnowledgeIntelligenceMetricsService, private readonly learning: KnowledgeLearningLoopService, private readonly reasoning: KnowledgeReasoningEngineService, private readonly recommendations: KnowledgeRecommendationService, private readonly similarity: KnowledgeSimilarityService) {}
  @Get("status") status() { return this.healthService.health(); }
  @Get("health") health() { return this.healthService.health(); }
  @Get("metrics") metricsSnapshot() { return this.metrics.snapshot(); }
  @Get("catalog") catalog() { return this.engine.list(); }
  @Post("catalog/seed") seed(@Body() items: KnowledgeIntelligenceItem[]) { return this.engine.seed(items); }
  @Post("catalog/upsert") upsert(@Body() item: KnowledgeIntelligenceItem) { return this.engine.upsert(item); }
  @Post("analyze") analyze(@Body() request: KnowledgeIntelligenceRequest) { return this.engine.analyze(request); }
  @Post("reason") async reason(@Body() request: KnowledgeIntelligenceRequest) { const result = await this.engine.analyze(request); return this.reasoning.reason(request.query, result.matches); }
  @Post("recommend") async recommend(@Body() request: KnowledgeIntelligenceRequest) { const result = await this.engine.analyze(request); return this.recommendations.recommend(result.matches, request.limit ?? 5); }
  @Get("similar/:knowledgeId") similar(@Param("knowledgeId") knowledgeId: string, @Query("limit") limit?: string) { const source = this.engine.list().find((item) => item.knowledgeId === knowledgeId); return source ? this.similarity.findSimilar(source, this.engine.list(), Number(limit ?? 5)) : []; }
  @Post("learning/signals") recordSignal(@Body() signal: KnowledgeLearningSignal) { return this.learning.record(signal); }
  @Get("learning/signals") signals(@Query("limit") limit?: string) { return this.learning.list(Number(limit ?? 100)); }
  @Get("learning/summary") learningSummary() { return this.learning.summary(); }
}