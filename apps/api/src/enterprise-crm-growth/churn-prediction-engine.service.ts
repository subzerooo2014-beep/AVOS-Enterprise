import { Injectable } from '@nestjs/common';
import { CustomerProfile } from './enterprise-crm-growth.types';

@Injectable()
export class ChurnPredictionEngineService {
  predict(customer: CustomerProfile) {
    const daysInactive = Math.max(
      0,
      Math.floor(
        (Date.now() - new Date(customer.lastActivityAt).getTime()) /
          86400000,
      ),
    );

    const risk = Math.min(
      100,
      Math.round(
        (100 - customer.engagementScore) * 0.4 +
          (100 - customer.satisfactionScore) * 0.35 +
          Math.min(100, daysInactive * 2) * 0.25,
      ),
    );

    return {
      customerId: customer.id,
      risk,
      level: risk >= 70 ? 'high' : risk >= 40 ? 'medium' : 'low',
    };
  }
}