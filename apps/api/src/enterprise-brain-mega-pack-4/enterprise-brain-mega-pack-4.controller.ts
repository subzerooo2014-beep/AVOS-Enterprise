import {
  Body,
  Controller,
  Get,
  Param,
  Post
} from "@nestjs/common";
import { EnterpriseBrainMegaPack4Service } from "./enterprise-brain-mega-pack-4.service";
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
import { BrainLearningAuditService } from "./observability/brain-learning-audit.service";
import {
  BrainExperienceRecord,
  BrainFeedbackRecord,
  BrainPrediction,
  BrainRecommendation,
  BrainRiskAssessment
} from "./enterprise-brain-mega-pack-4.types";

@Controller("enterprise-brain-v4")
export class EnterpriseBrainMegaPack4Controller {
  constructor(
    private readonly pack: EnterpriseBrainMegaPack4Service,
    private readonly experiences: BrainExperienceService,
    private readonly feedback: BrainFeedbackService,
    private readonly patterns: BrainPatternLearningService,
    private readonly learning: BrainContinuousLearningService,
    private readonly predictions: BrainPredictionService,
    private readonly recommendations: BrainRecommendationService,
    private readonly risks: BrainRiskAssessmentService,
    private readonly opportunities: BrainOpportunityDetectionService,
    private readonly simulations: BrainScenarioSimulationService,
    private readonly health: BrainLearningIntelligenceHealthService,
    private readonly audit: BrainLearningAuditService
  ) {}

  @Get("status")
  status() {
    return this.pack.status();
  }

  @Get("verification")
  verification() {
    return this.pack.verification();
  }

  @Post("experiences")
  addExperience(
    @Body()
    body: {
      sourceType: string;
      sourceId: string;
      context: Record<string, unknown>;
      actions: string[];
      outcome: BrainExperienceRecord["outcome"];
      score: number;
      lessons: string[];
      evidenceIds?: string[];
      actorIdentityId: string;
      correlationId: string;
    }
  ) {
    return this.experiences.add(body);
  }

  @Get("experiences")
  experienceList() {
    return {
      summary: this.experiences.summary(),
      items: this.experiences.list()
    };
  }

  @Post("feedback")
  addFeedback(
    @Body()
    body: {
      type: BrainFeedbackRecord["type"];
      sourceIdentityId?: string;
      subjectId: string;
      rating: number;
      message: string;
      labels?: string[];
      metadata?: Record<string, unknown>;
      actorIdentityId: string;
      correlationId: string;
    }
  ) {
    return this.feedback.add(body);
  }

  @Get("feedback")
  feedbackList() {
    return {
      summary: this.feedback.summary(),
      items: this.feedback.list()
    };
  }

  @Post("patterns/detect")
  detectPatterns(
    @Body()
    body: {
      actorIdentityId: string;
      correlationId: string;
    }
  ) {
    return this.patterns.detect(body);
  }

  @Get("patterns")
  patternList() {
    return {
      summary: this.patterns.summary(),
      items: this.patterns.list()
    };
  }

  @Post("learning/propose")
  proposeLearning(
    @Body()
    body: {
      title: string;
      description: string;
      sourcePatternIds: string[];
      sourceFeedbackIds: string[];
      confidence: number;
      proposedChanges: string[];
      requiresHumanApproval: boolean;
      actorIdentityId: string;
      correlationId: string;
    }
  ) {
    return this.learning.propose(body);
  }

  @Post("learning/:id/approve")
  approveLearning(
    @Param("id") id: string,
    @Body()
    body: {
      approvedByIdentityId: string;
      approve: boolean;
      correlationId: string;
    }
  ) {
    return this.learning.approve({
      learningId: id,
      ...body
    });
  }

  @Post("learning/:id/apply")
  applyLearning(
    @Param("id") id: string,
    @Body()
    body: {
      actorIdentityId: string;
      correlationId: string;
    }
  ) {
    return this.learning.apply({
      learningId: id,
      ...body
    });
  }

