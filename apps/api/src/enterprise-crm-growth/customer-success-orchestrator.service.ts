import { Injectable } from '@nestjs/common';
import {
  CustomerFeedback,
  CustomerInteraction,
  CustomerProfile,
  Opportunity,
} from './enterprise-crm-growth.types';
import { Customer360EngineService } from './customer-360-engine.service';
import { CustomerHealthScoreEngineService } from './customer-health-score-engine.service';
import { ChurnPredictionEngineService } from './churn-prediction-engine.service';
import { CustomerRetentionAiService } from './customer-retention-ai.service';
import { CustomerFeedbackNpsEngineService } from './customer-feedback-nps-engine.service';

@Injectable()
export class CustomerSuccessOrchestratorService {
  constructor(
    private readonly customer360: Customer360EngineService,
    private readonly health: CustomerHealthScoreEngineService,
    private readonly churn: ChurnPredictionEngineService,
    private readonly retention: CustomerRetentionAiService,
    private readonly feedback: CustomerFeedbackNpsEngineService,
  ) {}

  run(input: {
    customer: CustomerProfile;
    interactions: CustomerInteraction[];
    opportunities: Opportunity[];
    feedback: CustomerFeedback[];
  }) {
    return {
      customer360: this.customer360.build(
        input.customer,
        input.interactions,
        input.opportunities,
      ),
      health: this.health.score(input.customer),
      churn: this.churn.predict(input.customer),
      retention: this.retention.recommend(input.customer),
      feedback: this.feedback.calculate(input.feedback),
    };
  }
}