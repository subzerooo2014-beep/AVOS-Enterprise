import { Module } from "@nestjs/common";
import { EnterpriseBrainMegaPack4Controller } from "./enterprise-brain-mega-pack-4.controller";
import { EnterpriseBrainMegaPack4Service } from "./enterprise-brain-mega-pack-4.service";
import { BrainLearningAuditService } from "./observability/brain-learning-audit.service";
import { BrainExperienceService } from "./experience/brain-experience.service";
import { BrainFeedbackService } from "./feedback/brain-feedback.service";
import { BrainPatternLearningService } from "./patterns/brain-pattern-learning.service";
import { BrainContinuousLearningService } from "./learning/brain-continuous-learning.service";
import { BrainPredictionService } from "./prediction/brain-prediction.service";
import { BrainRecommendationService } from "./recommendation/brain-recommendation.service";
import { BrainRiskAssessmentService } from "./risk/brain-risk-assessment.service";
import { BrainOpportunityDetectionService } from "./opportunity/brain-opportunity-detection.service";
import { BrainScenarioSimulationService } from "./simulation/brain-scenario-simulation.service";
import { BrainLearningIntelligenceHealthService } from "./health/brain-learning-intelligence-health.service";

@Module({
  controllers: [EnterpriseBrainMegaPack4Controller],
  providers: [
    EnterpriseBrainMegaPack4Service,
    BrainLearningAuditService,
    BrainExperienceService,
    BrainFeedbackService,
    BrainPatternLearningService,
    BrainContinuousLearningService,
    BrainPredictionService,
    BrainRecommendationService,
    BrainRiskAssessmentService,
    BrainOpportunityDetectionService,
    BrainScenarioSimulationService,
    BrainLearningIntelligenceHealthService
  ],
  exports: [
    EnterpriseBrainMegaPack4Service,
    BrainLearningAuditService,
    BrainExperienceService,
    BrainFeedbackService,
    BrainPatternLearningService,
    BrainContinuousLearningService,
    BrainPredictionService,
    BrainRecommendationService,
    BrainRiskAssessmentService,
    BrainOpportunityDetectionService,
    BrainScenarioSimulationService,
    BrainLearningIntelligenceHealthService
  ]
})
export class EnterpriseBrainMegaPack4Module {}
