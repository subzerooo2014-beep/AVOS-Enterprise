import { Injectable } from '@nestjs/common';
import { MarketplaceOpportunity } from './global-ecosystem-intelligence.types';

@Injectable()
export class MarketplaceIntelligenceCoordinatorService {
  rank(opportunities: MarketplaceOpportunity[]) {
    return [...opportunities]
      .map((opportunity) => ({
        ...opportunity,
        opportunityScore: Math.round(
          opportunity.demandScore * 0.35 +
            opportunity.marginScore * 0.3 +
            (100 - opportunity.competitionScore) * 0.2 +
            Math.max(
              0,
              opportunity.demandScore - opportunity.supplyScore,
            ) *
              0.15,
        ),
      }))
      .sort(
        (left, right) =>
          right.opportunityScore - left.opportunityScore,
      );
  }
}