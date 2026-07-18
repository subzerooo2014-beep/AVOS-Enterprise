import { Injectable } from "@nestjs/common";
import {
  AvosFactoryEnterpriseInsights
} from "./avos-factory-intelligence.contracts";
import {
  AvosFactoryGenerationAnalyzerService
} from "./avos-factory-generation-analyzer.service";
import {
  AvosFactoryTemplateIntelligenceService
} from "./avos-factory-template-intelligence.service";
import {
  AvosFactoryCapabilityIntelligenceService
} from "./avos-factory-capability-intelligence.service";
import {
  AvosFactoryRecommendationEngineService
} from "./avos-factory-recommendation-engine.service";
import {
  AvosFactoryLearningMemoryService
} from "./avos-factory-learning-memory.service";

@Injectable()
export class AvosFactoryEnterpriseInsightsService {
  constructor(
    private readonly analyzer: AvosFactoryGenerationAnalyzerService,
    private readonly templates: AvosFactoryTemplateIntelligenceService,
    private readonly capabilities: AvosFactoryCapabilityIntelligenceService,
    private readonly recommendations: AvosFactoryRecommendationEngineService,
    private readonly memory: AvosFactoryLearningMemoryService
  ) {}

  generate(): AvosFactoryEnterpriseInsights {
    const analyses = this.analyzer.all();
    const successfulGenerations = analyses.filter(
      (analysis) => analysis.success
    ).length;
    const failedGenerations = analyses.length - successfulGenerations;
    const averageQuality =
      analyses.length === 0
        ? 0
        : Math.round(
            analyses.reduce(
              (sum, analysis) => sum + analysis.quality.overall,
              0
            ) / analyses.length
          );
    const averageDurationMs =
      analyses.length === 0
        ? 0
        : Math.round(
            analyses.reduce(
              (sum, analysis) => sum + analysis.durationMs,
              0
            ) / analyses.length
          );

    const trends: string[] = [];

    if (averageQuality >= 85) {
      trends.push("Factory quality trend is strong.");
    } else if (analyses.length > 0) {
      trends.push("Factory quality requires improvement.");
    }

    if (failedGenerations > successfulGenerations && analyses.length > 0) {
      trends.push("Failure rate exceeds success rate.");
    }

    if (this.memory.count() > 0) {
      trends.push("Factory learning memory is accumulating operational knowledge.");
    }

    return {
      totalAnalyses: analyses.length,
      successfulGenerations,
      failedGenerations,
      averageQuality,
      averageDurationMs,
      topTemplates: this.templates.calculate().slice(0, 10),
      topCapabilities: this.capabilities.calculate().slice(0, 10),
      activeRecommendations: this.recommendations.countActive(),
      criticalRecommendations: this.recommendations.countCritical(),
      learningRecords: this.memory.count(),
      trends,
      generatedAt: new Date().toISOString()
    };
  }
}
