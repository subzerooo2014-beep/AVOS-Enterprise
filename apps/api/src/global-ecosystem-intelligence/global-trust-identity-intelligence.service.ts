import { Injectable } from '@nestjs/common';
import {
  EcosystemPartner,
  FederationMember,
} from './global-ecosystem-intelligence.types';

@Injectable()
export class GlobalTrustIdentityIntelligenceService {
  evaluate(
    partners: EcosystemPartner[],
    members: FederationMember[],
  ) {
    const partnerTrust =
      partners.reduce((sum, partner) => sum + partner.trustScore, 0) /
      Math.max(1, partners.length);
    const federationTrust =
      members.reduce((sum, member) => sum + member.trustScore, 0) /
      Math.max(1, members.length);

    return {
      partnerTrust: Math.round(partnerTrust),
      federationTrust: Math.round(federationTrust),
      globalTrustScore: Math.round(
        partnerTrust * 0.6 + federationTrust * 0.4,
      ),
      lowTrustPartners: partners
        .filter((partner) => partner.trustScore < 60)
        .map((partner) => partner.id),
      lowTrustMembers: members
        .filter((member) => member.trustScore < 60)
        .map((member) => member.id),
    };
  }
}