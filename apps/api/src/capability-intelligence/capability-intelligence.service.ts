import { Injectable } from "@nestjs/common";
import { CapabilityRegistryService } from "../capability-fabric/capability-registry.service";
import {
  CAPABILITY_INTELLIGENCE_PILLARS,
  CAPABILITY_INTELLIGENCE_VERSION,
} from "./capability-intelligence.registry";
import { CapabilityDuplicateDetectorService } from "./capability-duplicate-detector.service";
import { CapabilityKnowledgeService } from "./capability-knowledge.service";
import { CapabilityMemoryService } from "./capability-memory.service";
import { CapabilityRecommendationService } from "./capability-recommendation.service";
import { CapabilityRiskService } from "./capability-risk.service";
import { CapabilityScoringService } from "./capability-scoring.service";
import { CapabilityUsageAnalyticsService } from "./capability-usage-analytics.service";
import {
  CapabilityInsight,
  CapabilityIntelligenceSnapshot,
} from "./capability-intelligence.types";

@Injectable()
export class CapabilityIntelligenceService {
  private readonly latest = new Map<string, CapabilityInsight>();

  constructor(
    private readonly registry: CapabilityRegistryService,
    private readonly knowledge: CapabilityKnowledgeService,
    private readonly memory: CapabilityMemoryService,
    private readonly usage: CapabilityUsageAnalyticsService,
    private readonly scoring: CapabilityScoringService,
    private readonly duplicates: CapabilityDuplicateDetectorService,
    private readonly risk: CapabilityRiskService,
    private readonly recommendations: CapabilityRecommendationService,
  ) {}

  framework() {
    return {
      success: true,
      system: "AVOS Capability Fabric",
      megaPack: "CF-4 Capability Intelligence",
      version: CAPABILITY_INTELLIGENCE_VERSION,
      architecturalPrinciple: "Foundation First",
      status: "OPERATIONAL",
      pillars: [...CAPABILITY_INTELLIGENCE_PILLARS],
      analyzedCapabilities: this.latest.size,
      knowledgeRecords: this.knowledge.list().length,
      memoryEvents: this.memory.count(),
    };
  }

  synchronizeKnowledge() {
    return this.knowledge.synchronize();
  }

  analyze(capabilityKey: string): CapabilityInsight {
    const capability = this.registry.get(capabilityKey);
    if (!capability) {
      throw new Error(`Capability not found: ${capabilityKey}`);
    }

    this.knowledge.synchronize();

    const usage = this.usage.profile(capabilityKey);
    const score = this.scoring.evaluate(capabilityKey);
    const risks = this.risk.assess(capabilityKey);
    const duplicates = this.duplicates.detect(capabilityKey);
    const recommendations = this.recommendations.generate({
      capabilityKey: capability.identity.key,
      score,
      usage,
      risks,
      duplicates,
    });

    const insight: CapabilityInsight = {
      capabilityKey: capability.identity.key,
      score,
      usage,
      risks,
      duplicates,
      recommendations,
      generatedAt: new Date().toISOString(),
    };

    this.latest.set(capability.identity.key, insight);
    this.memory.record(
      capability.identity.key,
      "INSIGHT_GENERATED",
      {
        qualityIndex: score.qualityIndex,
        trustScore: score.trustScore,
        maturityScore: score.maturityScore,
        riskScore: score.riskScore,
        recommendationCount: recommendations.length,
      },
    );

    if (recommendations.length > 0) {
      this.memory.record(
        capability.identity.key,
        "RECOMMENDATION_GENERATED",
        { recommendationCount: recommendations.length },
      );
    }

    return structuredClone(insight);
  }

  analyzeAll() {
    return this.registry
      .list()
      .map((capability) => this.analyze(capability.identity.key));
  }

  getLatest(capabilityKey: string) {
    const insight = this.latest.get(capabilityKey.toLowerCase());
    return insight ? structuredClone(insight) : null;
  }

  rankBy(
    metric:
      | "qualityIndex"
      | "trustScore"
      | "maturityScore"
      | "riskScore"
      | "technicalDebtScore"
      | "reuseScore",
    direction: "asc" | "desc" = "desc",
  ) {
    const insights =
      this.latest.size > 0 ? [...this.latest.values()] : this.analyzeAll();

    return insights
      .map((insight) => ({
        capabilityKey: insight.capabilityKey,
        value: insight.score[metric],
      }))
      .sort((left, right) =>
        direction === "asc"
          ? left.value - right.value
          : right.value - left.value,
      );
  }

  knowledgeSearch(query: string) {
    this.knowledge.synchronize();
    return this.knowledge.search(query);
  }

  memoryTimeline(capabilityKey: string) {
    return this.memory.timeline(capabilityKey);
  }

  snapshot(): CapabilityIntelligenceSnapshot {
    const insights =
      this.latest.size > 0 ? [...this.latest.values()] : this.analyzeAll();

    const average = (selector: (insight: CapabilityInsight) => number) =>
      insights.length === 0
        ? 0
        : insights.reduce(
            (total, insight) => total + selector(insight),
            0,
          ) / insights.length;

    return {
      capabilitiesAnalyzed: insights.length,
      averageQualityIndex: this.round(
        average((insight) => insight.score.qualityIndex),
      ),
      averageTrustScore: this.round(
        average((insight) => insight.score.trustScore),
      ),
      averageMaturityScore: this.round(
        average((insight) => insight.score.maturityScore),
      ),
      averageRiskScore: this.round(
        average((insight) => insight.score.riskScore),
      ),
      averageTechnicalDebtScore: this.round(
        average((insight) => insight.score.technicalDebtScore),
      ),
      recommendations: insights.reduce(
        (total, insight) => total + insight.recommendations.length,
        0,
      ),
      duplicateCandidates: insights.reduce(
        (total, insight) => total + insight.duplicates.length,
        0,
      ),
      memoryEvents: this.memory.count(),
      knowledgeRecords: this.knowledge.list().length,
      generatedAt: new Date().toISOString(),
    };
  }

  private round(value: number) {
    return Math.round(value * 100) / 100;
  }
}