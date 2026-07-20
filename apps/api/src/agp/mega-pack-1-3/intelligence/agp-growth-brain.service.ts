import { Injectable } from "@nestjs/common";
import { randomUUID } from "crypto";
import {
  GrowthDecision,
  GrowthRecommendation,
  GrowthSignal,
} from "../contracts/agp-intelligence.contracts";
import { AgpRuntimeService } from "../runtime/agp-runtime.service";

@Injectable()
export class AgpGrowthBrainService {
  private readonly recommendations: GrowthRecommendation[] = [];
  private readonly decisions: GrowthDecision[] = [];

  constructor(private readonly runtime: AgpRuntimeService) {}

  recommend(input: {
    objective: string;
    signals: GrowthSignal[];
  }): GrowthRecommendation {
    const normalizedConfidence =
      input.signals.length === 0
        ? 0.5
        : input.signals.reduce((sum, signal) => sum + signal.confidence, 0) /
          input.signals.length;

    const recommendation: GrowthRecommendation = {
      id: `agp-recommendation:${randomUUID()}`,
      objective: input.objective,
      recommendation:
        input.signals.length > 0
          ? "Prioritize the highest-confidence growth signal and validate it through a controlled experiment."
          : "Collect additional growth evidence before committing resources.",
      rationale: input.signals.map(
        (signal) =>
          `${signal.type} from ${signal.source} with confidence ${signal.confidence}`,
      ),
      confidence: Number(normalizedConfidence.toFixed(4)),
      expectedImpact: Number(
        (
          input.signals.reduce((sum, signal) => sum + signal.value, 0) /
          Math.max(input.signals.length, 1)
        ).toFixed(2),
      ),
      requiresHumanApproval: true,
      generatedAt: new Date().toISOString(),
    };

    this.recommendations.push(recommendation);
    this.runtime.increment("recommendations");
    return { ...recommendation, rationale: [...recommendation.rationale] };
  }

  decide(input: {
    objective: string;
    options: string[];
    evidence: string[];
    approvedBy?: string;
  }): GrowthDecision {
    const selectedOption = input.options[0] ?? "collect-more-evidence";
    const decision: GrowthDecision = {
      id: `agp-decision:${randomUUID()}`,
      objective: input.objective,
      selectedOption,
      alternatives: input.options.slice(1),
      rationale: [
        "Selected using deterministic evidence-first baseline.",
        "Human approval remains authoritative.",
      ],
      evidence: [...input.evidence],
      confidence: input.evidence.length > 0 ? 0.78 : 0.5,
      risk: input.evidence.length > 1 ? "medium" : "high",
      requiresHumanApproval: true,
      approvedBy: input.approvedBy,
      decidedAt: new Date().toISOString(),
    };

    this.decisions.push(decision);
    this.runtime.increment("decisions");
    return JSON.parse(JSON.stringify(decision)) as GrowthDecision;
  }

  history() {
    return {
      recommendations: this.recommendations.map((item) => ({
        ...item,
        rationale: [...item.rationale],
      })),
      decisions: this.decisions.map((item) =>
        JSON.parse(JSON.stringify(item)),
      ) as GrowthDecision[],
    };
  }
}