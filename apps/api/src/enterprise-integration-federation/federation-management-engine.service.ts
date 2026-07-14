import { Injectable } from '@nestjs/common';
import { FederationNode } from './enterprise-integration-federation.types';

@Injectable()
export class FederationManagementEngineService {
  manage(nodes: FederationNode[]) {
    const accepted = nodes.filter(
      (node) => node.trustScore >= 70 && node.healthScore >= 65,
    );
    const isolated = nodes.filter(
      (node) => node.trustScore < 70 || node.healthScore < 65,
    );

    return {
      federationId: `federation-${Date.now()}`,
      acceptedNodes: accepted.map((node) => node.id),
      isolatedNodes: isolated.map((node) => node.id),
      identityProviders: [
        ...new Set(accepted.map((node) => node.identityProvider)),
      ],
      policyVersions: [
        ...new Set(accepted.map((node) => node.policyVersion)),
      ],
      regions: [...new Set(accepted.map((node) => node.region))],
    };
  }
}