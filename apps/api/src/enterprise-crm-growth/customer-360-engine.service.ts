import { Injectable } from '@nestjs/common';
import {
  CustomerInteraction,
  CustomerProfile,
  Opportunity,
} from './enterprise-crm-growth.types';

@Injectable()
export class Customer360EngineService {
  build(
    customer: CustomerProfile,
    interactions: CustomerInteraction[],
    opportunities: Opportunity[],
  ) {
    const customerInteractions = interactions.filter(
      (interaction) => interaction.customerId === customer.id,
    );
    const customerOpportunities = opportunities.filter(
      (opportunity) => opportunity.customerId === customer.id,
    );

    return {
      customer,
      interactions: customerInteractions,
      opportunities: customerOpportunities,
      totalOpportunityValue: customerOpportunities.reduce(
        (sum, opportunity) => sum + opportunity.value,
        0,
      ),
      averageSentiment:
        customerInteractions.reduce(
          (sum, interaction) => sum + interaction.sentiment,
          0,
        ) / Math.max(1, customerInteractions.length),
    };
  }
}