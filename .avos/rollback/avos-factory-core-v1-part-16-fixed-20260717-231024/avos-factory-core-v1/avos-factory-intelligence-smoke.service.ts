import { Injectable } from "@nestjs/common";
import { randomUUID } from "crypto";
import {
  AvosFactoryIntelligenceSmokeReport
} from "./avos-factory-intelligence.contracts";
import {
  AvosFactoryGenerationAnalyzerService
} from "./avos-factory-generation-analyzer.service";
import {
  AvosFactoryRecommendationEngineService
} from "./avos-factory-recommendation-engine.service";
import {
  AvosFactoryTemplateIntelligenceService
} from "./avos-factory-template-intelligence.service";
import {
  AvosFactoryBlueprintIntelligenceService
} from "./avos-factory-blueprint-intelligence.service";
import {
  AvosFactoryCapabilityIntelligenceService
} from "./avos-factory-capability-intelligence.service";
import {
  AvosFactoryLearningMemoryService
} from "./avos-factory-learning-memory.service";
import {
  AvosFactoryEnterpriseInsightsService
} from "./avos-factory-enterprise-insights.service";

@Injectable()
export class AvosFactoryIntelligenceSmokeService {
  constructor(
    private readonly analyzer: AvosFactoryGenerationAnalyzerService,
    private readonly recommendations: AvosFactoryRecommendationEngineService,
    private readonly templates: AvosFactoryTemplateIntelligenceService,
    private readonly blueprints: AvosFactoryBlueprintIntelligenceService,
    private readonly capabilities: AvosFactoryCapabilityIntelligenceService,
    private readonly memory: AvosFactoryLearningMemoryService,
    private readonly insights: AvosFactoryEnterpriseInsightsService
  ) {}

  run(): AvosFactoryIntelligenceSmokeReport {
    const subjectId = `part-13-smoke:${Date.now()}`;

    const analysis = this.analyzer.analyze({
      subjectId,
      actor: "system:part-13-smoke",
      source: "smoke",
      success: true,
      durationMs: 1250,
      filesGenerated: 12,
      warnings: [],
      failures: [],
      reusedCapabilities: [
        "capability:factory-blueprint",
        "capability:factory-code-generation"
      ],
      templateId: "template:factory-smoke",
      blueprintId: "blueprint:factory-smoke",
      quality: {
        architecture: 94,
        maintainability: 92,
        scalability: 91,
        security: 93,
        documentation: 90,
        reliability: 95,
        reuse: 96
      }
    });

    const recommendationList = this.recommendations.generate(subjectId);
    const memoryRecords = this.memory.learn(subjectId);
    const templateScores = this.templates.calculate();
    const blueprintScores = this.blueprints.calculate();
    const capabilityScores = this.capabilities.calculate();
    const enterpriseInsights = this.insights.generate();

    const checks = {
      generationAnalyzer: Boolean(analysis.id),
      qualityScoring: analysis.quality.overall >= 90,
      recommendationEngine: Array.isArray(recommendationList),
      templateIntelligence:
        templateScores.some((item) => item.templateId === "template:factory-smoke"),
      blueprintIntelligence:
        blueprintScores.some((item) => item.blueprintId === "blueprint:factory-smoke"),
      capabilityIntelligence:
        capabilityScores.some(
          (item) => item.capabilityId === "capability:factory-blueprint"
        ),
      learningMemory: memoryRecords.length > 0,
      enterpriseInsights: enterpriseInsights.totalAnalyses > 0,
      humanFinalAuthority:
        recommendationList.every(
          (recommendation) =>
            recommendation.status === "proposed" &&
            recommendation.humanApproved === false
        )
    };

    const blockingFindings = Object.entries(checks)
      .filter(([, passed]) => !passed)
      .map(([name]) => name);

    const score = Math.round(
      (
        Object.values(checks).filter(Boolean).length /
        Object.keys(checks).length
      ) * 100
    );

    return {
      id: randomUUID(),
      success: blockingFindings.length === 0 && score === 100,
      score,
      checks,
      blockingFindings,
      generatedAt: new Date().toISOString()
    };
  }
}
