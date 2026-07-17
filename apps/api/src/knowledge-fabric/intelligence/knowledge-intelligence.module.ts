import { Module } from "@nestjs/common";
import { KnowledgeConfidenceService } from "./knowledge-confidence.service";
import { KnowledgeConflictDetectionService } from "./knowledge-conflict-detection.service";
import { KnowledgeGapDetectionService } from "./knowledge-gap-detection.service";
import { KnowledgeInsightGeneratorService } from "./knowledge-insight-generator.service";
import { KnowledgeIntelligenceController } from "./knowledge-intelligence.controller";
import { KnowledgeIntelligenceEngineService } from "./knowledge-intelligence-engine.service";
import { KnowledgeIntelligenceHealthService } from "./knowledge-intelligence-health.service";
import { KnowledgeIntelligenceMetricsService } from "./knowledge-intelligence-metrics.service";
import { KnowledgeLearningLoopService } from "./knowledge-learning-loop.service";
import { KnowledgeRankingService } from "./knowledge-ranking.service";
import { KnowledgeReasoningEngineService } from "./knowledge-reasoning-engine.service";
import { KnowledgeRecommendationService } from "./knowledge-recommendation.service";
import { KnowledgeSemanticSearchService } from "./knowledge-semantic-search.service";
import { KnowledgeSimilarityService } from "./knowledge-similarity.service";

const providers = [KnowledgeSemanticSearchService, KnowledgeSimilarityService, KnowledgeConfidenceService, KnowledgeRankingService, KnowledgeConflictDetectionService, KnowledgeGapDetectionService, KnowledgeInsightGeneratorService, KnowledgeRecommendationService, KnowledgeLearningLoopService, KnowledgeIntelligenceMetricsService, KnowledgeReasoningEngineService, KnowledgeIntelligenceEngineService, KnowledgeIntelligenceHealthService];
@Module({ controllers: [KnowledgeIntelligenceController], providers, exports: providers })
export class KnowledgeIntelligenceModule {}