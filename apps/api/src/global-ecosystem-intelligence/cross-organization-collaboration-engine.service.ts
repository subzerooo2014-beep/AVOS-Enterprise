import { Injectable } from '@nestjs/common';
import { EcosystemPartner } from './global-ecosystem-intelligence.types';

@Injectable()
export class CrossOrganizationCollaborationEngineService {
  coordinate(partners: EcosystemPartner[], objective: string) {
    const eligible = partners.filter(
      (partner) =>
        partner.status === 'active' &&
        partner.trustScore >= 70 &&
        partner.performanceScore >= 65,
    );

    const channels: Array<{
      from: string;
      to: string;
      objective: string;
      status: 'connected';
    }> = [];

    for (let left = 0; left < eligible.length; left += 1) {
      for (let right = left + 1; right < eligible.length; right += 1) {
        channels.push({
          from: eligible[left].id,
          to: eligible[right].id,
          objective,
          status: 'connected',
        });
      }
    }

    return {
      objective,
      eligiblePartners: eligible.map((partner) => partner.id),
      channels,
      collaborationCoverage: Math.min(100, eligible.length * 15),
    };
  }
}