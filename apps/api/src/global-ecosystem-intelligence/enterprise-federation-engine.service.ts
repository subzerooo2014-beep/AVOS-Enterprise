import { Injectable } from '@nestjs/common';
import { FederationMember } from './global-ecosystem-intelligence.types';

@Injectable()
export class EnterpriseFederationEngineService {
  federate(members: FederationMember[]) {
    const accepted = members.filter((member) => member.trustScore >= 70);
    const rejected = members.filter((member) => member.trustScore < 70);

    return {
      federationId: `federation-${Date.now()}`,
      acceptedMembers: accepted.map((member) => member.id),
      rejectedMembers: rejected.map((member) => member.id),
      identityProviders: [
        ...new Set(accepted.map((member) => member.identityProvider)),
      ],
      policyVersions: [
        ...new Set(accepted.map((member) => member.policyVersion)),
      ],
    };
  }
}