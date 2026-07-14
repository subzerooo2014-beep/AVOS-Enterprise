import { Injectable } from "@nestjs/common";
import { randomUUID } from "node:crypto";
import { EnterpriseOptimizationRecommendation } from "./enterprise-e7.types";

@Injectable()
export class EnterpriseOptimizationRecommendationService {
  private readonly recommendations = new Map<
    string,
    EnterpriseOptimizationRecommendation
  >();

  create(input: {
    category: EnterpriseOptimizationRecommendation["category"];
    title: string;
    action: string;
    expectedImpact?: number;
  }) {
    const recommendation: EnterpriseOptimizationRecommendation = {
      id: randomUUID(),
      category: input.category,
      title: input.title,
      action: input.action,
      expectedImpact: Math.min(100, Math.max(0, input.expectedImpact ?? 10)),
      status: "PROPOSED",
      createdAt: new Date().toISOString(),
    };

    this.recommendations.set(recommendation.id, recommendation);
    return recommendation;
  }

  apply(id: string) {
    const recommendation = this.recommendations.get(id);
    if (!recommendation) {
      throw new Error(`Optimization recommendation not found: ${id}`);
    }

    recommendation.status = "APPLIED";
    recommendation.appliedAt = new Date().toISOString();
    return recommendation;
  }

  list() {
    return [...this.recommendations.values()];
  }

  count() {
    return this.recommendations.size;
  }

  appliedCount() {
    return this.list().filter((item) => item.status === "APPLIED").length;
  }
}