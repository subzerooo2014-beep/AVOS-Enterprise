import { Injectable } from '@nestjs/common';
import { CustomerProfile } from './enterprise-crm-growth.types';

@Injectable()
export class SegmentationPersonalizationAiService {
  segment(customers: CustomerProfile[]) {
    return customers.map((customer) => ({
      customerId: customer.id,
      segment:
        customer.lifetimeValue >= 100000
          ? 'vip'
          : customer.engagementScore >= 75
            ? 'high-engagement'
            : customer.engagementScore < 40
              ? 'reengagement'
              : customer.segment,
      recommendations: [
        customer.lifetimeValue >= 100000 ? 'premium-offers' : 'standard-offers',
        customer.engagementScore < 40 ? 'win-back-message' : 'personalized-feed',
      ],
    }));
  }
}