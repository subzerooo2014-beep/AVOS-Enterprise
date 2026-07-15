import { Injectable } from '@nestjs/common';
import { Opportunity } from './enterprise-crm-growth.types';

@Injectable()
export class SalesPipelineIntelligenceService {
  analyze(opportunities: Opportunity[]) {
    const active = opportunities.filter(
      (opportunity) => !['won', 'lost'].includes(opportunity.stage),
    );

    return {
      active,
      totalValue: active.reduce(
        (sum, opportunity) => sum + opportunity.value,
        0,
      ),
      weightedValue: Number(
        active
          .reduce(
            (sum, opportunity) =>
              sum + opportunity.value * opportunity.probability,
            0,
          )
          .toFixed(2),
      ),
      byStage: Object.fromEntries(
        ['discovery', 'proposal', 'negotiation'].map((stage) => [
          stage,
          active.filter((opportunity) => opportunity.stage === stage)
            .length,
        ]),
      ),
    };
  }
}