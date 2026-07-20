import { Injectable } from "@nestjs/common";
import {
  AgsLiveIntelligence,
  AgsSourceSnapshot,
} from "./adaptive-growth-studio-live-data.contracts";

@Injectable()
export class AdaptiveGrowthStudioLiveDataNormalizer {
  normalize(sources: AgsSourceSnapshot[]): AgsLiveIntelligence {
    const sourceMap = new Map(
      sources.map((item) => [item.source, item]),
    );

    const agp = sourceMap.get("adaptive-growth-platform");
    const age = sourceMap.get("adaptive-growth-engine");
    const knowledge = sourceMap.get("knowledge-fabric");
    const capability = sourceMap.get("capability-fabric");

    const growthScore = this.numberFrom(
      [agp?.data, age?.data],
      ["score", "healthScore", "growthScore", "maturityScore"],
      0,
    );

    const revenueImpact = this.numberFrom(
      [agp?.data, age?.data],
      ["revenueImpact", "estimatedRevenueImpact", "valueCreated"],
      0,
    );

    const activeStrategies = this.numberFrom(
      [agp?.data, age?.data],
      ["activeStrategies", "strategies", "strategyCount"],
      0,
    );

    const activeExperiments = this.numberFrom(
      [agp?.data, age?.data],
      ["activeExperiments", "experiments", "experimentCount"],
      0,
    );

    const knowledgeDocuments = this.numberFrom(
      [knowledge?.data],
      ["documents", "documentCount", "indexedDocuments"],
      0,
    );

    const knowledgeEntities = this.numberFrom(
      [knowledge?.data],
      ["entities", "entityCount", "nodes"],
      0,
    );

    const knowledgeRelationships = this.numberFrom(
      [knowledge?.data],
      ["relationships", "relationshipCount", "edges"],
      0,
    );

    const capabilitiesTotal = this.numberFrom(
      [capability?.data],
      ["total", "capabilities", "registeredCapabilities"],
      0,
    );

    const capabilitiesHealthy = this.numberFrom(
      [capability?.data],
      ["healthy", "healthyCapabilities", "operational"],
      0,
    );

    const forecastConfidence = this.numberFrom(
      [agp?.data, age?.data],
      ["forecastConfidence", "confidence"],
      0,
    );

    const operationalSources = sources.filter(
      (item) => item.status === "operational",
    ).length;

    const overallStatus =
      operationalSources === sources.length
        ? "operational"
        : "degraded";

    return {
      status: overallStatus,
      freshness: {
        generatedAt: new Date().toISOString(),
        maxSourceAgeSeconds: 0,
      },
      sources,
      metrics: [
        {
          id: "growth-score",
          title: "Growth Score",
          value: growthScore,
          trend: this.numberFrom(
            [agp?.data, age?.data],
            ["growthTrend", "trend"],
            0,
          ),
          status: growthScore >= 80 ? "positive" : "warning",
          source: "adaptive-growth-engine",
          evidence: [
            age?.endpoint ?? "",
            agp?.endpoint ?? "",
          ].filter(Boolean),
        },
        {
          id: "active-strategies",
          title: "Active Strategies",
          value: activeStrategies,
          trend: 0,
          status:
            activeStrategies > 0
              ? "positive"
              : "neutral",
          source: "adaptive-growth-platform",
          evidence: [agp?.endpoint ?? ""].filter(Boolean),
        },
        {
          id: "active-experiments",
          title: "Active Experiments",
          value: activeExperiments,
          trend: 0,
          status:
            activeExperiments > 0
              ? "positive"
              : "neutral",
          source: "adaptive-growth-engine",
          evidence: [age?.endpoint ?? ""].filter(Boolean),
        },
        {
          id: "revenue-impact",
          title: "Revenue Impact",
          value: revenueImpact,
          trend: 0,
          status:
            revenueImpact > 0
              ? "positive"
              : "neutral",
          source: "adaptive-growth-platform",
          evidence: [agp?.endpoint ?? ""].filter(Boolean),
        },
      ],
      opportunities: this.extractOpportunities(
        agp?.data,
        age?.data,
      ),
      recommendations: this.extractRecommendations(
        agp?.data,
        age?.data,
      ),
      knowledge: {
        documents: knowledgeDocuments,
        entities: knowledgeEntities,
        relationships: knowledgeRelationships,
        confidence: this.numberFrom(
          [knowledge?.data],
          ["confidence", "retrievalConfidence", "score"],
          0,
        ),
      },
      capabilities: {
        total: capabilitiesTotal,
        healthy: capabilitiesHealthy,
        degraded: Math.max(
          0,
          capabilitiesTotal - capabilitiesHealthy,
        ),
        readinessScore: this.numberFrom(
          [capability?.data],
          ["readinessScore", "score", "healthScore"],
          0,
        ),
      },
      growth: {
        score: growthScore,
        activeStrategies,
        activeExperiments,
        revenueImpact,
        forecastConfidence,
      },
      humanFinalAuthority: true,
    };
  }

  private numberFrom(
    objects: Array<Record<string, unknown> | undefined>,
    keys: string[],
    fallback: number,
  ): number {
    for (const object of objects) {
      if (!object) {
        continue;
      }

      for (const key of keys) {
        const value = this.deepFind(object, key);
        const parsed = Number(value);

        if (Number.isFinite(parsed)) {
          return parsed;
        }
      }
    }

    return fallback;
  }

  private deepFind(
    value: unknown,
    key: string,
  ): unknown {
    if (!value || typeof value !== "object") {
      return undefined;
    }

    const record = value as Record<string, unknown>;

    if (key in record) {
      return record[key];
    }

    for (const child of Object.values(record)) {
      const found = this.deepFind(child, key);

      if (found !== undefined) {
        return found;
      }
    }

    return undefined;
  }

  private extractOpportunities(
    agp?: Record<string, unknown>,
    age?: Record<string, unknown>,
  ): AgsLiveIntelligence["opportunities"] {
    const raw =
      this.deepFind(age, "opportunities") ??
      this.deepFind(agp, "opportunities");

    if (!Array.isArray(raw)) {
      return [];
    }

    return raw.slice(0, 10).map((item, index) => {
      const record = item as Record<string, unknown>;

      return {
        id: String(
          record.id ?? `opportunity:${index + 1}`,
        ),
        title: String(
          record.title ??
            record.name ??
            `Growth Opportunity ${index + 1}`,
        ),
        score: Number(record.score ?? 0),
        confidence: Number(record.confidence ?? 0),
        source: "adaptive-growth-engine",
        rationale: String(
          record.rationale ?? record.reason ?? "",
        ),
        requiresHumanApproval:
          record.requiresHumanApproval !== false,
      };
    });
  }

  private extractRecommendations(
    agp?: Record<string, unknown>,
    age?: Record<string, unknown>,
  ): AgsLiveIntelligence["recommendations"] {
    const raw =
      this.deepFind(age, "recommendations") ??
      this.deepFind(agp, "recommendations");

    if (!Array.isArray(raw)) {
      return [];
    }

    return raw.slice(0, 10).map((item, index) => {
      const record = item as Record<string, unknown>;

      return {
        id: String(
          record.id ?? `recommendation:${index + 1}`,
        ),
        title: String(
          record.title ??
            record.name ??
            `Recommendation ${index + 1}`,
        ),
        confidence: Number(record.confidence ?? 0),
        impact: String(
          record.impact ??
            record.expectedImpact ??
            "",
        ),
        source: "adaptive-growth-engine",
        requiresHumanApproval:
          record.requiresHumanApproval !== false,
      };
    });
  }
}