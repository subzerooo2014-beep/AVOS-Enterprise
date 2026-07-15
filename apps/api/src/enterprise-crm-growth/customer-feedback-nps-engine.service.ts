import { Injectable } from '@nestjs/common';
import { CustomerFeedback } from './enterprise-crm-growth.types';

@Injectable()
export class CustomerFeedbackNpsEngineService {
  calculate(feedback: CustomerFeedback[]) {
    const promoters = feedback.filter((item) => item.score >= 9).length;
    const detractors = feedback.filter((item) => item.score <= 6).length;
    const total = Math.max(1, feedback.length);

    return {
      responses: feedback.length,
      promoters,
      detractors,
      nps: Math.round(
        (promoters / total) * 100 -
          (detractors / total) * 100,
      ),
    };
  }
}