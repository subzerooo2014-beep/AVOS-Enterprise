import { Injectable } from "@nestjs/common";
import type { FlowRecommendation } from "./core-flow-intelligence.types";

@Injectable()
export class CoreFlowRecommendationService {
  private readonly recommendations: FlowRecommendation[] = [];

  create(dto: any) {
    const recommendation: FlowRecommendation = {
      id: `recommendation_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      executionId: String(dto?.executionId ?? "unknown"),
      category: String(dto?.category ?? "optimization"),
      title: String(dto?.title ?? "Optimize core flow execution"),
      rationale: String(dto?.rationale ?? "Derived from flow telemetry."),
      confidence: Math.min(Math.max(Number(dto?.confidence ?? 0.8), 0), 1),
      priority: Math.min(Math.max(Number(dto?.priority ?? 50), 1), 100),
      createdAt: new Date().toISOString(),
    };

    this.recommendations.push(recommendation);
    return recommendation;
  }

  findAll(query: any = {}) {
    return this.recommendations
      .filter((item) => !query.executionId || item.executionId === query.executionId)
      .filter((item) => !query.category || item.category === query.category)
      .sort((a, b) => b.priority - a.priority || b.confidence - a.confidence);
  }

  generate(executionId: string, context: any = {}) {
    const output: FlowRecommendation[] = [];

    if (Number(context.durationMs ?? 0) > Number(context.targetMs ?? 0)) {
      output.push(
        this.create({
          executionId,
          category: "performance",
          title: "Reduce execution latency",
          rationale: "Observed duration exceeded the target.",
          confidence: 0.92,
          priority: 90,
        }),
      );
    }

    if (Number(context.attempts ?? 0) >= 3) {
      output.push(
        this.create({
          executionId,
          category: "resilience",
          title: "Review retry and dependency strategy",
          rationale: "Execution required multiple attempts.",
          confidence: 0.88,
          priority: 85,
        }),
      );
    }

    if (Boolean(context.highCost)) {
      output.push(
        this.create({
          executionId,
          category: "cost",
          title: "Optimize resource consumption",
          rationale: "Execution cost exceeded the configured threshold.",
          confidence: 0.86,
          priority: 80,
        }),
      );
    }

    if (output.length === 0) {
      output.push(
        this.create({
          executionId,
          category: "quality",
          title: "Maintain current execution profile",
          rationale: "No material anomalies detected.",
          confidence: 0.8,
          priority: 40,
        }),
      );
    }

    return output;
  }
}
