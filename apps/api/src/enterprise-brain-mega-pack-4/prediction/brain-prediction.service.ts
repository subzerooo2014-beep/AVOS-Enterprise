import { Injectable } from "@nestjs/common";
import { BrainPrediction } from "../enterprise-brain-mega-pack-4.types";
import { BrainExperienceService } from "../experience/brain-experience.service";
import { BrainLearningAuditService } from "../observability/brain-learning-audit.service";

@Injectable()
export class BrainPredictionService {
  private readonly predictions = new Map<string, BrainPrediction>();

  constructor(
    private readonly experiences: BrainExperienceService,
    private readonly audit: BrainLearningAuditService
  ) {}

  list() {
    return Array.from(this.predictions.values());
  }

  create(input: {
    subjectId: string;
    horizon: BrainPrediction["horizon"];
    drivers: string[];
    assumptions: string[];
    risks?: string[];
    actorIdentityId: string;
    correlationId: string;
  }) {
    const summary = this.experiences.summary();
    const successRate =
      summary.total === 0
        ? 0.5
        : summary.success / summary.total;

    const probability = Math.max(
      0,
      Math.min(100, successRate * 100)
    );

    const confidence = Math.min(
      95,
      50 + summary.total * 5
    );

    const prediction: BrainPrediction = {
      id: `brain-prediction:${Date.now()}:${this.predictions.size + 1}`,
      subjectId: input.subjectId,
      horizon: input.horizon,
      prediction:
        probability >= 70
          ? "Positive outcome is likely."
          : probability >= 40
            ? "Outcome is uncertain."
            : "Negative outcome risk is elevated.",
      probability: Number(probability.toFixed(2)),
      confidence,
      drivers: Array.from(new Set(input.drivers)),
      assumptions: Array.from(new Set(input.assumptions)),
      risks: Array.from(new Set(input.risks ?? [])),
      createdAt: new Date().toISOString()
    };

    this.predictions.set(prediction.id, prediction);

    this.audit.record({
      correlationId: input.correlationId,
      category: "prediction",
      action: "brain-prediction-created",
      subjectId: prediction.id,
      actorIdentityId: input.actorIdentityId,
      outcome: "success",
      metadata: {
        probability: prediction.probability,
        confidence: prediction.confidence
      }
    });

    return prediction;
  }

  summary() {
    const items = this.list();

    return {
      total: items.length,
      highProbability:
        items.filter((x) => x.probability >= 70).length,
      averageConfidence:
        items.length === 0
          ? 0
          : Number(
              (
                items.reduce((sum, x) => sum + x.confidence, 0) /
                items.length
              ).toFixed(2)
            )
    };
  }
}