  @Get("learning")
  learningList() {
    return {
      summary: this.learning.summary(),
      items: this.learning.list()
    };
  }

  @Post("predictions")
  createPrediction(
    @Body()
    body: {
      subjectId: string;
      horizon: BrainPrediction["horizon"];
      drivers: string[];
      assumptions: string[];
      risks?: string[];
      actorIdentityId: string;
      correlationId: string;
    }
  ) {
    return this.predictions.create(body);
  }

  @Get("predictions")
  predictionList() {
    return {
      summary: this.predictions.summary(),
      items: this.predictions.list()
    };
  }

  @Post("recommendations")
  createRecommendation(
    @Body()
    body: {
      subjectId: string;
      title: string;
      description: string;
      priority: BrainRecommendation["priority"];
      expectedValue: number;
      confidence: number;
      actions: string[];
      risks?: string[];
      requiresHumanApproval: boolean;
      actorIdentityId: string;
      correlationId: string;
    }
  ) {
    return this.recommendations.create(body);
  }

  @Post("recommendations/:id/decide")
  decideRecommendation(
    @Param("id") id: string,
    @Body()
    body: {
      identityId: string;
      approve: boolean;
      correlationId: string;
    }
  ) {
    return this.recommendations.decide({
      recommendationId: id,
      ...body
    });
  }

  @Post("recommendations/:id/implement")
  implementRecommendation(
    @Param("id") id: string,
    @Body()
    body: {
      actorIdentityId: string;
      correlationId: string;
    }
  ) {
    return this.recommendations.implement({
      recommendationId: id,
      ...body
    });
  }

  @Get("recommendations")
  recommendationList() {
    return {
      summary: this.recommendations.summary(),
      items: this.recommendations.list()
    };
  }

  @Post("risks/assess")
  assessRisk(
    @Body()
    body: {
      subjectId: string;
      factors: BrainRiskAssessment["factors"];
      mitigations?: string[];
      actorIdentityId: string;
      correlationId: string;
    }
  ) {
    return this.risks.assess(body);
  }

  @Get("risks")
  riskList() {
    return {
      summary: this.risks.summary(),
      items: this.risks.list()
    };
  }

  @Post("opportunities")
  detectOpportunity(
    @Body()
    body: {
      subjectId: string;
      title: string;
      description: string;
      valueScore: number;
      feasibilityScore: number;
      urgencyScore: number;
      confidence: number;
      requirements?: string[];
      risks?: string[];
      actorIdentityId: string;
      correlationId: string;
    }
  ) {
    return this.opportunities.detect(body);
  }

  @Post("opportunities/:id/decide")
  decideOpportunity(
    @Param("id") id: string,
    @Body()
    body: {
      identityId: string;
      approve: boolean;
      correlationId: string;
    }
  ) {
    return this.opportunities.decide({
      opportunityId: id,
      ...body
    });
  }

  @Get("opportunities")
  opportunityList() {
    return {
      summary: this.opportunities.summary(),
      items: this.opportunities.list()
    };
  }

  @Post("simulations")
  runSimulation(
    @Body()
    body: {
      name: string;
      baseline: Record<string, number>;
      assumptions: Record<string, number>;
      actorIdentityId: string;
      correlationId: string;
    }
  ) {
    return this.simulations.run(body);
  }

  @Get("simulations")
  simulationList() {
    return {
      summary: this.simulations.summary(),
      items: this.simulations.list()
    };
  }

  @Post("health/calculate")
  calculateHealth(
    @Body()
    body: {
      actorIdentityId: string;
      correlationId: string;
    }
  ) {
    return this.health.calculate(body);
  }

  @Get("health")
  healthList() {
    return {
      summary: this.health.summary(),
      items: this.health.list()
    };
  }

  @Get("audit")
  auditList() {
    return {
      summary: this.audit.summary(),
      items: this.audit.list()
    };
  }
}
