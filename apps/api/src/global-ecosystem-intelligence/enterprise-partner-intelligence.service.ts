import { Injectable } from '@nestjs/common';
import { EcosystemPartner } from './global-ecosystem-intelligence.types';

@Injectable()
export class EnterprisePartnerIntelligenceService {
  evaluate(partners: EcosystemPartner[]) {
    const evaluated = partners
      .map((partner) => {
        const score =
          partner.trustScore * 0.4 +
          partner.performanceScore * 0.35 +
          partner.integrationScore * 0.25;

        return {
          ...partner,
          partnerScore: Math.round(score),
          recommendedStatus:
            score >= 80
              ? 'active'
              : score >= 60
                ? partner.status
                : 'at-risk',
        };
      })
      .sort((left, right) => right.partnerScore - left.partnerScore);

    return {
      partners: evaluated,
      strongestPartner: evaluated[0] ?? null,
      atRiskPartners: evaluated
        .filter((partner) => partner.recommendedStatus === 'at-risk')
        .map((partner) => partner.id),
    };
  }
}