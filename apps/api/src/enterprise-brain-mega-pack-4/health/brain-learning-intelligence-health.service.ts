import { Injectable } from "@nestjs/common";
import { BrainLearningIntelligenceHealthIndex } from "../enterprise-brain-mega-pack-4.types";
import { BrainExperienceService } from "../experience/brain-experience.service";
import { BrainFeedbackService } from "../feedback/brain-feedback.service";
import { BrainPatternLearningService } from "../patterns/brain-pattern-learning.service";
import { BrainContinuousLearningService } from "../learning/brain-continuous-learning.service";
import { BrainPredictionService } from "../prediction/brain-prediction.service";
import { BrainRecommendationService } from "../recommendation/brain-recommendation.service";
import { BrainRiskAssessmentService } from "../risk/brain-risk-assessment.service";
import { BrainOpportunityDetectionService } from "../opportunity/brain-opportunity-detection.service";
import { BrainScenarioSimulationService } from "../simulation/brain-scenario-simulation.service";
import { BrainLearningAuditService } from "../observability/brain-learning-audit.service";

@Injectable()
export class BrainLearningIntelligenceHealthService {
  private readonly indexes =
    new Map<string, BrainLearningIntelligenceHealthIndex>();

  constructor(
    private readonly experiences: BrainExperienceService,
    private readonly feedback: BrainFeedbackService,
    private readonly patterns: BrainPatternLearningService,
    private readonly learning: BrainContinuousLearningService,
    private readonly predictions: BrainPredictionService,
    private readonly recommendations: BrainRecommendationService,
    private readonly risks: BrainRiskAssessmentService,
    private readonly opportunities: BrainOpportunityDetectionService,
    private readonly simulations: BrainScenarioSimulationService,
    private readonly audit: BrainLearningAuditService
  ) {}

  list() {
    return Array.from(this.indexes.values());
  }

  calculate(input: {
    actorIdentityId: string;
    correlationId: string;
  }) {
    const experience = this.experiences.summary();
    const feedback = this.feedback.summary();
    const patterns = this.patterns.summary();
    const learning = this.learning.summary();
    const prediction = this.predictions.summary();
    const recommendation = this.recommendations.summary();
    const risk = this.risks.summary();
    const opportunity = this.opportunities.summary();
    const simulation = this.simulations.summary();

    const experienceScore =
      experience.failure === 0 ? 100 : Math.max(0, 100 - experience.failure * 15);

    const feedbackScore =
      feedback.total === 0
        ? 100
        : Math.max(0, feedback.averageRating);

    const patternScore =
      patterns.highImpact === 0 ? 100 : Math.max(0, 100 - patterns.highImpact * 15);

    const learningScore =
      learning.total === 0
        ? 100
        : Number(
            (
              (
                learning.validated +
                learning.applied
              ) /
              learning.total *
              100
            ).toFixed(2)
          );

    const predictionScore =
      prediction.total === 0 ? 100 : prediction.averageConfidence;

    const recommendationScore =
      recommendation.total === 0
        ? 100
        : Number(
            (
              (
                recommendation.approved +
                recommendation.implemented
              ) /
              recommendation.total *
              100
            ).toFixed(2)
          );

    const riskScore =
      risk.high === 0 ? 100 : Math.max(0, 100 - risk.high * 20);

    const opportunityScore =
      opportunity.total === 0
        ? 100
        : Number(
            (
              opportunity.approved /
              opportunity.total *
              100
            ).toFixed(2)
          );

    const simulationScore =
      simulation.highRisk === 0 ? 100 : Math.max(0, 100 - simulation.highRisk * 20);

    const score = Number(
      (
        experienceScore * 0.1 +
        feedbackScore * 0.1 +
        patternScore * 0.1 +
        learningScore * 0.15 +
        predictionScore * 0.1 +
        recommendationScore * 0.15 +
        riskScore * 0.1 +
        opportunityScore * 0.1 +
        simulationScore * 0.1
      ).toFixed(2)
    );

    const reasons: string[] = [];

    if (experienceScore < 90) reasons.push("Experience outcomes contain failures.");
    if (feedbackScore < 90) reasons.push("Feedback quality is below target.");
    if (learningScore < 90) reasons.push("Learning records require validation or application.");
    if (recommendationScore < 90) reasons.push("Recommendations require governance decisions.");
    if (riskScore < 90) reasons.push("High-risk assessments require mitigation.");
    if (opportunityScore < 90) reasons.push("Detected opportunities require review.");

    if (reasons.length === 0) {
      reasons.push("Enterprise Brain learning and intelligence are healthy.");
    }

    const index: BrainLearningIntelligenceHealthIndex = {
      id: `brain-learning-intelligence-health:${Date.now()}:${this.indexes.size + 1}`,
      score,
      level: this.level(score),
      metrics: {
        experienceScore,
        feedbackScore,
        patternScore,
        learningScore,
        predictionScore,
        recommendationScore,
        riskScore,
        opportunityScore,
        simulationScore
      },
      reasons,
      calculatedAt: new Date().toISOString()
    };

    this.indexes.set(index.id, index);

    this.audit.record({
      correlationId: input.correlationId,
      category: "health",
      action: "brain-learning-intelligence-health-calculated",
      subjectId: index.id,
      actorIdentityId: input.actorIdentityId,
      outcome:
        score >= 75
          ? "success"
          : score >= 50
            ? "warning"
            : "failure",
      metadata: {
        score,
        level: index.level
      }
    });

    return index;
  }

  summary() {
    const items = this.list();

    return {
      total: items.length,
      latestScore:
        items.length === 0
          ? 0
          : items[items.length - 1]?.score ?? 0,
      healthy:
        items.filter(
          (x) =>
            x.level === "healthy" ||
            x.level === "excellent"
        ).length
    };
  }

  private level(
    score: number
  ): BrainLearningIntelligenceHealthIndex["level"] {
    if (score >= 90) return "excellent";
    if (score >= 75) return "healthy";
    if (score >= 60) return "stable";
    if (score >= 40) return "degraded";
    return "critical";
  }
}
