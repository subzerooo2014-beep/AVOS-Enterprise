import { Body, Controller, Get, Param, Post, Query } from "@nestjs/common";
import { CapabilityRegistryService } from "../capability-fabric/capability-registry.service";
import { CapabilityIntelligenceService } from "./capability-intelligence.service";

@Controller("capability-fabric/intelligence")
export class CapabilityIntelligenceController {
  constructor(
    private readonly intelligence: CapabilityIntelligenceService,
    private readonly registry: CapabilityRegistryService,
  ) {}

  @Get("status")
  status() {
    return this.intelligence.framework();
  }

  @Post("knowledge/synchronize")
  synchronizeKnowledge() {
    return this.intelligence.synchronizeKnowledge();
  }

  @Get("knowledge/search")
  knowledgeSearch(@Query("q") query = "") {
    return {
      success: true,
      results: this.intelligence.knowledgeSearch(query),
    };
  }

  @Post("capabilities/:key/analyze")
  analyze(@Param("key") key: string) {
    return {
      success: true,
      insight: this.intelligence.analyze(key),
    };
  }

  @Post("analyze-all")
  analyzeAll() {
    return {
      success: true,
      insights: this.intelligence.analyzeAll(),
    };
  }

  @Get("capabilities/:key/insight")
  insight(@Param("key") key: string) {
    return {
      success: true,
      insight: this.intelligence.getLatest(key),
    };
  }

  @Get("capabilities/:key/memory")
  memory(@Param("key") key: string) {
    return {
      success: true,
      timeline: this.intelligence.memoryTimeline(key),
    };
  }

  @Get("ranking")
  ranking(
    @Query("metric")
    metric:
      | "qualityIndex"
      | "trustScore"
      | "maturityScore"
      | "riskScore"
      | "technicalDebtScore"
      | "reuseScore" = "qualityIndex",
    @Query("direction") direction: "asc" | "desc" = "desc",
  ) {
    return {
      success: true,
      metric,
      direction,
      ranking: this.intelligence.rankBy(metric, direction),
    };
  }

  @Get("snapshot")
  snapshot() {
    return {
      success: true,
      snapshot: this.intelligence.snapshot(),
    };
  }

  @Post("smoke")
  smoke() {
    const key = "avos.capability-intelligence.smoke";

    if (!this.registry.get(key)) {
      const registration = this.registry.register({
        key,
        name: "Capability Intelligence Smoke Capability",
        kind: "PLATFORM_SERVICE",
        owner: "AVOS Capability Fabric",
        summary: "Capability used to validate CF-4 intelligence.",
        businessValue: "Confirms scoring, risk, memory, and recommendations.",
        lifecycleStage: "CORE_ENGINE",
        tags: ["intelligence", "smoke", "capability-fabric"],
        outcomes: ["Validate CF-4 intelligence services"],
        nonGoals: ["Production workload processing"],
        contracts: [
          {
            id: "cfi-smoke-api",
            name: "Capability Intelligence Smoke API",
            version: "1.0.0",
            type: "API",
            compatibility: "BACKWARD",
            required: true,
          },
        ],
        policies: [
          {
            policyId: "avos.foundation-first",
            policyVersion: "1.0.0",
            enforcement: "MANDATORY",
            inherited: true,
          },
        ],
        permissions: [
          {
            action: "analyze",
            resource: "capability-intelligence",
            roles: ["AVOS_ARCHITECT"],
            approvalRequired: false,
          },
        ],
        events: [
          {
            name: "capability.intelligence.smoke",
            version: "1.0.0",
            direction: "PUBLISHES",
            durable: true,
          },
        ],
        metrics: [
          {
            name: "capability_intelligence_smoke",
            unit: "count",
            type: "COUNTER",
          },
        ],
        health: {
          healthEndpoint: "/capability-fabric/intelligence/status",
        },
        runtime: {
          runtime: "NODE",
          stateless: true,
          multiTenant: true,
          supportsIsolation: true,
        },
        security: {
          classification: "INTERNAL",
          authenticationRequired: true,
          authorizationRequired: true,
          dataSensitivity: ["architecture-metadata"],
          trustBoundary: "AVOS_ENTERPRISE_PLATFORM",
        },
        documentationRef:
          "docs/architecture/capability-fabric/CF-4-CAPABILITY-INTELLIGENCE.md",
      });

      if (!registration.success) {
        return registration;
      }

      this.registry.transitionStatus(key, "ACTIVE");
    }

    const insight = this.intelligence.analyze(key);
    const snapshot = this.intelligence.snapshot();

    return {
      success:
        insight.score.qualityIndex > 0 &&
        insight.score.trustScore > 0 &&
        insight.score.maturityScore > 0,
      system: "AVOS Capability Fabric",
      megaPack: "CF-4 Capability Intelligence",
      qualityIndex: insight.score.qualityIndex,
      trustScore: insight.score.trustScore,
      maturityScore: insight.score.maturityScore,
      riskScore: insight.score.riskScore,
      technicalDebtScore: insight.score.technicalDebtScore,
      recommendations: insight.recommendations.length,
      duplicateCandidates: insight.duplicates.length,
      memoryEvents: snapshot.memoryEvents,
      knowledgeRecords: snapshot.knowledgeRecords,
      pillars: this.intelligence.framework().pillars.length,
      snapshot,
    };
  }
}