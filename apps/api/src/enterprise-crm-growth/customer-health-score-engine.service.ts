import { Injectable } from '@nestjs/common';
import { CustomerProfile } from './enterprise-crm-growth.types';

@Injectable()
export class CustomerHealthScoreEngineService {
  score(customer: CustomerProfile) {
    const daysSinceActivity = Math.max(
      0,
      Math.floor(
        (Date.now() - new Date(customer.lastActivityAt).getTime()) /
          86400000,
      ),
    );

    const recencyScore = Math.max(0, 100 - daysSinceActivity * 2);
    const healthScore = Math.round(
      customer.engagementScore * 0.35 +
        customer.satisfactionScore * 0.4 +
        recencyScore * 0.25,
    );

    return {
      customerId: customer.id,
      healthScore,
      status:
        healthScore >= 80
          ? 'healthy'
          : healthScore >= 60
            ? 'watch'
            : 'at-risk',
    };
  }
}