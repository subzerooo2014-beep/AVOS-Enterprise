import { Injectable } from '@nestjs/common';
import { Opportunity } from './enterprise-crm-growth.types';

@Injectable()
export class OpportunityManagementEngineService {
  evaluate(opportunities: Opportunity[]) {
    return opportunities.map((opportunity) => ({
      ...opportunity,
      weightedValue: Number(
        (opportunity.value * opportunity.probability).toFixed(2),
      ),
      active: !['won', 'lost'].includes(opportunity.stage),
    }));
  }
}