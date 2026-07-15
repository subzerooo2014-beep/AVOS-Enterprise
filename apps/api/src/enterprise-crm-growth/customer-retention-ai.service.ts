import { Injectable } from '@nestjs/common';
import { CustomerProfile } from './enterprise-crm-growth.types';

@Injectable()
export class CustomerRetentionAiService {
  recommend(customer: CustomerProfile) {
    const actions: string[] = [];

    if (customer.engagementScore < 50) {
      actions.push('launch-reengagement-campaign');
    }
    if (customer.satisfactionScore < 60) {
      actions.push('customer-success-outreach');
    }
    if (customer.lifetimeValue > 100000) {
      actions.push('assign-vip-manager');
    }

    return {
      customerId: customer.id,
      actions,
      priority:
        actions.length >= 2 ? 'high' : actions.length === 1 ? 'medium' : 'low',
    };
  }
}