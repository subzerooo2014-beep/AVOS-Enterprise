import { Injectable } from "@nestjs/common";
import {
  IntelligenceInsight,
  IntelligenceRequest,
  IntelligenceSignal,
} from "../contracts/intelligence-fabric.contracts";

@Injectable()
export class IntelligenceAnalysisService {
  analyze(request: IntelligenceRequest): readonly IntelligenceInsight[] {
    const signals = request.signals ?? [];
    const grouped = this.groupByType(signals);

    const insights: IntelligenceInsight[] = [];
    for (const [type, items] of grouped.entries()) {
      const confidence =
        items.length === 0
          ? 0
          : items.reduce((sum, item) => sum + item.confidence, 0) /
            items.length;

      insights.push({
        id: `insight:${type}:${Date.now()}:${Math.random().toString(36).slice(2, 7)}`,
        title: `${type} intelligence`,
        summary: `Detected ${items.length} signal(s) related to ${type} for objective: ${request.objective}.`,
        confidence: Number(confidence.toFixed(4)),
        priority: this.priority(confidence, items.length),
        evidenceIds: items.map((item) => item.id),
        generatedAt: new Date().toISOString(),
      });
    }

    if (insights.length === 0) {
      insights.push({
        id: `insight:baseline:${Date.now()}`,
        title: "Baseline intelligence",
        summary: `No external signals were supplied. Baseline reasoning was created for objective: ${request.objective}.`,
        confidence: 0.5,
        priority: "medium",
        evidenceIds: [],
        generatedAt: new Date().toISOString(),
      });
    }

    return insights.sort((a, b) => b.confidence - a.confidence);
  }

  private groupByType(
    signals: readonly IntelligenceSignal[],
  ): Map<string, IntelligenceSignal[]> {
    const grouped = new Map<string, IntelligenceSignal[]>();
    for (const signal of signals) {
      const current = grouped.get(signal.type) ?? [];
      current.push(signal);
      grouped.set(signal.type, current);
    }
    return grouped;
  }

  private priority(
    confidence: number,
    count: number,
  ): "low" | "medium" | "high" | "critical" {
    if (confidence >= 0.9 && count >= 3) return "critical";
    if (confidence >= 0.75) return "high";
    if (confidence >= 0.5) return "medium";
    return "low";
  }
}